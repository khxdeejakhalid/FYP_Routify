import { useContext, useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import Button from "../components/Button";
import Ionicons from "react-native-vector-icons/Ionicons";
import { AuthContext } from "../context/AuthContext";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";
import { getUserInformation, updateUserInformation } from "../utils/api";
import CustomModal from "../components/CustomModal";

const { width, height } = Dimensions.get("window");

const UserProfileScreen = () => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [userInfo, setUserInfo] = useState({});
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [modalText, setModalText] = useState("");
  const [modalHeader, setModalHeader] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleModalClose = () => {
    setModalVisible(false);
    navigation.navigate("Home");
  };

  useEffect(() => {
    async function fetchUserProfile() {
      const response = await getUserInformation(user.email);
      if (response.success) {
        setUserInfo(response.user);
        setNewName(response.user.name);
        setNewPassword(response.user.password);
      } else {
        setModalHeader("Failure");
        setModalText(response.description);
        setModalVisible(true);
      }
    }

    fetchUserProfile();
  }, []);

  const handleEditPasswordPress = () => {
    setNewPassword("");
    setIsEditingPassword(true);
  };

  const handleEditNamePress = () => {
    setIsEditingName(true);
  };

  const isChanged = () => {
    if (
      userInfo.name !== newName ||
      (userInfo.password !== newPassword && newPassword !== "")
    ) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  };

  const handleUpdatePasswordPress = async () => {
    setIsEditingPassword(false);
    isChanged();
  };

  const handleUpdateNamePress = async () => {
    setIsEditingName(false);
    isChanged();
  };

  const updateHandler = async () => {
    const updatedData = { name: newName, password: newPassword };
    const response = await updateUserInformation(userInfo.email, updatedData);

    if (response.success) {
      setUserInfo({ ...userInfo, name: newName, password: newPassword });
      setModalHeader("Success");
      setModalText("Profile updated successfully.");
    } else {
      setModalHeader("Failure");
      setModalText(response.description);
    }
    setModalVisible(true);
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButtonWrapper} onPress={handleGoBack}>
        <Ionicons
          name={"arrow-back-outline"}
          color={colors.primary}
          size={25}
        />
      </TouchableOpacity>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={100}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          showsHorizontalScrollIndicator={false}>
          {/* Title */}
          <View style={styles.textContainer}>
            <Text style={styles.headingText}>Your</Text>
            <Text style={styles.headingText}>Profile</Text>
          </View>

          {/* Profile Content */}
          <View style={styles.contentWrapper}>
            <View style={styles.fieldContainer}>
              <View style={styles.labelContainer}>
                <Text style={styles.fieldLabel}>Name:</Text>
                {!isEditingName && (
                  <TouchableOpacity onPress={handleEditNamePress}>
                    <Ionicons name="pencil" size={20} color={colors.primary} />
                  </TouchableOpacity>
                )}
              </View>
              {isEditingName ? (
                <View style={styles.editContainer}>
                  <TextInput
                    style={styles.textInput}
                    value={newName}
                    onChangeText={setNewName}
                  />
                  <TouchableOpacity onPress={handleUpdateNamePress}>
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <Text style={styles.fieldValue}>{newName}</Text>
              )}
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Username:</Text>
              <Text style={styles.fieldValue}>{userInfo.username}</Text>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Email:</Text>
              <Text style={styles.fieldValue}>{userInfo.email}</Text>
            </View>

            <View style={styles.fieldContainer}>
              <View style={styles.labelContainer}>
                <Text style={styles.fieldLabel}>Password:</Text>
                {!isEditingPassword && (
                  <TouchableOpacity onPress={handleEditPasswordPress}>
                    <Ionicons name="pencil" size={20} color={colors.primary} />
                  </TouchableOpacity>
                )}
              </View>
              {isEditingPassword ? (
                <View style={styles.editContainer}>
                  <TextInput
                    style={styles.textInput}
                    value={newPassword}
                    onChangeText={setNewPassword}
                  />
                  <TouchableOpacity onPress={handleUpdatePasswordPress}>
                    <Ionicons
                      name="checkmark"
                      size={20}
                      color={colors.primary}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <Text style={styles.fieldValue}>
                  {"•".repeat(userInfo.password?.length)}
                </Text>
              )}
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Date Of Birth:</Text>
              <Text style={styles.fieldValue}>
                {new Date(userInfo.date_of_birth).toLocaleDateString()}
              </Text>
            </View>

            <View style={styles.fieldContainer}>
              <Text style={styles.fieldLabel}>Permit Issue Date:</Text>
              <Text style={styles.fieldValue}>
                {new Date(userInfo.date_of_permit).toLocaleDateString()}
              </Text>
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
        </ScrollView>
      </KeyboardAvoidingView>
      <Button
        disabled={isDisabled}
        buttonType="BottomButton"
        clickHandler={updateHandler}>
        Update
      </Button>
    </View>
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
    zIndex: 10,
  },
  textContainer: {
    marginTop: height * 0.12,
  },
  headingText: {
    fontSize: 24,
    color: colors.primary,
    fontFamily: fonts.SemiBold,
  },
  contentWrapper: {
    flex: 1,
    alignItems: "flex-start",
    marginTop: "10%",
  },
  fieldContainer: {
    marginBottom: 15,
    width: "100%",
  },
  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  fieldLabel: {
    fontSize: 16,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
    marginRight: 10,
  },
  fieldValue: {
    fontSize: 14,
    fontFamily: fonts.Regular,
    color: "#000000",
    marginTop: 5,
  },
  editContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 5,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.gray,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
});

export default UserProfileScreen;
