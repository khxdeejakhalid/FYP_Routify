import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import React from "react";
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");
const HomeScreen = () => {
  const navigation = useNavigation();

  const homeNavItems = [
    {
      id: 1,
      title: "Routes",
      route: "TestCenteres",
      iconSrc: require("../assets/icons/dashboard/routes-home-icon.png"),
    },
    {
      id: 2,
      title: "Progress",
      route: "Progress",
      iconSrc: require("../assets/icons/dashboard/progress-home-icon.png"),
    },
    {
      id: 3,
      title: "Help",
      route: "Help",
      iconSrc: require("../assets/icons/dashboard/help-home-icon.png"),
    },
    {
      id: 4,
      title: "Profile",
      route: "UserProfile",
      iconSrc: require("../assets/icons/dashboard/profile-home-icon.png"),
    },
  ];

  return (
    <View style={styles.container}>
      {/* @TODO: Lets turn this into a header component  */}
      <Image
        alt="Logo"
        source={require("../assets/logo.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Your Route To Success</Text>

      <View style={styles.gridContainer}>
        {homeNavItems.map((navItem) => (
          <TouchableOpacity
            key={navItem.id}
            style={styles.box}
            onPress={() => navigation.navigate(navItem.route)}>
            <Image
              alt={navItem.title}
              source={navItem.iconSrc}
              style={styles.boxIcon}
            />
            <Text style={styles.boxText}>{navItem.title.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
  },
  logo: {
    height: height * 0.1,
    width: width * 0.8,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
    marginBottom: '20%'
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "80%",
  },
  box: {
    width: "45%",
    height: height * 0.15,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: height * 0.02,
    borderRadius: 10,
    padding: 15,
  },
  boxText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.SemiBold,
  },
  boxIcon: {
    width: width * 0.15,
    height: width * 0.15,
    marginBottom: height * 0.01,
  },
});
export default HomeScreen;
