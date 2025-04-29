import React from "react";
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

import Ionicons from "react-native-vector-icons/Ionicons";
import moment from "moment";
import { colors } from "../../utils/colors";
import { fonts } from "../../utils/fonts";
import { AuthContext } from "../../context/AuthContext";
import {
  rejectSession,
  approveSession,
  getPendingSessions,
} from "../../utils/api";

import { NOTIFY_APP_ID, NOTIFY_APP_TOKEN } from "@env";
import { indieNotificationDataService } from "../../services/notifications/indieNotificationDataService";
import { formatTime } from "../../utils/routifyUtilityService";

const { width, height } = Dimensions.get("window");

const SessionRequests = () => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [sessions, setSessions] = useState([]);
  const [selectedIndex, setSelectedIndex] = useState(null);

  // * Functions

  const toggleMenu = (index) => {
    setSelectedIndex(index);
  };

  const onGoBack = () => {
    navigation.goBack();
  };

  const onApproveSession = async () => {
    const response = await approveSession(sessions[selectedIndex].id);
    setSelectedIndex(null);
    if (response.success) {
      alert("Session Approved");

      //   Notify the instructor or learner about the approval
      const notificationPayload = {
        subID:
          user.email === sessions[selectedIndex].learnerEmail
            ? sessions[selectedIndex].instructorEmail
            : sessions[selectedIndex].learnerEmail,
        title: `Session Approval Notification`,
        appId: NOTIFY_APP_ID,
        appToken: NOTIFY_APP_TOKEN,
        message: `${user.name} has approved your session request`,
        pushData: {
          read: false,
        },
      };

      await indieNotificationDataService.pushNotification(notificationPayload);
      fetchPendingSessions();
    }
  };

  const onEditSession = () => {
    setSelectedIndex(null);
    navigation.navigate("Calendar", {
      session: sessions[selectedIndex],
      isEditMode: true,
    });
  };
  const onRejectSession = async () => {
    const response = await rejectSession(sessions[selectedIndex].id);
    if (response.success) {
      setSelectedIndex(null);

      //   Notify the instructor or learner about the approval
      const notificationPayload = {
        subID:
          user.email === sessions[selectedIndex].learnerEmail
            ? sessions[selectedIndex].instructorEmail
            : sessions[selectedIndex].learnerEmail,
        title: `Session Cancellation Notification`,
        appId: NOTIFY_APP_ID,
        appToken: NOTIFY_APP_TOKEN,
        message: `${user.name} has cancelled your session request`,
        pushData: {
          read: false,
        },
      };
      await indieNotificationDataService.pushNotification(notificationPayload);

      alert("Session rejected");
      fetchPendingSessions();
    }
  };

  // * API Calls
  const fetchPendingSessions = async () => {
    const response = await getPendingSessions(user.email);

    // Filter out sessions booked by the logged-in user, so that they don't see their own requests
    const filteredSessionsByLoggedInUser = response.sessions.filter(
      (session) => session.bookedBy !== user.email,
    );

    filteredSessionsByLoggedInUser.forEach((session) => {
      const startTime = session.startTime.replace("GMT+5", "+05:00");
      const endTime = session.endTime.replace("GMT+5", "+05:00");
      session.startTime = formatTime(startTime);
      session.endTime = formatTime(endTime);
    });

    setSessions(filteredSessionsByLoggedInUser || []);
  };

  useEffect(() => {
    fetchPendingSessions();
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
        <View style={styles.contentWrapper}>
          <Text style={styles.title}>{"Pending Sessions"}</Text>
          {sessions.length === 0 ? (
            <Text
              style={{
                fontSize: 18,
                marginTop: "50%",
                textAlign: "center",
                fontFamily: fonts.Medium,
              }}>
              {"No Pending Sessions"}
            </Text>
          ) : (
            <ScrollView
              contentContainerStyle={styles.scrollContent}
              showsVerticalScrollIndicator={true}>
              {sessions.map((session, index) => (
                <View key={index} style={styles.card}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}>
                    <Text style={styles.dateTimeText}>
                      {`${moment(session.date).format("DD, MMM")} ${session.startTime} - ${session.endTime}`}
                    </Text>
                    {/* Status Chip */}
                    {session.status && (
                      <Text
                        style={[
                          styles.statusChip,
                          session.status === "SCHEDULED"
                            ? styles.pending
                            : styles.cancelled,
                        ]}>
                        {session.status.charAt(0).toUpperCase() +
                          session.status.slice(1)}
                      </Text>
                    )}
                  </View>

                  <View style={styles.row}>
                    <View style={styles.divider} />
                    <View style={styles.content}>
                      <Text style={styles.sessionTitle}>
                        {`Lesson`}
                      </Text>
                      <Text style={styles.sessionSubtitle}>
                        {`Session is booked with ${user.role === "instructor" ? session.learnerName : session.instructorName}`}
                      </Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => toggleMenu(index)}
                      style={styles.kebabIcon}>
                      <Ionicons
                        size={24}
                        color="#fff"
                        name="ellipsis-vertical-outline"
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Dropdown */}
                  {selectedIndex === index && (
                    <View style={styles.dropdown}>
                    <ScrollView contentContainerStyle={styles.dropdownContent}>
                      <TouchableOpacity style={styles.option} onPress={onApproveSession}>
                        <Text style={styles.optionText}>Approve</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.option} onPress={onRejectSession}>
                        <Text style={styles.optionText}>Reject</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.option} onPress={onEditSession}>
                        <Text style={styles.optionText}>Edit</Text>
                      </TouchableOpacity>
                      {/* Add more options here if needed */}
                    </ScrollView>
                  </View>
                  
                  )}
                </View>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  statusChipContainer: {
    flexDirection: "row",
  },
  statusChip: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    fontSize: 14,
    fontFamily: fonts.Medium,
    color: "#fff",
  },
  pending: {
    backgroundColor: "orange", 
  },
  cancelled: {
    backgroundColor: "gray", 
  },
  kebabIcon: {
    alignItems: "flex-end",
    color: colors.white,
  },
  dropdown: {
    position: "absolute",
    overflow: "hidden",
    top: 30,
    zIndex: 1000,
    right: 40,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 5,
    padding: 10,
    width: 120,
    maxHeight: 100, 
  },
  option: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  optionText: {
    fontSize: 16,
    color: "#333",
  },
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Platform.OS === "android" ? 0 : 5,
  },
  divider: {
    width: 3,
    height: "100%",
    backgroundColor: "#D4AF37",
    marginRight: 8,
  },
  content: {
    flex: 1,
  },
  card: {
    backgroundColor: colors.primary,
    padding: 15,
    marginVertical: 5,
    borderRadius: 12,
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.white,
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
    height: "100%",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    textTransform: "uppercase",
    fontFamily: fonts.SemiBold,
    color: colors.primary,
    marginBottom: Platform.OS === "android" ? 10 : 20,
    textAlign: "center",
  },
  sessionTitle: {
    fontSize: Platform.OS === "android" ? 24 : 28,
    textTransform: "uppercase",
    fontFamily: fonts.SemiBold,
    color: colors.white,
  },
  sessionSubtitle: {
    fontSize: Platform.OS === "android" ? 14 : 16,
    fontStyle: "italic",
    color: colors.gray,
  },
  dateTimeText: {
    fontSize: 14,
    fontFamily: fonts.Medium,
    color: colors.white,
  },
});
export default SessionRequests;