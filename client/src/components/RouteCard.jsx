import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";

const RouteCard = ({ label, clickHandler, bgColor}) => {
  return (
    <TouchableOpacity onPress={clickHandler} style={[styles.item, { backgroundColor: bgColor }]}>
      <Text style={[styles.label]}>{label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: colors.primary,
    marginVertical: 8,
    padding: 20,
    alignItems: "center",
    borderRadius: 10,
  },
  label: {
    color: colors.white,
    fontSize: 14,
    fontFamily: fonts.Regular
  },
});

export default RouteCard;
