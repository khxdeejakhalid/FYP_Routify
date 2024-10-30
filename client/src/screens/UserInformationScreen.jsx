import { useState, useContext } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Dimensions,
} from "react-native";
import CustomModal from "../components/CustomModal";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import DateTimePicker from "@react-native-community/datetimepicker";
import Ionicons from "react-native-vector-icons/Ionicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import Button from "../components/Button";
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../context/AuthContext";

const { height } = Dimensions.get("window");

const UserInformationScreen = ({ route }) => {
  const navigation = useNavigation();
  const { handleSignUp } = useContext(AuthContext);
  const { email, username, password } = route.params;
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isDateConfirmed, setIsDateConfirmed] = useState(false);
  const [isInformationCorrect, setIsInformationCorrect] = useState(false);

  const [modalText, setModalText] = useState("");
  const [modalHeader, setModalHeader] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDateOfBirth(selectedDate);
      setIsDateConfirmed(true);
    }
  };

  const showDatePickerHandler = () => {
    setShowDatePicker(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const signupHandler = async () => {
    if (!isInformationCorrect) {
      return;
    }

    if (email && password && username && firstName && dateOfBirth) {
      const response = await handleSignUp(
        email,
        password,
        username,
        firstName,
        lastName,
        dateOfBirth,
      );
      if (!response.success) {
        setModalHeader("Failure");
        setModalText(response.description);
        setModalVisible(true);
      }
    }
  };

  // const googleSignupHandler = () => {
  //   if (email && password) {
  //     firebaseUtilService
  //       .signupUser({ email, password })
  //       .then((response) => {
  //         navigation.navigate("UserInformation", {
  //           email,
  //           password,
  //           username,
  //         });
  //       })
  //       .catch((error) => {
  //         setModalHeader("Sign Up Error");
  //         setModalText("Invalid information provided. Please try again.");
  //         setModalVisible(true);
  //       });
  //   } else {
  //     setModalHeader("Missing Fields");
  //     setModalText("Please enter both email and password.");
  //     setModalVisible(true);
  //   }
  // };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Back Button */}
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
          <Text style={styles.headingText}>Fill in your</Text>
          <Text style={styles.headingText}>information</Text>
        </View>

        <View style={styles.formContainer}>
          <Text style={styles.label}>First Name</Text>

          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter first name"
              onChangeText={setFirstName}
              value={firstName}
            />
          </View>

          <Text style={styles.label}>Last Name</Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter last name"
              onChangeText={setLastName}
              value={lastName}
            />
          </View>

          <Text style={styles.label}>Date Of Birth</Text>
          <TouchableOpacity
            style={styles.inputContainer}
            onPress={showDatePickerHandler}>
            <SimpleLineIcons
              name={"calendar"}
              size={20}
              color={colors.secondary}
            />
            <Text style={styles.textInput}>
              {isDateConfirmed
                ? dateOfBirth.toDateString()
                : "Select date of birth"}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={dateOfBirth}
              mode="date"
              display="default"
              onChange={onDateChange}
            />
          )}

          <Text style={styles.label}>{!isInformationCorrect}</Text>

          <View style={styles.checkboxContainer}>
            <BouncyCheckbox
              size={20}
              fillColor={colors.primary}
              unFillColor={colors.white}
              text="I confirm that the information entered is correct"
              textStyle={styles.checkboxTextStyle}
              onPress={(isChecked) => {
                setIsInformationCorrect(isChecked);
              }}
            />
          </View>
        </View>

        <Button
          clickHandler={signupHandler}
          disabled={!isInformationCorrect}
          buttonType="BottomButton">
          Confirm
        </Button>

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
    marginTop: "10%",
  },
  label: {
    fontSize: 14,
    marginBottom: "3%",
    paddingLeft: "1%",
  },
  textInput: {
    flex: 1,
    paddingHorizontal: 10,
    fontFamily: fonts.Light,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.secondary,
    borderRadius: 10,
    padding: Platform.OS === "android" ? "2%" : "3%",
    marginBottom: 15,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: "5%",
  },
  checkboxTextStyle: {
    textDecorationLine: "none",
    fontFamily: fonts.Light,
    fontSize: 14,
  },
});

export default UserInformationScreen;
