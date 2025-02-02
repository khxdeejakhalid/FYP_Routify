import React, { useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity,
  Text,
} from "react-native";
import MapView, { Marker, Polyline, AnimatedRegion } from "react-native-maps";
import * as Speech from "expo-speech";

import { fonts } from "../utils/fonts";
import { colors } from "../utils/colors";
import routeData from "../assets/json/Route1DetailedDirections.json";
import { routifyConstantsService } from "../services/routifyConstantsService";
import {
  getDistance,
  animateToRegion,
  getCurrentLocation,
  findNearestPoint,
  calculateBearing,
} from "../utils/mapUtils";
import * as Location from "expo-location";

const { width, height } = Dimensions.get("window");

const ASPECT_RATIO = width / height;
const LATITUDE_DELTA = 0.04;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const MapScreen = () => {
  // * Refs
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const journeyIntervalRef = useRef(null);
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
  const [currentInstruction, setCurrentInstruction] = useState(null);
  const [isJourneyStarted, setIsJourneyStarted] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 53.296626143012745,
    longitude: -6.361571573136808,
  });

  // * Constants
  const maneuvers = routifyConstantsService.MANEUVERS;
  const maneuversMap = routifyConstantsService.MANEUVERS_MAP;

  // * Hooks
  useEffect(() => {
    function transformRoute() {
      return routeData.map((point) => ({
        latitude: point.currentLatitude,
        longitude: point.currentLongitude,
      }));
    }

    const transformedRoute = transformRoute();
    setRoute(transformedRoute);
    return () => clearJourneyInterval();
  }, []);

  // * Functions / Handlers
  const playRemindersWithDelay = async (reminders, delay = 2000) => {
    for (const reminder of reminders) {
      Speech.speak(reminder);
      setCurrentInstruction(reminder);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    setCurrentInstruction(null);
  };

  const detectUpcomingTurn = (currentLat, currentLng) => {
    const { nearestPoint, nearestIndex } = findNearestPoint(
      currentLat,
      currentLng,
      routeData,
    );
    const msmReminders = routifyConstantsService.MSM_REMINDERS;

    if (nearestPoint && nearestIndex < routeData.length - 1) {
      const nextPoint = routeData[nearestIndex + 1];
      const afterNextPoint = routeData[nearestIndex + 2];

      const distanceToNextPoint = getDistance(
        currentLat,
        currentLng,
        nextPoint.currentLatitude,
        nextPoint.currentLongitude,
      );

      const currentBearing = calculateBearing(
        nearestPoint.currentLatitude,
        nearestPoint.currentLongitude,
        nextPoint.currentLatitude,
        nextPoint.currentLongitude,
      );

      const nextBearing = calculateBearing(
        nextPoint.currentLatitude,
        nextPoint.currentLongitude,
        afterNextPoint?.currentLatitude ?? nextPoint.currentLatitude,
        afterNextPoint?.currentLongitude ?? nextPoint.currentLongitude,
      );

      const turnAngle = Math.abs(nextBearing - currentBearing);

      if (distanceToNextPoint < 50 && turnAngle > 30) {
        playRemindersWithDelay(msmReminders, 2000);
      }
    } else {
      setCurrentInstruction("Unable to find a valid route point.");
    }
  };

  const startJourney = () => {
    const goshoReminders = routifyConstantsService.GOSHO_REMINDERS;
    setIsJourneyStarted(true);
    playRemindersWithDelay(goshoReminders, 2000);
    simulateJourney();
  };

  const stopJourney = () => {
    clearJourneyInterval();
    setIsJourneyStarted(false);
    setCurrentInstruction(null);
    setCurrentLocation({
      latitude: 53.296626143012745,
      longitude: -6.361571573136808,
    });
    Speech.stop();
  };

  const simulateJourney = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      return;
    }

    journeyIntervalRef.current = setInterval(async () => {
      const { latitude, longitude, heading } = await getCurrentLocation();
      setCurrentLocation({ latitude, longitude });
      detectUpcomingTurn(latitude, longitude);
      animateToRegion(mapRef, userLocation, { latitude, longitude });
    }, 3000);
  };

  const clearJourneyInterval = () => {
    if (journeyIntervalRef.current) {
      clearInterval(journeyIntervalRef.current);
      journeyIntervalRef.current = null;
    }
  };

  return (
    <View style={styles.container}>
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
          title="You are here"
          pinColor={colors.primary}
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
          <Text style={styles.startButtonText}>Stop </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.startButton} onPress={startJourney}>
          <Text style={styles.startButtonText}>Start Journey</Text>
        </TouchableOpacity>
      )}
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
