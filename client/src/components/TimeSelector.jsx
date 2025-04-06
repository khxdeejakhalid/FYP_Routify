import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";

import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";

const Time = ({ times, onSelectTime, selected }) => {
  const renderItem = ({ item }) => {
    const [time, period] = item.split(" ");

    return (
      <TouchableOpacity
        onPress={() => onSelectTime(item)}
        style={[
          styles.timeSlot,
          selected === item && { backgroundColor: colors.primary },
        ]}>
        <Text
          style={[
            styles.timeText,
            selected === item && { color: "#fff", fontFamily: fonts.Bold },
          ]}>
          {time}
        </Text>
        <Text
          style={[styles.periodText, selected === item && { color: "#fff" }]}>
          {period}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={times}
      renderItem={renderItem}
      numColumns={12}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={styles.gridContainer}
    />
  );
};

export default Time;

const styles = StyleSheet.create({
  gridContainer: {
    padding: 10,
    alignItems: "center",
  },
  timeSlot: {
    backgroundColor: "#eee",
    borderRadius: 10,
    borderColor: "#ddd",
    padding: 10,
    marginVertical: 10,
    alignItems: "center",
    height: 70,
    width: 100,
    marginHorizontal: 5,
  },
  timeText: {
    fontFamily: fonts.SemiBold,
    fontSize: 24,
  },
});
