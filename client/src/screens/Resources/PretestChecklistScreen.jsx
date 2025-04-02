import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Keyboard,
  Dimensions,
  TouchableWithoutFeedback,
  Alert,
  Image,
} from "react-native";
import * as Progress from "react-native-progress";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { colors } from "../../utils/colors";
import { fonts } from "../../utils/fonts";

const { width, height } = Dimensions.get("window");

const checklistItems = [
  { id: 1, task: "Valid NCT", checked: false },
  { id: 2, task: "Valid Motor Tax Disc", checked: false },
  { id: 3, task: "Valid Insurance", checked: false },
  { id: 4, task: "Valid Learner Permit", checked: false },
  { id: 5, task: "L-plates displayed on front and rear", checked: false },
  { id: 6, task: "All lights working", checked: false },
  { id: 7, task: "Bonnet Check", checked: false },
  { id: 8, task: "Seatbelts functioning correctly", checked: false },
  { id: 9, task: "Windows functioning correctly", checked: false },
  { id: 10, task: "Tyres are in suitable condition", checked: false },
];

const PreTestChecklist = () => {
  const navigation = useNavigation();

  // * States
  const [tasks, setTasks] = useState(checklistItems);
  const [progress, setProgress] = useState(0);

  // * Functions
  const handleToggle = (id) => {
    const updatedTasks = tasks.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item,
    );
    setTasks(updatedTasks);
    calculateProgress(updatedTasks);

    if (updatedTasks.every((item) => item.checked)) {
      Alert.alert(
        "Congratulations!",
        "You are all set to take your driving test!",
      );
    }
  };

  const calculateProgress = (updatedTasks) => {
    const completedTasks = updatedTasks.filter((item) => item.checked).length;
    setProgress(completedTasks / updatedTasks.length);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.item, item.checked && styles.itemChecked]}
      onPress={() => handleToggle(item.id)}>
      <Ionicons
        name={item.checked ? "checkbox-outline" : "square-outline"}
        size={24}
        color={item.checked ? "green" : "gray"}
      />
      <Text style={[styles.itemText, item.checked && styles.itemTextChecked]}>
        {item.task}
      </Text>
    </TouchableOpacity>
  );

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity
          onPress={handleGoBack}
          style={styles.backButtonWrapper}>
          <Ionicons
            size={25}
            color={colors.primary}
            name={"arrow-back-outline"}
          />
        </TouchableOpacity>

        {/* Logo */}
        <Image
          alt="Logo"
          style={styles.logo}
          source={require("../../assets/logo.png")}
        />

        {/* Checklist items with progress bar  */}
        <View style={styles.contentWrapper}>
          <Text style={styles.title}>{"Pre-Test Checklist"}</Text>
          <Progress.Bar
            width={200}
            animated={true}
            progress={progress}
            color={colors.primary}
            style={styles.progressBar}
          />
          <FlatList
            data={tasks}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  logo: {
    width: width * 0.8,
    height: height * 0.1,
    marginTop: height * 0.1,
    alignSelf: "center",
  },
  contentWrapper: {
    flex: 1,
    marginTop: "10%",
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
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
  },
  title: {
    fontSize: 32,
    textTransform: "uppercase",
    fontFamily: fonts.SemiBold,
    color: colors.primary,
    marginBottom: 20,
    textAlign: "center",
  },
  progressBar: {
    alignSelf: "center",
    marginVertical: 10,
  },
  list: {
    marginTop: 10,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginBottom: 8,
    borderRadius: 5,
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  itemChecked: {
    backgroundColor: "#dff0d8",
    borderColor: "green",
  },
  itemText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  itemTextChecked: {
    textDecorationLine: "line-through",
    color: "gray",
  },
});

export default PreTestChecklist;
