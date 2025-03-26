import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";

import List from "./List"; // Import your List component
const { width, height } = Dimensions.get("window");

const ScreenWithList = ({ title, navItems, onGoBack }) => {
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButtonWrapper} onPress={onGoBack}>
          <Ionicons
            size={25}
            color={colors.primary}
            name={"arrow-back-outline"}
          />
        </TouchableOpacity>

        {/* Logo */}
        <Image
          alt="Logo"
          style={styles.logo}
          source={require("../assets/logo.png")}
        />
        <View style={styles.contentWrapper}>
          <Text style={styles.title}>{title}</Text>
          <List navItems={navItems} />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
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
  },
  logo: {
    width: width * 0.8,
    height: height * 0.1,
    marginTop: height * 0.1,
    alignSelf: "center",
  },
  contentWrapper: {
    flex: 1,
    marginTop: "10%",
  },
  title: {
    fontSize: 32,
    textTransform: "uppercase",
    fontFamily: fonts.SemiBold,
    color: colors.primary,
    marginBottom: 20,
    textAlign: "center",
  },
});

export default ScreenWithList;
