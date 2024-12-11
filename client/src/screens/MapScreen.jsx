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

import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";
import { getSnappedRoutes } from "../utils/api";
import route1 from "../assets/json/Route1Accurate.json";
import { routifyConstantsService } from "../services/routifyConstantsService";

const { width, height } = Dimensions.get("window");

const MapScreen = () => {
  const [route, setRoute] = useState([]);

  const [currentInstruction, setCurrentInstruction] = useState(null);

  const [userLocation, setUserLocation] = useState(
    new AnimatedRegion({
      latitude: 53.296626,
      longitude: -6.361573,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    }),
  );
  const mapRef = useRef(null);
  const markerRef = useRef(null);

  // ? This will be uncommented if mapping route lat long to roads api and fetching accurate route
  // const [snappedRoute, setSnappedRoute] = useState([]);

  useEffect(() => {
    setRoute(route1);
  }, []);

  const playRemindersWithDelay = async (reminders, delay = 2000) => {
    for (const reminder of reminders) {
      Speech.speak(reminder);
      setCurrentInstruction(reminder);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    setCurrentInstruction(null);
  };

  // ? This will be uncommented if mapping route lat long to roads api and fetching accurate route
  // useEffect(() => {
  //   async function fetchRoute() {
  //     const route = await getSnappedRoutes(route1);
  //     console.log(route);
  //     setSnappedRoute(route);
  //   }
  //   fetchRoute();
  // }, []);

  const startJourney = () => {
    const goshoReminders = routifyConstantsService.goshoReminders;
    playRemindersWithDelay(goshoReminders, 2000);
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: 53.2904,
          longitude: -6.3646,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
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
      </MapView>

      {currentInstruction && (
        <View style={styles.instructionContainer}>
          <Text style={styles.instructionText}>{currentInstruction}</Text>
        </View>
      )}

      <TouchableOpacity style={styles.startButton} onPress={startJourney}>
        <Text style={styles.startButtonText}>Start Journey</Text>
      </TouchableOpacity>
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
