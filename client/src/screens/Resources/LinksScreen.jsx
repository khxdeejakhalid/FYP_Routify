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
import ScreenWithList from "../../components/SectionWithList";

import React from "react";
import { colors } from "../../utils/colors";

import { useNavigation } from "@react-navigation/native";
import { fonts } from "../../utils/fonts";
import List from "../../components/List";

const { width, height } = Dimensions.get("window");
const LinksScreen = () => {
  const navigation = useNavigation();
  const linkNavItems = [
    {
      id: 1,
      title: "Book Online Driving Test",
      link: "https://myroadsafety.rsa.ie/",
      route: "Tutorials",
    },
    {
      id: 2,
      title: "Download Test Booking Form",
      link: "https://www.rsa.ie/docs/default-source/services/s1.5-driving-test/rsa-driving-test-application-form.pdf?sfvrsn=a48f8280_14",
      route: "Progress",
    },
    {
      id: 3,
      title: "Apply for Driver's License",
      link: "https://www.ndls.ie/licensed-driver/my-first-time-driving-licence.html",
      route: "Help",
    },
    {
      id: 4,
      title: "Renew Learner Permit",
      link: "https://www.ndls.ie/",
    },
  ];

  // * Functions
  const handleGoBack = () => {
    navigation.goBack();
  };
  return (
    <ScreenWithList
      title={"Links"}
      navItems={linkNavItems}
      onGoBack={handleGoBack}
    />
  );
};
export default LinksScreen;
