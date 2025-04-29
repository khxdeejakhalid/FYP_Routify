import { useEffect, useRef, useState, useCallback, useContext } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Text,
} from "react-native";
import MapView, { Marker, Polyline, AnimatedRegion } from "react-native-maps";
import { useNavigation, useRoute } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import * as Location from "expo-location";
import * as Speech from "expo-speech";

import { fonts } from "../../utils/fonts";
import { colors } from "../../utils/colors";
import {
  getWaypoints,
  getTurnsByRoute,
  getManeuversByRoute,
  saveManueverFeedbackScore,
} from "../../utils/api";
import { routifyConstantsService } from "../../services/routifyConstantsService";
import { processRoute } from "../../utils/routesProcessing.js";
import { mapUtils } from "../../utils/mapUtils";
import { maneuverUtils } from "../../utils/maneueverUtilityService";

import routeData from "../../assets/json/Route1.json";
import CustomModal from "../../components/CustomModal";
import FeedbackModal from "../../components/FeedbackModal";
import { AuthContext } from "../../context/AuthContext.jsx";

const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const MapScreen = () => {
  const routeParams = useRoute();
  const navigation = useNavigation();

  const { selectedRoute } = routeParams.params;
  const { user } = useContext(AuthContext);

  // * Refs
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const journeyIntervalRef = useRef(null);
  const isReverseAroundCornerManeuverActiveRef = useRef(false);
  const isManeuverActiveRef = useRef(false);
  const userLocation = useRef(
    new AnimatedRegion({
      latitude: 0,
      longitude: 0,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    }),
  ).current;

  // * State variables
  const [route, setRoute] = useState([]);
  const [turns, setTurns] = useState([]);
  const [maneuvers, setManeuvers] = useState([]);
  const [isRouteLoaded, setIsRouteLoaded] = useState(false);
  const [currentInstruction, setCurrentInstruction] = useState(null);
  const [isJourneyStarted, setIsJourneyStarted] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 0,
    longitude: 0,
    heading: 90,
  });
  const [maneuverFeedback, setManeuverFeedback] = useState(4);

  // * Maneuver State Variables
  const [turnAboutTouchedKerb, setTurnAboutTouchedKerb] = useState(false);
  const [reverseAroundCornerTouchedKerb, setReverseAroundCornerTouchedKerb] =
    useState(false);

  const [modalText, setModalText] = useState("");
  const [modalHeader, setModalHeader] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [feedbackManeuverType, setFeedbackManeuverType] = useState(null);
  const [isFeedbackModalVisible, setFeedbackModalVisible] = useState(false);

  // * Constants & Variables
  let totalDeviations = [];
  let totalSpeed = [];
  let manueverStartTime = null;
  let manueverEndTime = null;
  let isManeueverActive = false;
  let speedHistory = [];
  let carIdleStateCount = 0;
  let startTime = 0;

  const MSM_PROXIMITY_THRESHOLD =
    routifyConstantsService.MSM_PROXIMITY_THRESHOLD;
  const MSM_REMINDERS = routifyConstantsService.MSM_REMINDERS;
  const MANEUVERS_TYPE = routifyConstantsService.MANEUVERS_TYPE;
  const triggeredTurns = new Set();

  // * Hooks
  const fetchRouteData = useCallback(async () => {
    const [waypointsResponse, turnsResponse, maneuversResponse] =
      await Promise.all([
        getWaypoints(selectedRoute),
        getTurnsByRoute(selectedRoute),
        getManeuversByRoute(selectedRoute),
      ]);

    if (waypointsResponse.success) {
      const transformedRoute = mapUtils.transformRoute(
        waypointsResponse.waypoints,
      );
      setRoute(transformedRoute);
      setIsRouteLoaded(true);
    }

    if (turnsResponse.success) {
      const transformedTurns = mapUtils.transformTurns(turnsResponse.turns);
      setTurns(transformedTurns);
    }

    if (maneuversResponse.success) {
      const transformedManeuvers = mapUtils.transformManeuvers(
        maneuversResponse.maneuvers,
      );
      setManeuvers(transformedManeuvers);
    }

    if (
      !waypointsResponse.success ||
      !turnsResponse.success ||
      !maneuversResponse.success
    ) {
      setModalHeader("Failure");
      setModalText(response.description);
      setModalVisible(true);
    }
  }, [selectedRoute]);

  async function fetchRouteFromJSON() {
    const response = await processRoute(routeData);
    setRoute(response);
    setIsRouteLoaded(true);
  }

  useEffect(() => {
    const getInitialLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setModalHeader("Permission Denied");
        setModalText("Location permission is required for this app.");
        setModalVisible(true);
        return;
      }

      try {
        const currentPosition = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.BestForNavigation,
        });

        const { latitude, longitude, heading } = currentPosition.coords;

        setCurrentLocation({ latitude, longitude, heading: heading || 90 });

        userLocation.setValue({
          latitude,
          longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        });

        if (mapRef.current) {
          mapUtils.animateToRegion(mapRef, userLocation, {
            latitude,
            longitude,
          });
        }
      } catch (error) {
        console.error("Error getting current location:", error);
      }
    };

    getInitialLocation();
    fetchRouteData();
    // fetchRouteFromJSON();
  }, [fetchRouteData]);

  // * Functions / Handlers
  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setFeedbackModalVisible(false);
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

      if (
        distanceToTurn <= MSM_PROXIMITY_THRESHOLD &&
        !triggeredTurns.has(turn.id || turn)
      ) {
        triggeredTurns.add(turn.id || turn);
        playRemindersWithDelay(MSM_REMINDERS, 1000);

        setTimeout(() => triggeredTurns.delete(turn), 60000);
      }
    });
  };

  const isReverseAroundCornerManeuver = (currLocation) => {
    const distanceToManouvere = mapUtils.getDistance(
      maneuvers[MANEUVERS_TYPE.REVERSE_PARKING.ID].start.latitude,
      maneuvers[MANEUVERS_TYPE.REVERSE_PARKING.ID].start.longitude,
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

  const isManeuver = (manueverLoc, currLocation) => {
    const distanceToManouvere = mapUtils.getDistance(
      manueverLoc.start.latitude,
      manueverLoc.start.longitude,
      currLocation.latitude,
      currLocation.longitude,
    );

    if (distanceToManouvere < 5 && !isManeuverActiveRef.current) {
      manueverStartTime = new Date();
      isManeuverActiveRef.current = true;
      playRemindersWithDelay(
        [routifyConstantsService.TURN_ABOUT_REMINDERS.STARTING_POINT],
        1000,
        false,
      );
      return true;
    }
    // ? Reverse Around Corner Maneuver Is In Progress
    else if (isManeuverActiveRef.current) {
      return true;
    }

    return false;
  };

  const hasManeueverEnded = (manueverLoc, currLocation) => {
    if (isManeuverActiveRef.current) {
      const distanceToEnd = mapUtils.getDistance(
        currLocation.latitude,
        currLocation.longitude,
        manueverLoc.end.latitude,
        manueverLoc.end.longitude,
      );

      if (distanceToEnd < 5) {
        playRemindersWithDelay(
          [routifyConstantsService.TURN_ABOUT_REMINDERS.ENDING_POINT],
          1000,
          false,
        );
        isManeuverActiveRef.current = false;
        manueverEndTime = new Date();
        return true;
      }

      return false;
    }
  };

  const hasReverseAroundCornerManeueverEnded = (currLocation) => {
    if (isReverseAroundCornerManeuverActiveRef.current) {
      const distanceToEnd = mapUtils.getDistance(
        currLocation.latitude,
        currLocation.longitude,
        maneuvers[MANEUVERS_TYPE.REVERSE_PARKING.ID].end.latitude,
        maneuvers[MANEUVERS_TYPE.REVERSE_PARKING.ID].end.longitude,
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

  const testHilltopManuever = (
    currentLat,
    currentLng,
    direction,
    speed,
    timestamp,
  ) => {
    if (
      !isManeueverActive &&
      maneuverUtils.isManueverInProgress(
        currentLat,
        currentLng,
        maneuvers[MANEUVERS_TYPE.HILLTOP.ID].start.latitude,
        maneuvers[MANEUVERS_TYPE.HILLTOP.ID].start.longitude,
      )
    ) {
      isManeueverActive = true;
      startTime = Date.now();
      speedHistory.push({ speed, timestamp });
      playRemindersWithDelay(
        [routifyConstantsService.HILL_TOP_REMINDERS.STARTING_POINT],
        1000,
        false,
      );
    }

    if (isManeueverActive) {
      // Once the user is out of the range of hilltop, Calculate parameters to judge how well he has performed
      if (
        maneuverUtils.isManueverInProgress(
          currentLat,
          currentLng,
          maneuvers[MANEUVERS_TYPE.HILLTOP.ID].end.latitude,
          maneuvers[MANEUVERS_TYPE.HILLTOP.ID].end.longitude,
        )
      ) {
        playRemindersWithDelay(
          [routifyConstantsService.HILL_TOP_REMINDERS.ENDING_POINT],
          1000,
          false,
        );
        isManeueverActive = false;
        const manueverEvaluationCriteria = [
          {
            evaluate: maneuverUtils.trackStationaryTime(carIdleStateCount),
            weight: 1,
          },
          {
            evaluate: maneuverUtils.trackTimeTakenToCompleteManuever(
              startTime,
              {
                startLat: maneuvers[MANEUVERS_TYPE.HILLTOP.ID].start.latitude,
                startLng: maneuvers[MANEUVERS_TYPE.HILLTOP.ID].start.longitude,
                endLat: maneuvers[MANEUVERS_TYPE.HILLTOP.ID].end.latitude,
                endLng: maneuvers[MANEUVERS_TYPE.HILLTOP.ID].end.longitude,
              },
            ),
            weight: 2,
          },
          {
            evaluate: maneuverUtils.evaluateSmoothness(speedHistory),
            weight: 2,
          },
        ];

        const overallScore = maneuverUtils.scoreManuever(
          manueverEvaluationCriteria,
        );

        setManeuverFeedback(parseInt(overallScore));
        saveManueverFeedbackScore({
          selectedRoute,
          score: overallScore,
          manueverType: MANEUVERS_TYPE.HILLTOP.ID,
          userEmail: user.email,
        });
        setFeedbackManeuverType("HILL TOP");
        setFeedbackModalVisible(true);
      } else {
        if (speed === 0) {
          carIdleStateCount++;
        }
        speedHistory.push({ speed, timestamp });
      }
    }
  };

  const evaluateReverseAroundCornerManeuver = (
    currLocation,
    speed,
    timestamp,
    counter,
  ) => {
    const kerbCoordinates = maneuvers[MANEUVERS_TYPE.REVERSE_PARKING.ID].kerb;

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
        if (counter % 5 === 0) {
          playRemindersWithDelay(
            [
              routifyConstantsService.REVERSE_AROUND_CORNER_REMINDERS
                .KERB_TOO_CLOSE,
            ],
            1000,
            false,
          );
        }
      } else if (minDeviation > 3) {
        if (counter % 5 === 0) {
          playRemindersWithDelay(
            [
              routifyConstantsService.REVERSE_AROUND_CORNER_REMINDERS
                .KERB_TOO_FAR,
            ],
            1000,
            false,
          );
        }
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
      let overallScore = 0;

      if (reverseAroundCornerTouchedKerb) {
        setManeuverFeedback(0);
        console.log("REVERSE AROUND CORNER MANUEVER STATS: ");
        console.log(`Average deviation: ${averageDeviation}`);
        console.log(`Average speed: ${averageSpeed}`);
        console.log(`Touched Kerb: ${reverseAroundCornerTouchedKerb}`);
      } else {
        const timeTaken = maneuverUtils.getTimeDifferenceInMinutes(
          manueverStartTime,
          manueverEndTime,
        );

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
        overallScore = maneuverUtils.calculateOverallScore(
          distanceScore,
          speedScore,
          timeScore,
        );

        console.log(`Overall Score: ${overallScore}`);
        setManeuverFeedback(parseInt(overallScore));
      }

      setFeedbackManeuverType("REVERSE AROUND CORNER");
      saveManueverFeedbackScore({
        selectedRoute,
        score: overallScore,
        manueverType: MANEUVERS_TYPE.REVERSE_PARKING.ID,
        userEmail: user.email,
      });
      setFeedbackModalVisible(true);
    }
  };

  const evaluateTurnAboutManeuver = (currentLoc) => {
    const maneuverCoordinates = maneuvers[MANEUVERS_TYPE.TURN_ABOUT.ID];
    const kerbCoordinates = maneuverCoordinates.kerb;

    if (isManeuver(maneuverCoordinates, currentLoc)) {
      const { deviations, touchedKerb } =
        maneuverUtils.calculateDeviationsFromKerbs(kerbCoordinates, currentLoc);

      if (touchedKerb) {
        setTurnAboutTouchedKerb(touchedKerb);
      }

      totalSpeed.push(currentLoc.speed);
    }

    if (hasManeueverEnded(maneuverCoordinates, currentLoc)) {
      const averageSpeed = maneuverUtils.getAverage(totalSpeed);

      // Reset total deviations & total speed
      totalDeviations = [];
      totalSpeed = [];
      let overallScore = 0;

      if (turnAboutTouchedKerb) {
        setManeuverFeedback(0);
        console.log("TURN ABOUT MANUEVER STATS: ");
        console.log(`Average speed: ${averageSpeed}`);
        console.log(`Touched Kerb: ${turnAboutTouchedKerb}`);
      } else {
        const timeTaken = maneuverUtils.getTimeDifferenceInMinutes(
          manueverStartTime,
          manueverEndTime,
        );

        // Calculate scores for each criterion
        const speedScore = maneuverUtils.calculateReverseAroundCornerScore(
          averageSpeed,
          1,
          1.5,
        );

        const timeScore = maneuverUtils.calculateReverseAroundCornerScore(
          timeTaken,
          0.5,
          1.5,
        );

        console.log("TURN ABOUT MANUEVER STATS: ");
        console.log(`Average speed: ${averageSpeed}`);
        console.log(`Touched Kerb: ${turnAboutTouchedKerb}`);
        console.log(`Time Taken: ${timeTaken} minutes`);
        console.log(`Speed Score: ${speedScore}`);
        console.log(`Time Score: ${timeScore}`);

        // Calculate overall score
        overallScore = maneuverUtils.calculateReverseAroundCornerScore(
          speedScore,
          timeScore,
          turnAboutTouchedKerb
            ? 0
            : maneuverUtils.normalizeScoreOutOf5(2, 0, 2),
        );

        console.log(`Overall Score: ${overallScore}`);
        setManeuverFeedback(parseInt(overallScore));
      }

      setFeedbackManeuverType("TURN ABOUT");
      saveManueverFeedbackScore({
        selectedRoute,
        score: overallScore,
        manueverType: MANEUVERS_TYPE.TURN_ABOUT.ID,
        userEmail: user.email,
      });
      setFeedbackModalVisible(true);
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
    let counter = -1;
    const locationSubscription = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.BestForNavigation,
        timeInterval: 1000,
        distanceInterval: 1,
      },
      ({ coords: { latitude, longitude, heading, speed }, timestamp }) => {
        counter = counter + 1;
        setCurrentLocation({ latitude, longitude, heading });
        detectUpcomingTurn(latitude, longitude);
        testHilltopManuever(latitude, longitude, heading, speed, timestamp);
        evaluateReverseAroundCornerManeuver(
          { latitude, longitude, heading },
          speed,
          timestamp,
          counter,
        );
        evaluateTurnAboutManeuver({
          latitude,
          longitude,
          heading,
          speed,
          timestamp,
        });

        mapUtils.animateToRegion(mapRef, userLocation, { latitude, longitude });
      },
    );

    journeyIntervalRef.current = locationSubscription;
  };

  const clearJourneyInterval = () => {
    if (journeyIntervalRef.current) {
      clearInterval(journeyIntervalRef.current);
      journeyIntervalRef.current = null;
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
              image={require("../../assets/icons/navigator.png")}
              anchor={{ x: 0.5, y: 0.5 }}
              style={{
                transform: [{ rotate: `${currentLocation.heading}deg` }],
              }}
            />

            {/* Maneuvers Markers  */}
            {Object.values(MANEUVERS_TYPE).map((manuever, index) => {
              return (
                <Marker
                  key={index}
                  coordinate={{
                    latitude: maneuvers[manuever.ID].start.latitude,
                    longitude: maneuvers[manuever.ID].start.longitude,
                  }}
                  title={`${manuever.DISPLAY_NAME} Maneuver`}
                  description={manuever.DISPLAY_NAME}
                  pinColor={colors.primary}
                  icon={require("../../assets/icons/markers/manuever_marker.png")}
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

      <FeedbackModal
        visible={isFeedbackModalVisible}
        maneuverType={feedbackManeuverType}
        closeHandler={handleModalClose}
        rating={maneuverFeedback}
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
