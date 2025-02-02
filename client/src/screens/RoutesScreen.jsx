import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  FlatList,
  View,
} from "react-native";
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import RouteCard from "../components/RouteCard";
import Button from "../components/Button";

const { width, height } = Dimensions.get("window");

const RoutesScreen = () => {
  const navigation = useNavigation();
  const [selectedRoute, setSelectedRoute] = useState("route1");

  const routes = [
    { label: "Route 1", value: "route1" },
    { label: "Route 2", value: "route2" },
    { label: "Route 3", value: "route3" },
    { label: "Route 4", value: "route4" },
  ];

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleNext = () => {
    if (selectedRoute) {
      navigation.navigate("Map", { selectedRoute });
    }
  };

  const renderItem = ({ item }) => {
    const backgroundColor =
      item.value === selectedRoute ? colors.secondary : colors.primary;

    return (
      <RouteCard
        label={item.label}
        clickHandler={() => {
          setSelectedRoute(item.value);
        }}
        bgColor={backgroundColor}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButtonWrapper} onPress={handleGoBack}>
        <Ionicons
          name={"arrow-back-outline"}
          color={colors.primary}
          size={25}
        />
      </TouchableOpacity>

      <Image
        source={require("../assets/logo.png")}
        style={styles.logo}
        alt="Logo"
      />

      <View style={styles.contentWrapper}>
        <Text style={styles.title}>Select a Route</Text>
        <FlatList
          style={styles.list}
          data={routes}
          renderItem={renderItem}
          keyExtractor={(item) => item.value}
          extraData={selectedRoute}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <Button
        clickHandler={handleNext}
        disabled={false}
        buttonType="BottomButton">
        Next
      </Button>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
    justifyContent: "space-between",
  },
  backButtonWrapper: {
    position: "absolute",
    top: 50,
    left: 20,
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: width * 0.8,
    height: height * 0.1,
    marginTop: height * 0.15,
    alignSelf: "center",
  },
  contentWrapper: {
    flex: 1,
    alignItems: "center",
    marginTop: "10%",
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
    marginBottom: 20,
  },
  list: {
    height: 50,
    width: "70%",
    color: colors.primary,
    marginBottom: 20,
  },
});

export default RoutesScreen;
