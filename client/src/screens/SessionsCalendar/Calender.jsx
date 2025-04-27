import { useState, useEffect, useContext } from "react";

import { useNavigation, useRoute } from "@react-navigation/native";
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
import { bookSession, editSession } from "../../utils/api";
// Notifications
import { indieNotificationDataService } from "../../services/notifications/indieNotificationDataService";
import { NOTIFY_APP_ID, NOTIFY_APP_TOKEN } from "@env";

const { width, height } = Dimensions.get("window");
const startTimes = [
  "08:00 AM",
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
];
const endTimes = [
  "09:00 AM",
  "10:00 AM",
  "11:00 AM",
  "12:00 PM",
  "01:00 PM",
  "02:00 PM",
  "03:00 PM",
  "04:00 PM",
  "05:00 PM",
  "06:00 PM",
  "07:00 PM",
  "08:00 PM",
];
const Calendar = () => {
  // Receive route params
  const route = useRoute();

  // Learner email is passed when Admin is booking a session with a learner
  const {
    session,
    isEditMode = false,
    learnerEmail = undefined,
  } = route.params || {};

  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  const [dates, setDates] = useState([]);
  const [startTime, setStartTime] = useState("01:00 PM");
  const [endTime, setEndTime] = useState("02:00 PM");
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
    setEndTime(null);

    const startTimeIndex = startTimes.indexOf(time);
    const disabledTimes = endTimes.slice(0, startTimeIndex); // Disable end times up to and including start time

    setDisabledEndTimes(disabledTimes);
  };

  const formatTime = (formattedDate, time) => {
    return moment(`${formattedDate} ${time}`, "YYYY-MM-DD h:mm A").format(
      "YYYY-MM-DD HH:mm:ss",
    );
  };

  const handleSubmit = async () => {
    const subId =
      user.role === "instructor"
        ? isEditMode
          ? session.learnerEmail
          : learnerEmail
        : user.assignedInstructor.instructorEmail;
    if (!startTime || !endTime) {
      alert("Please select the lesson's start and end times.");
      return;
    }

    try {
      const formattedDate = moment(selectedDate).format("YYYY-MM-DD");

      const formattedStartTime = formatTime(formattedDate, startTime);
      const formattedEndTime = formatTime(formattedDate, endTime);
      const sessionPayload = {
        sessionDate: formattedDate,
        sessionStartTime: formattedStartTime,
        sessionEndTime: formattedEndTime,
        status: !isEditMode ? session.status : "PENDING",
        bookedBy: user.email,
      };
      if (!isEditMode) {
        // If its a new booking, and we have learnerEmail, then Admin is booking a session with a learner otherwise
        //  a learner is booking a session with an instructor
        sessionPayload.learnerEmail = learnerEmail || user.email;
        sessionPayload.instructorEmail =
          user.role === "instructor"
            ? user.email
            : user.assignedInstructor.instructorEmail;
      }

      const promiseFn = isEditMode
        ? () => editSession(session.id, sessionPayload)
        : () => bookSession(sessionPayload);
      const response = await promiseFn();

      if (response.success) {
        // Notify the opposite party about the session booking
        const notificationPayload = {
          subID: subId,
          title: isEditMode ? "New time slot requested" : "New Session Booking",
          appId: NOTIFY_APP_ID,
          appToken: NOTIFY_APP_TOKEN,
          message: isEditMode
            ? `${user.email} has requested a new time slot. Please respond in Sessions Tab`
            : `${user.email} has booked a session with you!`,
          pushData: {
            read: false,
          },
        };
        await indieNotificationDataService.pushNotification(
          notificationPayload,
        );
        alert(`Session ${!isEditMode ? "booked" : "updated"} successfully!`);
        navigation.navigate("Home");
      }
    } catch (error) {
      console.error("Error booking session:", error);
      alert("Failed to book session! Please try again.");
    }
  };

  useEffect(() => {
    getDates();
  }, []);

  useEffect(() => {
    if (!session) return;

    setSelectedDate(moment(session.date).format("YYYY-MM-DD"));
    setStartTime(session.startTime);
    setEndTime(session.endTime);
  }, [session]);

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
