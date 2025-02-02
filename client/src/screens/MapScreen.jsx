import React, { useEffect, useRef, useState } from "react";
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

import CustomModal from "../components/CustomModal";
import { fonts } from "../utils/fonts";
import { colors } from "../utils/colors";
import { getWaypoints, getTurnsByRoute } from "../utils/api";
import { routifyConstantsService } from "../services/routifyConstantsService";
import {
  getDistance,
  animateToRegion,
  getCurrentLocation,
  transformRoute,
  transformTurns,
} from "../utils/mapUtils";

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

  const [modalText, setModalText] = useState("");
  const [modalHeader, setModalHeader] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);

  // * Constants
  const msmReminders = routifyConstantsService.MSM_REMINDERS;
  const maneuvers = routifyConstantsService.MANEUVERS;
  const maneuversMap = routifyConstantsService.MANEUVERS_MAP;
  const triggeredTurns = new Set();
  const MSMDistanceThreshold = 30;

  // * Hooks
  useEffect(() => {
    async function fetchRoute() {
      const response = await getWaypoints(routeId);
      if (response.success) {
        const transformedRoute = transformRoute(response.waypoints);
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
        const transformedTurns = transformTurns(response.turns);
        setTurns(transformedTurns);
      } else {
        setModalHeader("Failure");
        setModalText(response.description);
        setModalVisible(true);
      }
    }

    fetchRoute();
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

  const playRemindersWithDelay = async (reminders, delay = 2000) => {
    for (const reminder of reminders) {
      Speech.speak(reminder);
      setCurrentInstruction(reminder);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    setCurrentInstruction(null);
  };

  const detectUpcomingTurn = (currentLat, currentLng) => {
    turns.forEach((turn) => {
      const distanceToTurn = getDistance(
        currentLat,
        currentLng,
        turn.latitude,
        turn.longitude,
      );

      if (distanceToTurn <= MSMDistanceThreshold && !triggeredTurns.has(turn)) {
        triggeredTurns.add(turn);
        playRemindersWithDelay(msmReminders, 2000);

        setTimeout(() => triggeredTurns.delete(turn), 60000);
      }
    });
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
    userLocation.timing(initialPosition).start();
    setCurrentLocation(initialPosition);
    animateToRegion(mapRef, userLocation, initialPosition);
    Speech.stop();
  };

  const simulateJourney = async () => {
    JourneyIntervalRef.current = setInterval(async () => {
      const { latitude, longitude, heading } = await getCurrentLocation();
      setCurrentLocation({ latitude, longitude, heading });
      detectUpcomingTurn(latitude, longitude);
      animateToRegion(mapRef, userLocation, { latitude, longitude });
    }, 3000);
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
