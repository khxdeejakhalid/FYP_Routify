import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import React, { useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import CustomModal from "../components/CustomModal";
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";
import { useNavigation } from "@react-navigation/native";
import { firebaseUtilService } from "../services/firebase/firebaseUtilService";

const SignupScreen = () => {
  const navigation = useNavigation();
  const [secureEntry, setSecureEntry] = useState(true);
  const [username, setUsername] = useState(true);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const [modalText, setModalText] = useState("");
  const [modalHeader, setModalHeader] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);

  const handleGoBack = () => {
    navigation.goBack();
  };
  const redirectToLoginScreen = () => {
    navigation.navigate("Login");
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const signupHandler = () => {
    if (email && password) {
      firebaseUtilService
        .signupUser({ email, password })
        .then((response) => {
          // Firebase Success Response
        })

        .catch((error) => {
          console.log(error)
          setModalHeader("Sign Up Error");
          setModalText("Invalid information provided. Please try again.");
          setModalVisible(true);
        });
    } else {
      setModalHeader("Missing Fields");
      setModalText("Please enter both email and password.");
      setModalVisible(true);
    }
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
          <Text style={styles.headingText}>Let's get</Text>
          <Text style={styles.headingText}>started</Text>
        </View>
        {/* form  */}
        <View style={styles.formContainer}>
          <Text style={styles.label}>Username</Text>
          <View style={styles.inputContainer}>
            <SimpleLineIcons
              name={"screen-smartphone"}
              size={20}
              color={colors.secondary}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Enter username"
              placeholderTextColor={colors.secondary}
              secureTextEntry={secureEntry}
              keyboardType="default"
              onChangeText={(username) => setUsername(username)}
              value={username}
            />
          </View>
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
                setSecureEntry((prev) => !prev);
              }}>
              {secureEntry ? (
                <Ionicons name={"eye-off"} size={20} color={colors.secondary} />
              ) : (
                <Ionicons name={"eye"} size={20} color={colors.secondary} />
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginButtonWrapper} onPress={signupHandler}> 
            <Text style={styles.loginText}>
              Sign up
            </Text>
          </TouchableOpacity>
          <Text style={styles.continueText}>or continue with</Text>
          <TouchableOpacity style={styles.googleButtonContainer}>
            <Image
              source={require("../assets/google.png")}
              style={styles.googleImage}
            />
            <Text style={styles.googleText}>Sign Up With Google</Text>
          </TouchableOpacity>
          <View style={styles.footerContainer}>
            <Text style={styles.accountText}>Already have an account?</Text>
            <TouchableOpacity onPress={redirectToLoginScreen}>
              <Text style={styles.signupText}>Login</Text>
            </TouchableOpacity>
          </View>
        </View>

        <CustomModal
          visible={isModalVisible}
          title={modalHeader}
          message={modalText}
          singleButton={true}
          buttonOneText="Close"
          onButtonOnePress={handleModalClose}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SignupScreen;

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
