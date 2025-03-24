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
  Linking,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import React from "react";
import { colors } from "../../utils/colors";

import { useNavigation } from "@react-navigation/native";
import { fonts } from "../../utils/fonts";
import List from "../../components/List";

const { width, height } = Dimensions.get("window");
const TutorialsScreen = () => {
  const navigation = useNavigation();
  const resourceNavItems = [
    {
      id: 1,
      title: "Reverse Around Corner",
      link: "https://youtu.be/mH9OAv8KiOY?si=pNqDm5w3bSPmkJaB",
      route: "Tutorials",
    },
    {
      id: 2,
      title: "Turnabout",
      link: "https://youtu.be/i6-6k2y7DEA?si=OTmsPZTa78UvqysP",
      route: "Progress",
    },
    {
      id: 3,
      title: "Hill Start",
      link: "https://youtu.be/DiwKsVUmL_M?si=xV75fXxgrPUeuhvT ",
      route: "Help",
    },
    {
      id: 4,
      title: "Roundabouts",
      link: "https://youtu.be/VEd7uAVsHt0?si=gOJsThuprtPLQ_Pl",
    },
    {
      id: 5,
      title: "Turning Right",
      link: ": https://youtu.be/nILHzsDznR4?si=vXcGW5rXdFMJxErj",
    },
    {
      id: 6,
      title: "Turning Left",
      link: ": https://youtu.be/ZZd72Ox7jP0?si=W_85_D7s9UnQ9KDR",
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
        <View style={styles.contentWrapper}>
          <Text style={styles.title}>TUTORIALS</Text>
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
export default TutorialsScreen;
