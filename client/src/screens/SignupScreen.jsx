import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Dimensions,
  Platform,
} from "react-native";
import axios from "axios";
import React, { useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import CustomModal from "../components/CustomModal";
import Button from "../components/Button";
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";
import { useNavigation } from "@react-navigation/native";
import { firebaseUtilService } from "../services/firebase/firebaseUtilService";

const { height } = Dimensions.get("window");

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

  const googleSignupHandler = () => {
    // if (email && password) {
    //   firebaseUtilService
    //     .signupUser({ email, password })
    //     .then((response) => {
    //       navigation.navigate("UserInformation", {
    //         email,
    //         password,
    //         username,
    //       });
    //     })
    //     .catch((error) => {
    //       setModalHeader("Sign Up Error");
    //       setModalText("Invalid information provided. Please try again.");
    //       setModalVisible(true);
    //     });
    // } else {
    //   setModalHeader("Missing Fields");
    //   setModalText("Please enter both email and password.");
    //   setModalVisible(true);
    // }
  };

  const signupHandler = async () => {
    if (email) {
      try {
        // TODO: Fetch backend url from environment variables
        const response = await axios.get(
          `http://192.168.0.94:8080/api/users/exists?email=${email}`,
        );

        if (response.data.status === "success") {
          if (response.data.exists) {
            setModalHeader(`Email Already Exists`);
            setModalText(
              `Please try a different email. This email already exists.`,
            );
            setModalVisible(true);
          } else {
            if (email && password && username) {
              navigation.navigate("UserInformation", {
                email,
                password,
                username,
              });
            }
          }
        }
      } catch (error) {
        setModalHeader("Failure");
        setModalText("System Cannot Process. Please try again.");
        setModalVisible(true);
      }
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

        {/* Form  */}
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

          <View style={styles.authenticationButtonContainer}>
            <Button
              clickHandler={signupHandler}
              disabled={false}
              buttonType="AuthButton">
              Sign Up
            </Button>

            <Text style={styles.continueText}>or continue with</Text>

            <Button
              clickHandler={googleSignupHandler}
              disabled={false}
              buttonType="AuthButton"
              imageSource={require("../assets/icons/social/google.png")}>
              Sign Up With Google
            </Button>
          </View>

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
    justifyContent: "space-between",
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
  textContainer: {
    marginTop: height * 0.12,
  },
  headingText: {
    fontSize: 24,
    color: colors.primary,
    fontFamily: fonts.SemiBold,
  },
  formContainer: {
    flex: 1,
    marginTop: 20,
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
    padding: Platform.OS === "android" ? "2%" : "3%",
    marginBottom: 15,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 10,
    fontFamily: fonts.Light,
  },
  continueText: {
    textAlign: "center",
    marginVertical: Platform.OS === "android" ? "3%" : "4%",
    fontSize: 14,
    fontFamily: fonts.Regular,
    color: colors.primary,
  },
  authenticationButtonContainer: {
    marginTop: "7%",
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
