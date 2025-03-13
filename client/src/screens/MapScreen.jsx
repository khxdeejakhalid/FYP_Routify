import { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Text,
} from "react-native";
import MapView, { Marker, Polyline, AnimatedRegion } from "react-native-maps";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as Location from "expo-location";
import * as Speech from "expo-speech";

import { fonts } from "../utils/fonts";
import { colors } from "../utils/colors";
import { getWaypoints, getTurnsByRoute } from "../utils/api";
import { routifyConstantsService } from "../services/routifyConstantsService";
import { processRoute } from "../utils/routesProcessing.js";
import { mapUtils } from "../utils/mapUtils";
import { maneuverUtils } from "../utils/maneueverUtilityService";

import routeData from "../assets/json/Route1.json";
import CustomModal from "../components/CustomModal";

const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const MapScreen = () => {
  const routeId = 1;
  const navigation = useNavigation();

  // * Refs
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const JourneyIntervalRef = useRef(null);
  const isReverseAroundCornerManeuverActiveRef = useRef(false);
  const userLocation = useRef(
    new AnimatedRegion({
      latitude: 53.296626,
      longitude: -6.361573,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    }),
  ).current;

  // * State variables
  const [route, setRoute] = useState([]);
  const [turns, setTurns] = useState([]);
  const [isRouteLoaded, setIsRouteLoaded] = useState(false);
  const [currentInstruction, setCurrentInstruction] = useState(null);
  const [isJourneyStarted, setIsJourneyStarted] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 53.296626143012745,
    longitude: -6.361571573136808,
    heading: 90,
  });
  const [maneuverFeedback, setManeuverFeedback] = useState(null);

  // * Reverse Around Corner State Variables
  const [reverseAroundCornerTouchedKerb, setReverseAroundCornerTouchedKerb] =
    useState(false);

  const [modalText, setModalText] = useState("");
  const [modalHeader, setModalHeader] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);

  // * Constants
  let totalDeviations = [];
  let totalSpeed = [];
  let manueverStartTime = null;
  let manueverEndTime = null;
  let isManeueverActive = false;
  let speedHistory = [];
  let carIdleStateCount = 0;
  let startTime = 0;

  const msmReminders = routifyConstantsService.MSM_REMINDERS;
  const maneuvers = routifyConstantsService.MANEUVERS;
  const maneuversMap = routifyConstantsService.MANEUVERS_TYPE;
  const triggeredTurns = new Set();
  const MSMDistanceThreshold = 30;

  // * Hooks
  useEffect(() => {
    async function fetchRoute() {
      const response = await getWaypoints(routeId);
      if (response.success) {
        const transformedRoute = mapUtils.transformRoute(response.waypoints);
        setRoute(transformedRoute);
        setIsRouteLoaded(true);
      } else {
        setModalHeader("Failure");
        setModalText(response.description);
        setModalVisible(true);
      }
    }

    async function fetchTurns() {
      const response = await getTurnsByRoute(routeId);
      if (response.success) {
        const transformedTurns = mapUtils.transformTurns(response.turns);
        setTurns(transformedTurns);
      } else {
        setModalHeader("Failure");
        setModalText(response.description);
        setModalVisible(true);
      }
    }

    async function fetchRouteFromJSON() {
      const response = await processRoute(routeData);
      setRoute(response);
      setIsRouteLoaded(true);
    }

    fetchRoute();
    // fetchRouteFromJSON();
    fetchTurns();

    return () => clearJourneyInterval();
  }, []);

  // * Functions / Handlers
  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const playRemindersWithDelay = async (
    reminders,
    delay = 2000,
    showInstruction = true,
  ) => {
    for (const reminder of reminders) {
      Speech.speak(reminder);
      if (showInstruction) {
        setCurrentInstruction(reminder);
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    setCurrentInstruction(null);
  };

  const detectUpcomingTurn = (currentLat, currentLng) => {
    turns.forEach((turn) => {
      const distanceToTurn = mapUtils.getDistance(
        currentLat,
        currentLng,
        turn.latitude,
        turn.longitude,
      );

      if (distanceToTurn <= MSMDistanceThreshold && !triggeredTurns.has(turn)) {
        triggeredTurns.add(turn);
        playRemindersWithDelay(msmReminders, 1000);

        setTimeout(() => triggeredTurns.delete(turn), 60000);
      }
    });
  };

  const isReverseAroundCornerManeuver = (currLocation) => {
    const distanceToManouvere = mapUtils.getDistance(
      maneuvers[maneuversMap.REVERSE_PARKING].startPos.lat,
      maneuvers[maneuversMap.REVERSE_PARKING].startPos.lng,
      currLocation.latitude,
      currLocation.longitude,
    );

    // ? Reverse Around Corner Maneuver Has Started
    if (
      distanceToManouvere < 5 &&
      !isReverseAroundCornerManeuverActiveRef.current
    ) {
      manueverStartTime = new Date();
      isReverseAroundCornerManeuverActiveRef.current = true;
      playRemindersWithDelay(
        [
          routifyConstantsService.REVERSE_AROUND_CORNER_REMINDERS
            .STARTING_POINT,
        ],
        1000,
        false,
      );
      return true;
    }
    // ? Reverse Around Corner Maneuver Is In Progress
    else if (isReverseAroundCornerManeuverActiveRef.current) {
      return true;
    }

    return false;
  };

  const hasReverseAroundCornerManeueverEnded = (currLocation) => {
    if (isReverseAroundCornerManeuverActiveRef.current) {
      const distanceToEnd = mapUtils.getDistance(
        currLocation.latitude,
        currLocation.longitude,
        maneuvers[maneuversMap.REVERSE_PARKING].endPos.lat,
        maneuvers[maneuversMap.REVERSE_PARKING].endPos.lng,
      );

      if (distanceToEnd < 5) {
        playRemindersWithDelay(
          [
            routifyConstantsService.REVERSE_AROUND_CORNER_REMINDERS
              .ENDING_POINT,
          ],
          1000,
          false,
        );
        isReverseAroundCornerManeuverActiveRef.current = false;
        manueverEndTime = new Date();
        return true;
      }

      return false;
    }
  };

  const evaluateReverseAroundCornerManeuver = (
    currLocation,
    speed,
    timestamp,
  ) => {
    const kerbCoordinates = maneuvers[maneuversMap.REVERSE_PARKING].kerbs;

    if (isReverseAroundCornerManeuver(currLocation)) {
      // If Reverse around corner maneuver has started
      const { deviations, touchedKerb } =
        maneuverUtils.calculateDeviationsFromKerbs(
          kerbCoordinates,
          currLocation,
        );

      if (touchedKerb) {
        setReverseAroundCornerTouchedKerb(touchedKerb);
      }

      const minDeviation = maneuverUtils.getMinimumDeviation(deviations);

      if (minDeviation <= 1.5 && minDeviation > 1) {
        playRemindersWithDelay(
          [
            routifyConstantsService.REVERSE_AROUND_CORNER_REMINDERS
              .KERB_TOO_CLOSE,
          ],
          1000,
          false,
        );
      } else if (minDeviation > 3) {
        playRemindersWithDelay(
          [
            routifyConstantsService.REVERSE_AROUND_CORNER_REMINDERS
              .KERB_TOO_FAR,
          ],
          1000,
          false,
        );
      }

      totalDeviations.push(minDeviation);
      totalSpeed.push(speed);
    }

    if (hasReverseAroundCornerManeueverEnded(currLocation)) {
      const averageDeviation = maneuverUtils.getAverage(totalDeviations);
      const averageSpeed = maneuverUtils.getAverage(totalSpeed);

      // Reset total deviations & total speed
      totalDeviations = [];
      totalSpeed = [];

      if (reverseAroundCornerTouchedKerb) {
        console.log("Maneuver failed: You touched the kerb. Score: 0/5");
        setManeuverFeedback(
          "Maneuver failed: You touched the kerb. Score: 0/5",
        );
        return;
      }

      const timeTaken = (manueverEndTime - manueverStartTime) / (1000 * 60); // Convert to minutes

      // Calculate scores for each criterion
      const distanceScore = maneuverUtils.calculateReverseAroundCornerScore(
        averageDeviation,
        10,
        15,
      );
      const speedScore = maneuverUtils.calculateReverseAroundCornerScore(
        averageSpeed,
        1,
        2,
      );
      const timeScore = maneuverUtils.calculateReverseAroundCornerScore(
        timeTaken,
        0.5,
        1.5,
      );

      console.log("REVERSE AROUND CORNER MANUEVER STATS: ");
      console.log(`Average deviation: ${averageDeviation}`);
      console.log(`Average speed: ${averageSpeed}`);
      console.log(`Touched Kerb: ${reverseAroundCornerTouchedKerb}`);
      console.log(`Time Taken: ${timeTaken}`);
      console.log(`Distance Score: ${distanceScore}`);
      console.log(`Speed Score: ${speedScore}`);
      console.log(`Time Score: ${timeScore}`);

      // Calculate overall score
      const overallScore = maneuverUtils.calculateOverallScore(
        distanceScore,
        speedScore,
        timeScore,
      );

      console.log(`Overall Score: ${overallScore}`);

      // Provide feedback based on the overall score
      if (overallScore >= 4) {
        setManeuverFeedback(`Excellent! Your score: ${overallScore}/5`);
      } else if (overallScore >= 2) {
        setManeuverFeedback(`Good job! Your score: ${overallScore}/5`);
      } else {
        setManeuverFeedback(`Needs improvement. Your score: ${overallScore}/5`);
      }
    }
  };

  const startJourney = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return;
    }

    const goshoReminders = routifyConstantsService.GOSHO_REMINDERS;
    setIsJourneyStarted(true);
    playRemindersWithDelay(goshoReminders, 2000);
    simulateJourney();
  };

  const stopJourney = () => {
    const initialPosition = {
      latitude: route[0].latitude,
      longitude: route[0].longitude,
      heading: 90,
    };
    clearJourneyInterval();
    setIsJourneyStarted(false);
    setCurrentInstruction(null);
    setCurrentLocation(initialPosition);
    userLocation.timing(initialPosition).start();
    mapUtils.animateToRegion(mapRef, userLocation, initialPosition);
    Speech.stop();
    isReverseAroundCornerManeuverActiveRef.current = false;
  };

  const simulateJourney = async () => {
    // JourneyIntervalRef.current = setInterval(async () => {
    //   const { latitude, longitude, heading, speed, timestamp } =
    //     await mapUtils.getCurrentLocation();
    //   setCurrentLocation({ latitude, longitude, heading });
    //   evaluateReverseAroundCornerManeuver(
    //     { latitude, longitude, heading },
    //     speed,
    //     timestamp,
    //   );
    //   detectUpcomingTurn(latitude, longitude);
    //   mapUtils.animateToRegion(mapRef, userLocation, { latitude, longitude });
    // }, 3000);
    const locationSubscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      ({ coords: { latitude, longitude, heading, speed }, timestamp }) => {
        setCurrentLocation({ latitude, longitude, heading });
        detectUpcomingTurn(latitude, longitude);
        evaluateReverseAroundCornerManeuver(
          { latitude, longitude, heading },
          speed,
          timestamp,
        );
        mapUtils.animateToRegion(mapRef, userLocation, { latitude, longitude });
      },
    );
    JourneyIntervalRef.current = locationSubscription;
  };

  const clearJourneyInterval = () => {
    if (JourneyIntervalRef.current) {
      clearInterval(JourneyIntervalRef.current);
      JourneyIntervalRef.current = null;
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButtonWrapper} onPress={handleGoBack}>
        <Ionicons
          name={"arrow-back-outline"}
          color={colors.primary}
          size={25}
        />
      </TouchableOpacity>
      {isRouteLoaded && (
        <>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={{
              ...currentLocation,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            }}>
            {route.length > 0 && (
              <Polyline
                coordinates={route}
                strokeColor={colors.primary}
                strokeWidth={4}
              />
            )}

            <Marker.Animated
              ref={markerRef}
              coordinate={userLocation}
              title="Your Location"
              image={require("../assets/icons/navigator.png")}
              anchor={{ x: 0.5, y: 0.5 }}
              style={{
                transform: [{ rotate: `${currentLocation.heading}deg` }],
              }}
            />

            {/* Maneuvers Markers  */}
            {Object.values(maneuversMap).map((maneuverKey, index) => {
              return (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: maneuvers[maneuverKey].startPos.lat,
                    longitude: maneuvers[maneuverKey].startPos.lng,
                  }}
                  title={`${maneuverKey} Maneuver`}
                  description={maneuverKey}
                  pinColor={colors.primary}
                />
              );
            })}
          </MapView>

          {currentInstruction && (
            <View style={styles.instructionContainer}>
              <Text style={styles.instructionText}>{currentInstruction}</Text>
            </View>
          )}
          {isJourneyStarted ? (
            <TouchableOpacity style={styles.startButton} onPress={stopJourney}>
              <Text style={styles.startButtonText}>Stop Journey</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.startButton} onPress={startJourney}>
              <Text style={styles.startButtonText}>Start Journey</Text>
            </TouchableOpacity>
          )}
        </>
      )}

      <CustomModal
        visible={isModalVisible}
        title={modalHeader}
        message={modalText}
        singleButton={true}
        buttonOneText="Close"
        onButtonOnePress={handleModalClose}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: width,
    height: height,
  },
  backButtonWrapper: {
    position: "absolute",
    top: 50,
    left: 10,
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 2,
  },
  instructionContainer: {
    position: "absolute",
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    padding: 15,
    borderRadius: 10,
  },
  instructionText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.SemiBold,
    textAlign: "center",
  },
  startButton: {
    position: "absolute",
    bottom: 20,
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    width: "90%",
    alignSelf: "center",
    alignItems: "center",
  },
  startButtonText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: fonts.SemiBold,
  },
  reminderContainer: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  reminderText: {
    fontSize: 24,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
    textAlign: "center",
  },
});

export default MapScreen;
