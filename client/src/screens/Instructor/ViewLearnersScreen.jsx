import React, { useEffect, useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../context/AuthContext";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  View,
  TouchableWithoutFeedback,
  Keyboard,
  FlatList,
} from "react-native";
import { colors } from "../../utils/colors";
import { fonts } from "../../utils/fonts";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width, height } = Dimensions.get("window");

const ViewLearnersScreen = () => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  // * Functions
  const handleGoBack = () => {
    navigation.goBack();
  };

  const renderListItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("LessonsFeedback", { learner: item })}>
      <Text style={styles.cardText}>{item.learnerEmail}</Text>
    </TouchableOpacity>
  );

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity
          style={styles.backButtonWrapper}
          onPress={handleGoBack}>
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
        <View style={styles.contentWrapper}>
          <Text style={styles.title}>View Learners</Text>
          <FlatList
            renderItem={renderListItem}
            data={user.assignedLearners}
            contentContainerStyle={styles.list}
            keyExtractor={(item) => item.email}
          />
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
  },
  list: {
    paddingVertical: 8,
  },
  card: {
    backgroundColor: colors.primary,
    padding: 20,
    marginVertical: 10,
    borderRadius: 12,
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.white,
  },
  cardText: {
    fontSize: 18,
    fontFamily: fonts.Medium,
    color: "#fff",
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
  title: {
    fontSize: 32,
    textTransform: "uppercase",
    fontFamily: fonts.SemiBold,
    color: colors.primary,
    marginBottom: 20,
    textAlign: "center",
  },
});

export default ViewLearnersScreen;
