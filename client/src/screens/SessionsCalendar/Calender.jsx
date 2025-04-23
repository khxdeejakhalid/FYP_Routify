import { useState, useEffect, useContext } from "react";

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
  Platform,
} from "react-native";
import DateSelector from "../../components/DateSelector";
import TimeSelector from "../../components/TimeSelector";

import Ionicons from "react-native-vector-icons/Ionicons";
import moment from "moment";
import { colors } from "../../utils/colors";
import { fonts } from "../../utils/fonts";
import { AuthContext } from "../../context/AuthContext";
import { bookSession } from "../../utils/api";

const { width, height } = Dimensions.get("window");
const startTimes = [
  "8:00 AM",
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
];
const endTimes = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
  "5:00 PM",
  "6:00 PM",
  "7:00 PM",
  "8:00 PM",
];
const Calendar = () => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  const [dates, setDates] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString());
  const [disabledEndTimes, setDisabledEndTimes] = useState([]);

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

  const handleStartTimeSelect = (time) => {
    setStartTime(time);
    // Reset end time when start time changes
    setEndTime(null);

    // Disable end times that are before or equal to selected start time
    const disabledTimes = [];
    const startTimeIndex = startTimes.indexOf(time);

    endTimes.forEach((endTime) => {
      const endTimeIndex = startTimes.indexOf(endTime);
      if (endTimeIndex <= startTimeIndex) {
        disabledTimes.push(endTime);
      }
    });

    setDisabledEndTimes(disabledTimes);
  };

  const handleSubmit = async () => {
    if (!startTime || !endTime) {
      alert("Please select both start and end times.");
      return;
    }

    try {
      const formattedDate = moment(selectedDate).format("YYYY-MM-DD");
      const formattedStartTime = moment(
        `${formattedDate} ${startTime}`,
        "YYYY-MM-DD h:mm A",
      ).format("YYYY-MM-DD HH:mm:ss");
      const formattedEndTime = moment(
        `${formattedDate} ${endTime}`,
        "YYYY-MM-DD h:mm A",
      ).format("YYYY-MM-DD HH:mm:ss");

      const sessionPayload = {
        learnerEmail: user.email,
        sessionDate: formattedDate,
        instructorEmail: user.assignedInstructor.instructorEmail,
        sessionStartTime: formattedStartTime,
        sessionEndTime: formattedEndTime,
        status: "SCHEDULED",
      };

      const response = await bookSession(sessionPayload);
      if (response.success) {
        alert("Session booked successfully!");
        navigation.navigate("Home");
      }
    } catch (error) {
      console.error("Error booking session:", error);
      alert("Failed to book session. Please try again.");
    }
  };

  useEffect(() => {
    getDates();
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

          <View style={{ marginTop: Platform.OS === "android" ? 10 : 20 }}>
            <Text style={styles.subtitle}>Start Time</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TimeSelector
                selected={startTime}
                sessionTimeSlots={startTimes}
                onSelectTime={handleStartTimeSelect}
              />
            </ScrollView>
          </View>

          <View style={{ marginTop: Platform.OS === "android" ? 10 : 20 }}>
            <Text style={styles.subtitle}>End Time</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <TimeSelector
                selected={endTime}
                onSelectTime={setEndTime}
                sessionTimeSlots={endTimes}
                disabledTimes={disabledEndTimes}
              />
            </ScrollView>
          </View>
          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitButtonText}>Submit</Text>
          </TouchableOpacity>
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
  submitButton: {
    backgroundColor: colors.primary,
    padding: 12,
    alignItems: "center",
    borderRadius: 8,
    marginTop: 16,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
    fontSize: Platform.OS === "android" ? 28 : 32,
    textTransform: "uppercase",
    fontFamily: fonts.SemiBold,
    color: colors.primary,
    marginBottom: Platform.OS === "android" ? 5 : 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: Platform.OS === "android" ? 14 : 16,
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
