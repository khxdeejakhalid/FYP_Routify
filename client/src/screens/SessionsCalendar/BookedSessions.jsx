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
import { getSessionsByEmail } from "../../utils/api";

const { width, height } = Dimensions.get("window");

const BookedSessions = () => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [sessions, setSessions] = useState([]);

  // * Functions
  const onGoBack = () => {
    navigation.goBack();
  };

  //   * API Calls
  const getBookedSessions = async () => {
    const response = await getSessionsByEmail(user.email);

    response.sessions.forEach((session) => {
      const startTime = session.startTime.replace("GMT+5", "+05:00");
      const endTime = session.endTime.replace("GMT+5", "+05:00");
      session.startTime = moment(startTime, "HH:mm:ssZ")
        .local()
        .format("hh:mm A");
      session.endTime = moment(endTime, "HH:mm:ssZ").local().format("hh:mm A");
    });

    setSessions(response.sessions || []);
  };

  useEffect(() => {
    getBookedSessions();
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
          <Text style={styles.title}>{"Booked Sessions"}</Text>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={true}>
            {sessions.map((session, index) => (
              <View key={index} style={styles.card}>
                <Text style={styles.dateTimeText}>
                  {`${moment(session.date).format("DD, MMM")} ${session.startTime} - ${session.endTime}`}
                </Text>

                <View style={styles.row}>
                  <View style={styles.divider} />
                  <View style={styles.content}>
                    <Text style={styles.sessionTitle}>
                      {`Lesson ${index + 1}`}
                    </Text>
                    <Text style={styles.sessionSubtitle}>
                      {`Session is booked with ${session.instructorName ? session.instructorName : session.learnerName}`}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
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
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: Platform.OS === "android" ? 0 : 5,
  },
  divider: {
    width: 3,
    height: "80%",
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
export default BookedSessions;
