import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, Dimensions } from "react-native";
import MapView, { Marker, Polyline, AnimatedRegion } from "react-native-maps";
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";
import dummyRoute from "../assets/json/Route1.json";

const { width, height } = Dimensions.get("window");

const MapScreen = () => {
  const [route, setRoute] = useState([]);

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

  useEffect(() => {
    setRoute(dummyRoute);
  }, []);

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
  startButton: {
    position: "absolute",
    bottom: 20,
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    width: "90%",
    alignSelf: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  startButtonText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: fonts.SemiBold,
  },
});

export default MapScreen;
