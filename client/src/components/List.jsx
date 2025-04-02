import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
  Linking,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

import React from "react";
import { colors } from "../utils/colors";

import { useNavigation } from "@react-navigation/native";
import { fonts } from "../utils/fonts";

const List = ({ navItems }) => {
  const navigation = useNavigation();

  // * Functions
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        if (item.link) {
          Linking.openURL(item.link);
        } else if (item.route) {
          navigation.navigate(item.route);
        }
      }}>
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <Text style={styles.cardText}>{item.title}</Text>
        <Ionicons
          size={25}
          color={colors.white}
          name={"chevron-forward-outline"}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={navItems}
      renderItem={renderItem}
      contentContainerStyle={styles.list}
      keyExtractor={(item) => item.id.toString()}
    />
  );
};
const styles = StyleSheet.create({
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
});
export default List;
