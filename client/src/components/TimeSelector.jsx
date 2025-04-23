import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Platform,
  Dimensions,
} from "react-native";

import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";

const TimeSelector = ({ sessionTimeSlots, onSelectTime, selected, disabledTimes = [] }) => {
  const renderItem = ({ item }) => {
    const [time, period] = item.split(" ");
    const isDisabled = disabledTimes.includes(item);

    return (
      <TouchableOpacity
        onPress={() => !isDisabled && onSelectTime(item)}
        style={[
          styles.timeSlot,
          selected === item && { backgroundColor: colors.primary },
          isDisabled && styles.disabledTimeSlot,
        ]}>
        <View style={styles.mainContainer}>
          <Text
            style={[
              styles.timeText,
              selected === item && {
                color: colors.white,
                fontFamily: fonts.Bold,
              },
            ]}>
            {time}
          </Text>
          <Text
            style={[
              styles.periodText,
              selected === item && { color: colors.white },
            ]}>
            {period}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      data={sessionTimeSlots}
      renderItem={renderItem}
      numColumns={12}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={styles.gridContainer}
    />
  );
};

export default TimeSelector;

const styles = StyleSheet.create({
  gridContainer: {
    padding: 10,
    alignItems: "center",
  },
  timeSlot: {
    backgroundColor: "#eee",
    borderRadius: 10,
    borderColor: "#ddd",
    alignItems: "center",
    height: Platform.OS === "android" ? 70 : 70,
    width: 100,
    marginHorizontal: 5,
  },
  mainContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  timeText: {
    fontFamily: fonts.SemiBold,
    fontSize: Platform.OS === "android" ? 16 : 24,
  },
  periodText: {
    fontFamily: fonts.Regular,
    fontSize: Platform.OS === "android" ? 14 : 16,
  },
  disabledTimeSlot: {
    backgroundColor: "#E0E0E0",
    opacity: 0.6,
  },
  disabledText: {
    color: "#A0A0A0",
  },
});
