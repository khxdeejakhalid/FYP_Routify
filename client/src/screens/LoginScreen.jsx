import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

import React, { useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import CustomModal from "../components/CustomModal";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";

const { width, height } = Dimensions.get("window");

const LoginScreen = () => {
  const navigation = useNavigation();
  const [secureEntry, setSecureEntry] = useState(true);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();


  const handleGoBack = () => {
    navigation.goBack();
  };
  const redirectToSignupPage = () => {
    navigation.navigate("Signup");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.backButtonWrapper}
          onPress={handleGoBack}>
          <Ionicons
            name={"arrow-back-outline"}
            color={colors.primary}
            size={25}
          />
        </TouchableOpacity>
        <View style={styles.textContainer}>
          <Text style={styles.headingText}>Hey,</Text>
          <Text style={styles.headingText}>Welcome</Text>
          <Text style={styles.headingText}>Back</Text>
        </View>

        {/* form  */}
        <View style={styles.formContainer}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputContainer}>
            <Ionicons
              name={"mail-outline"}
              size={20}
              color={colors.secondary}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Enter your email"
              placeholderTextColor={colors.secondary}
              keyboardType="email-address"
              onChangeText={(email) => setEmail(email)}
              value={email}
            />
          </View>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputContainer}>
            <SimpleLineIcons name={"lock"} size={20} color={colors.secondary} />
            <TextInput
              style={styles.textInput}
              placeholder="Enter your password"
              placeholderTextColor={colors.secondary}
              secureTextEntry={secureEntry}
              onChangeText={(pass) => setPassword(pass)}
              value={password}
            />

            <TouchableOpacity
              onPress={() => {
                setSecureEntry((toggle) => !toggle);
              }}>
              {secureEntry ? (
                <Ionicons name={"eye-off"} size={20} color={colors.secondary} />
              ) : (
                <Ionicons name={"eye"} size={20} color={colors.secondary} />
              )}
            </TouchableOpacity>
          </View>
          <TouchableOpacity>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.loginButtonWrapper}
            activeOpacity={0.7}>
            <Text style={styles.loginText} selectable={false}>
              Login
            </Text>
          </TouchableOpacity>
          <Text style={styles.continueText}>or continue with</Text>
          <TouchableOpacity style={styles.googleButtonContainer}>
            <Image
              source={require("../assets/google.png")}
              style={styles.googleImage}
            />
            <Text style={styles.googleText}>Sign In With Google</Text>
          </TouchableOpacity>
          <View style={styles.footerContainer}>
            <Text style={styles.accountText}>Don’t have an account?</Text>
            <TouchableOpacity onPress={redirectToSignupPage}>
              <Text style={styles.signupText}>Sign up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
  },
  backButtonWrapper: {
    height: "10%",
    width: "10%",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  textContainer: {
    marginVertical: "5%",
  },
  headingText: {
    fontSize: 24,
    color: colors.primary,
    fontFamily: fonts.SemiBold,
  },
  formContainer: {
    marginTop: "5%",
  },
  label: {
    fontSize: 14,
    marginBottom: "3%",
    paddingLeft: "1%",
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: "5%",
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 10,
    fontFamily: fonts.Light,
  },
  forgotPasswordText: {
    fontSize: 14,
    textAlign: "right",
    color: colors.primary,
    fontFamily: fonts.Regular,
  },
  loginButtonWrapper: {
    backgroundColor: colors.primary,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    marginTop: "7%",
    padding: "4%",
  },
  loginText: {
    color: colors.white,
    fontSize: 14,
    fontFamily: fonts.Regular,
    textAlign: "center",
  },
  continueText: {
    textAlign: "center",
    marginVertical: "5%",
    fontSize: 14,
    fontFamily: fonts.Regular,
    color: colors.primary,
  },
  googleButtonContainer: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    padding: "3%",
    gap: 10,
  },
  googleImage: {
    height: 25,
    width: 25,
  },
  googleText: {
    fontSize: 14,
    fontFamily: fonts.Regular,
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 20,
    gap: 5,
  },
  accountText: {
    color: colors.primary,
    fontFamily: fonts.Regular,
  },
  signupText: {
    color: colors.primary,
    fontFamily: fonts.Bold,
  },
});
