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
const Header = () => {
  const navigation = useNavigation();
  // @TODO: Bawany add header
  return (
    <View>
      <Text>Header</Text>
    </View>
  );
};

export default Header;
