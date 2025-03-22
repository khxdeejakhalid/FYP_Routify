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
  Platform,
} from "react-native";
import { useState, useContext } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import CustomModal from "../components/CustomModal";
import Button from "../components/Button";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";
import { firebaseUtilService } from "../services/firebase/firebaseUtilService";
import { AuthContext } from "../context/AuthContext";

const { height } = Dimensions.get("window");

const LoginScreen = () => {
  const navigation = useNavigation();
  const { handleSignIn } = useContext(AuthContext);
  const [secureEntry, setSecureEntry] = useState(true);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const [modalText, setModalText] = useState("");
  const [modalHeader, setModalHeader] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);

  const handleGoBack = () => {
    navigation.goBack();
  };
  const redirectToSignupPage = () => {
    navigation.navigate("Signup");
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const loginHandler = async () => {
    if (email && password) {
      const response = await handleSignIn(email, password);
      if (!response.success) {
        setModalHeader("Failure");
        setModalText(response.description);
        setModalVisible(true);
      }
    }
  };

  const googleSigninHandler = () => {
    if (email && password) {
      firebaseUtilService
        .signInUser({ email, password })
        .then((response) => {
          // Firebase Success Response
        })
        .catch((error) => {
          setModalHeader("Login Error");
          setModalText("Invalid credentials. Please try again.");
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
          <Text style={styles.headingText}>Welcome</Text>
          <Text style={styles.headingText}>Back</Text>
        </View>

        {/* form  */}
        <View style={styles.formContainer}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputContainer}>
            <Ionicons
              name={"mail-outline"}
              size={Platform.OS === "android" ? 18 : 20}
              color={colors.gray}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Enter your email"
              placeholderTextColor={colors.gray}
              keyboardType="email-address"
              onChangeText={(email) => setEmail(email)}
              value={email}
            />
          </View>
          <Text style={styles.label}>Password</Text>
          <View style={styles.inputContainer}>
            <SimpleLineIcons name={"lock"} size={Platform.OS === "android" ? 18 : 20} color={colors.gray} />
            <TextInput
              style={styles.textInput}
              placeholder="Enter your password"
              placeholderTextColor={colors.gray}
              secureTextEntry={secureEntry}
              onChangeText={(pass) => setPassword(pass)}
              value={password}
            />

            <TouchableOpacity
              onPress={() => {
                setSecureEntry((toggle) => !toggle);
              }}>
              {secureEntry ? (
                <Ionicons name={"eye-off"} size={Platform.OS === "android" ? 18 : 20} color={colors.gray} />
              ) : (
                <Ionicons name={"eye"} size={Platform.OS === "android" ? 18 : 20} color={colors.gray} />
              )}
            </TouchableOpacity>
          </View>
          <TouchableOpacity>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <View style={styles.authenticationButtonContainer}>
            <Button
              clickHandler={loginHandler}
              disabled={false}
              buttonType="AuthButton">
              Login
            </Button>

            <Text style={styles.continueText}>or continue with</Text>

            <Button
              clickHandler={googleSigninHandler}
              disabled={false}
              buttonType="AuthButton"
              imageSource={require("../assets/icons/social/google.png")}>
              Sign In With Google
            </Button>
          </View>

          <View style={styles.footerContainer}>
            <Text style={styles.accountText}>Don’t have an account?</Text>
            <TouchableOpacity onPress={redirectToSignupPage}>
              <Text style={styles.signupText}>Sign up</Text>
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
export default LoginScreen;

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
    marginTop: Platform.OS === "android" ? "10" : "20",
  },
  label: {
    fontSize: 14,
    marginBottom: "3%",
    paddingLeft: "1%",
  },
  inputContainer: {
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    padding: Platform.OS === "android" ? "0%" : "3%",
    paddingHorizontal: "3%",
    marginBottom: 15,
  },
  textInput: {
    flex: 1,
    paddingHorizontal: Platform.OS === "android" ? 10 : 10,
    fontFamily: fonts.Light,
  },
  forgotPasswordText: {
    fontSize: 14,
    textAlign: "right",
    color: colors.primary,
    fontFamily: fonts.Regular,
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
