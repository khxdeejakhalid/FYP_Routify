import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
  Platform,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import Button from "../../components/Button";
import { colors } from "../../utils/colors";
import { fonts } from "../../utils/fonts";
import CustomModal from "../../components/CustomModal";
import { getTestCenters } from "../../utils/api";

const { width, height } = Dimensions.get("window");

const TestCenterScreen = () => {
  const navigation = useNavigation();
  const [testCenters, setTestCenters] = useState([]);
  const [selectedCenter, setSelectedCenter] = useState("");

  const [modalText, setModalText] = useState("");
  const [modalHeader, setModalHeader] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    async function fetchTestCenters() {
      const response = await getTestCenters();
      if (response.success) {
        setTestCenters(response.centers);
        setSelectedCenter(response.centers[0].NAME);
      } else {
        setModalHeader("Failure");
        setModalText(response.description);
        setModalVisible(true);
      }
    }

    fetchTestCenters();
  }, []);

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleNext = () => {
    navigation.navigate("Routes", { selectedCenter });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButtonWrapper} onPress={handleGoBack}>
        <Ionicons
          name={"arrow-back-outline"}
          color={colors.primary}
          size={25}
        />
      </TouchableOpacity>

      {/* Logo */}
      <Image
        alt="Logo"
        style={styles.logo}
        source={require("../../assets/logo.png")}
      />

      {/* Picker Content */}
      <View style={styles.contentWrapper}>
        <Text style={styles.title}>Select a Test Centre</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedCenter}
            style={styles.picker}
            onValueChange={(itemValue) => setSelectedCenter(itemValue)}>
            {testCenters.map((center) => (
              <Picker.Item
                key={center.NAME}
                label={center.NAME}
                value={center.NAME}
              />
            ))}
          </Picker>
        </View>
      </View>

      <Button
        clickHandler={handleNext}
        disabled={false}
        buttonType="BottomButton">
        Next
      </Button>

      <CustomModal
        visible={isModalVisible}
        title={modalHeader}
        message={modalText}
        singleButton={true}
        buttonOneText="Close"
        onButtonOnePress={handleModalClose}
      />
    </SafeAreaView>
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
    left: 20,
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: width * 0.8,
    height: height * 0.1,
    marginTop: height * 0.15,
    alignSelf: "center",
  },
  contentWrapper: {
    flex: 1,
    alignItems: "center",
    marginTop: "30%",
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
    marginBottom: 20,
  },
  pickerWrapper: {
    borderRadius: 10,
    overflow: Platform.OS === "android" ? "hidden" : "",
    backgroundColor: Platform.OS === "android" ? `${colors.primary}` : "",
    width: "80%",
    height: 60,
  },
  picker: {
    width: "100%",
    height: "100%",
    color: Platform.OS === "android" ? `${colors.white}` : `${colors.primary}`,
  },
});

export default TestCenterScreen;
