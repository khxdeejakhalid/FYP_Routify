import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import moment from "moment";
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";

const Date = ({ date, onSelectDate, selected }) => {
  // * Constants
  const day =
    moment(date).format("YYYY-MM-DD") === moment().format("YYYY-MM-DD")
      ? "Today"
      : moment(date).format("ddd");
  const dayNumber = moment(date).format("D");
  const month = moment(date).format("MMM");
  const fullDate = moment(date).format("YYYY-MM-DD");

  return (
    <TouchableOpacity
      onPress={() => onSelectDate(fullDate)}
      style={[
        styles.card,
        selected === fullDate && { backgroundColor: colors.primary },
      ]}>
      <View style={styles.mainContainer}>
        <Text
          style={[
            styles.medium,
            selected === fullDate && { color: colors.white },
          ]}>
          {day}
        </Text>
        {/* <View style={{ height: 5 }} /> */}
        <Text
          style={[
            styles.big,
            selected === fullDate && {
              color: colors.white,
              fontFamily: fonts.Bold,
              fontSize: 24,
            },
          ]}>
          {dayNumber}
        </Text>
        <Text
          style={[
            styles.small,
            selected === fullDate && { color: colors.white },
          ]}>
          {month}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default Date;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#eee",
    borderRadius: 10,
    borderColor: "#ddd",
    padding: 10,
    marginVertical: 10,
    alignItems: "center",
    height: 95,
    width: 80,
    marginHorizontal: 5,
  },
  mainContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  big: {
    fontFamily: fonts.SemiBold,
    fontSize: 24,
  },
  medium: {
    fontSize: 16,
  },
  small: {
    fontSize: 12,
  },
});
