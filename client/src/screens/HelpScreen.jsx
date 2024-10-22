import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import React from "react";
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";
import { useNavigation } from "@react-navigation/native";

const { width, height } = Dimensions.get("window");
const HelpScreen = () => {
  const navigation = useNavigation();

  return (
    <View>
      <Text>HelpScreen</Text>
    </View>
  );
};

export default HelpScreen;
