import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";
import Button from "../components/Button";
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";

const { width, height } = Dimensions.get("window");

const TestCenterScreen = () => {
  const navigation = useNavigation();

  const [selectedCenter, setSelectedCenter] = useState("");

  const testCenters = [
    { label: "Tallaght", value: "center1" },
    { label: "Test Center 2", value: "center2" },
    { label: "Test Center 3", value: "center3" },
    { label: "Test Center 4", value: "center4" },
    { label: "Test Center 5", value: "center5" },
    { label: "Test Center 6", value: "center6" },
    { label: "Test Center 7", value: "center7" },
  ];

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleNext = () => {
    navigation.navigate("Routes");
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
        source={require("../assets/logo.png")}
        style={styles.logo}
        alt="Logo"
      />

      {/* Picker Content */}
      <View style={styles.contentWrapper}>
        <Text style={styles.title}>Select a Test Center</Text>
        <Picker
          selectedValue={selectedCenter}
          style={styles.picker}
          onValueChange={(itemValue) => setSelectedCenter(itemValue)}>
          {testCenters.map((center) => (
            <Picker.Item
              key={center.value}
              label={center.label}
              value={center.value}
            />
          ))}
        </Picker>
      </View>

      <Button
        clickHandler={handleNext}
        disabled={false}
        buttonType="BottomButton">
        Next
      </Button>
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
  picker: {
    height: 50,
    width: "80%",
    color: colors.primary,
  },
});

export default TestCenterScreen;
