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
const UserProfileScreen = () => {
  const navigation = useNavigation();

  return (
    <View>
      <Text>PROFILE</Text>
    </View>
  );
};

export default UserProfileScreen;
