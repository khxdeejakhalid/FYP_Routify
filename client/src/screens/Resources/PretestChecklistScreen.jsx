import React, { useEffect, useState, useContext } from "react";
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
import { getChecklist, saveChecklistItems } from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";

const { width, height } = Dimensions.get("window");

const PreTestChecklist = () => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  // * States
  const [tasks, setTasks] = useState([]);
  const [progress, setProgress] = useState(0);

  // * Functions
  const handleToggle = (id) => {
    const updatedTasks = tasks.map((item) =>
      item.id === id ? { ...item, status: !item.status } : item,
    );
    setTasks(updatedTasks);
    calculateProgress(updatedTasks);
  };

  const calculateProgress = (updatedTasks) => {
    const completedTasks = updatedTasks.filter((item) => item.status).length;
    setProgress(completedTasks / updatedTasks.length);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.item, item.status && styles.itemChecked]}
      onPress={() => handleToggle(item.id)}>
      <Ionicons
        name={item.status ? "checkbox-outline" : "square-outline"}
        size={24}
        color={item.status ? "green" : "gray"}
      />
      <Text style={[styles.itemText, item.status && styles.itemTextChecked]}>
        {item.checklist_name}
      </Text>
    </TouchableOpacity>
  );

  const handleGoBack = () => {
    navigation.goBack();
  };

  const getChecklistItems = async () => {
    try {
      const { checklist = [] } = await getChecklist(user.email);

      setTasks(checklist);
      calculateProgress(checklist);
    } catch (error) {
      console.error("Error fetching checklist data:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const allTasks = tasks.map((item) => ({
        id: item.id,
        status: item.status,
      }));
      await saveChecklistItems(allTasks, user.email);

      if (tasks.every((item) => item.status)) {
        Alert.alert(
          "Congratulations!",
          "You are all set to take your driving test!",
        );
      } else {
        Alert.alert(
          "Reminder",
          "Please complete all tasks before the test.",
        );
        navigation.navigate("Home");
      }
    } catch (error) {
      console.error("Error fetching checklist data:", error);
    }
  };

  useEffect(() => {
    getChecklistItems();
  }, []);

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

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  submitButton: {
    backgroundColor: colors.primary,
    padding: 12,
    alignItems: "center",
    borderRadius: 8,
    marginTop: 16,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
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
