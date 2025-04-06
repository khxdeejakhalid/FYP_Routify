import React from "react";
import { useState, useEffect } from "react";

import { useNavigation } from "@react-navigation/native";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
  View,
  TouchableWithoutFeedback,
  ScrollView,
  Keyboard,
} from "react-native";
import DateSelector from "../../components/DateSelector";
import TimeSelector from "../../components/TimeSelector";

import Ionicons from "react-native-vector-icons/Ionicons";
import moment from "moment";
import { colors } from "../../utils/colors";
import { fonts } from "../../utils/fonts";
const { width, height } = Dimensions.get("window");

const Calendar = () => {
  const navigation = useNavigation();
  const [dates, setDates] = useState([]);
  const [times, setTimes] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const [selectedDate, setSelectedDate] = useState(new Date().toISOString());
  // * Functions
  const onGoBack = () => {
    navigation.goBack();
  };

  const getDates = () => {
    const _dates = [];
    for (let i = 0; i < 10; i++) {
      const date = moment().add(i, "days");
      _dates.push(date);
    }
    setDates(_dates);
  };
  const getTimesForDate = (selectedDate) => {
    const times = [];
    const startOfEvening = moment(selectedDate).startOf("day").add(13, "hours");
    const endOfEvening = moment(selectedDate).startOf("day").add(19, "hours");

    for (
      let time = moment(startOfEvening);
      time.isBefore(endOfEvening);
      time.add(1, "hours")
    ) {
      times.push(time.format("h:mm A"));
    }
    setTimes(times);
  };

  useEffect(() => {
    getDates();
    getTimesForDate(selectedDate);
  }, []);
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity style={styles.backButtonWrapper} onPress={onGoBack}>
          <Ionicons
            size={25}
            color={colors.primary}
            name={"arrow-back-outline"}
          />
        </TouchableOpacity>

        {/* Logo */}
        <Image
          alt="Logo"
          style={styles.logo}
          source={require("../../assets/logo.png")}
        />
        {/* Calendar - Date Picker  */}
        <View style={styles.contentWrapper}>
          <View style={{ marginBottom: 20 }}>
            <Text style={styles.title}>Select Day</Text>
            <View style={styles.scroll}>
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {dates.map((date, index) => (
                  <DateSelector
                    key={index}
                    date={date}
                    onSelectDate={setSelectedDate}
                    selected={moment(selectedDate).format("YYYY-MM-DD")}
                  />
                ))}
              </ScrollView>
            </View>
          </View>
          {/* Time Picker */}
          <Text style={styles.title}>Select Time</Text>

          <View style={{ marginTop: 20 }}>
            <Text style={styles.subtitle}>Start Time</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TimeSelector
                times={times}
                selected={startTime}
                onSelectTime={setStartTime}
              />
            </ScrollView>
          </View>

          <View style={{ marginTop: 20 }}>
            <Text style={styles.subtitle}>End Time</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TimeSelector
                times={times}
                selected={endTime}
                onSelectTime={setEndTime}
              />
            </ScrollView>
          </View>
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
  logo: {
    width: width * 0.8,
    height: height * 0.1,
    marginTop: height * 0.1,
    alignSelf: "center",
  },
  contentWrapper: {
    flex: 1,
    marginTop: "10%",
  },
  title: {
    fontSize: 32,
    textTransform: "uppercase",
    fontFamily: fonts.SemiBold,
    color: colors.primary,
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    fontFamily: fonts.SemiBold,
    color: colors.black,
    paddingLeft: 5,
  },
  dateSection: {
    width: "100%",
    padding: 10,
  },
});
export default Calendar;
