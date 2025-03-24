import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  View,
  FlatList,
  Dimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import React from "react";
import { colors } from "../../utils/colors";

import { useNavigation } from "@react-navigation/native";
import { fonts } from "../../utils/fonts";
import List from "../../components/List";
const { width, height } = Dimensions.get("window");
const HelpScreen = () => {
  const navigation = useNavigation();
  const resourceNavItems = [
    {
      id: 1,
      title: "Tutorials",
      route: "Tutorials",
    },
    {
      id: 2,
      title: "Links",
      route: "Progress",
    },
    {
      id: 3,
      title: "Q&A",
      route: "Help",
    },
    {
      id: 4,
      title: "Checklists",
    },
  ];

  // * Functions
  const handleGoBack = () => {
    navigation.goBack();
  };

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

        {/* Logo */}
        <Image
          alt="Logo"
          style={styles.logo}
          source={require("../../assets/logo.png")}
        />
        {/* List */}
        <View style={styles.contentWrapper}>
          <Text style={styles.title}>RESOURCES</Text>
          <List navItems={resourceNavItems} />
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
    justifyContent: "space-between",
  },
  logo: {
    width: width * 0.8,
    height: height * 0.1,
    marginTop: height * 0.1,
    alignSelf: "center",
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
  contentWrapper: {
    flex: 1,
    marginTop: "10%",
  },
  title: {
    fontSize: 32,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
    marginBottom: 20,
    textAlign: "center",
  },
});
export default HelpScreen;
