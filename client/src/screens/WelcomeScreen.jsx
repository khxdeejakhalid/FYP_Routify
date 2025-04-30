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

const WelcomeScreen = () => {
  const navigation = useNavigation();

  const handleLogin = () => {
    navigation.navigate("Login");
  };

  const handleSignup = () => {
    navigation.navigate("Signup");
  };

  return (
    <View style={styles.container}>
      <Image
        alt="Logo"
        source={require("../assets/logo.png")}
        style={styles.logo}
      />
      <Text style={styles.title}>Your Route To Success</Text>
      <Image
        alt="banner"
        source={require("../assets/banner.png")}
        style={styles.banner}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[
            styles.loginButtonWrapper,
            { backgroundColor: colors.primary },
          ]}
          onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.loginButtonWrapper]}
          onPress={handleSignup}>
          <Text style={styles.signupButtonText}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    height: height * 0.13,
    width: width * 0.9,
    marginTop: "40%",
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-evenly",
    paddingBottom: "15%",
  },
  loginButtonWrapper: {
    justifyContent: "center",
    alignItems: "center",
    width: "40%",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.lightgrey,
  },
  loginButtonText: {
    color: colors.white,
    fontSize: 14,
    fontFamily: fonts.SemiBold,
  },
  signupButtonText: {
    fontSize: 14,
    color: colors.primary,
    fontFamily: fonts.SemiBold,
  },
});
