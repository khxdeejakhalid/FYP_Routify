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
import { useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import CustomModal from "../components/CustomModal";
import Button from "../components/Button";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";
import { resetPassword } from "../utils/api";

const { height } = Dimensions.get("window");

const ResetPassword = () => {
  const navigation = useNavigation();
  const [passwordSecureEntry, setPasswordSecureEntry] = useState(true);
  const [newPasswordSecureEntry, setNewPasswordSecureEntry] = useState(true);

  const [newPassword, setNewPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [email, setEmail] = useState();
  const [modalText, setModalText] = useState("");
  const [modalHeader, setModalHeader] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const onResetPassword = async () => {
    if (!email) {
      setModalHeader("Failure");
      setModalText("Email is required");
      setModalVisible(true);
      return;
    }
    if (newPassword !== confirmPassword) {
      setModalHeader("Failure");
      setModalText("Passwords do not match");
      setModalVisible(true);
      return;
    } else {
      const response = await resetPassword(newPassword, email);
      if (!response.success) {
        setModalHeader("Failure");
        setModalText(response.description);
        setModalVisible(true);
      } else {
        navigation.navigate("Login");
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
          <Text style={styles.headingText}>Reset</Text>
          <Text style={styles.headingText}>Password</Text>
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
              value={email}
              style={styles.textInput}
              keyboardType="email-address"
              placeholder="Enter your email"
              placeholderTextColor={colors.gray}
              onChangeText={(email) => setEmail(email)}
            />
          </View>
          <Text style={styles.label}>New Password</Text>
          <View style={styles.inputContainer}>
            <SimpleLineIcons
              name={"lock"}
              size={Platform.OS === "android" ? 18 : 20}
              color={colors.gray}
            />
            <TextInput
              value={newPassword}
              style={styles.textInput}
              secureTextEntry={passwordSecureEntry}
              placeholderTextColor={colors.gray}
              placeholder="Enter your new password"
              onChangeText={(newPass) => setNewPassword(newPass)}
            />
            <TouchableOpacity
              onPress={() => {
                setPasswordSecureEntry((toggle) => !toggle);
              }}>
              {passwordSecureEntry ? (
                <Ionicons
                  name={"eye-off"}
                  size={Platform.OS === "android" ? 18 : 20}
                  color={colors.gray}
                />
              ) : (
                <Ionicons
                  name={"eye"}
                  size={Platform.OS === "android" ? 18 : 20}
                  color={colors.gray}
                />
              )}
            </TouchableOpacity>
          </View>
          <Text style={styles.label}>Confirm Password</Text>
          <View style={styles.inputContainer}>
            <SimpleLineIcons
              name={"lock"}
              size={Platform.OS === "android" ? 18 : 20}
              color={colors.gray}
            />
            <TextInput
              value={confirmPassword}
              style={styles.textInput}
              placeholder="Confirm your password"
              placeholderTextColor={colors.gray}
              secureTextEntry={newPasswordSecureEntry}
              onChangeText={(pass) => setConfirmPassword(pass)}
            />

            <TouchableOpacity
              onPress={() => {
                setNewPasswordSecureEntry((toggle) => !toggle);
              }}>
              {newPasswordSecureEntry ? (
                <Ionicons
                  name={"eye-off"}
                  size={Platform.OS === "android" ? 18 : 20}
                  color={colors.gray}
                />
              ) : (
                <Ionicons
                  name={"eye"}
                  size={Platform.OS === "android" ? 18 : 20}
                  color={colors.gray}
                />
              )}
            </TouchableOpacity>
          </View>

          <View style={styles.authenticationButtonContainer}>
            <Button
              disabled={false}
              buttonType="AuthButton"
              clickHandler={onResetPassword}>
              Reset Password
            </Button>
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
export default ResetPassword;

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
