import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Dimensions,
} from "react-native";
import { useContext, useEffect } from "react";
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { AuthContext } from "../context/AuthContext";

const { width, height } = Dimensions.get("window");
const HomeScreen = () => {
  const { handleSignOut, user, isLogin } = useContext(AuthContext);
  const navigation = useNavigation();

  const handleLogout = async () => {
    await handleSignOut();
  };

  const homeNavItems = [
    ...(user.role === "instructor"
      ? [
          {
            id: "view_learners",
            title: "View Learners",
            route: "ViewLearnersScreen",
            iconSrc: require("../assets/icons/dashboard/learners.png"),
          },
        ]
      : [
          {
            id: "routes",
            title: "Routes",
            route: "TestCenteres",
            iconSrc: require("../assets/icons/dashboard/routes-home-icon.png"),
          },
          {
            id: "progress",
            title: "Progress",
            route: "Progress",
            iconSrc: require("../assets/icons/dashboard/progress-home-icon.png"),
          },
          {
            id: "resources",
            title: "Resources",
            route: "Help",
            iconSrc: require("../assets/icons/dashboard/help-home-icon.png"),
          },
          {
            id: "lesson_feedback",
            title: "Lesson Feedback",
            route: "LessonsFeedback",
            iconSrc: require("../assets/icons/dashboard/feedback.png"),
          },
        ]),
    {
      id: "profile",
      title: "Profile",
      route: "UserProfile",
      iconSrc: require("../assets/icons/dashboard/profile-home-icon.png"),
    },
    {
      id: "sessions",
      title: "Sessions",
      route: "SessionsInfo",
      iconSrc: require("../assets/icons/dashboard/calendar.png"),
    },
  ];

  useEffect(() => {
    if (!isLogin) {
      navigation.navigate("Welcome");
    }
  }, [isLogin]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.logoutButtonWrapper}
        onPress={handleLogout}>
        <Ionicons name={"log-out-outline"} color={colors.primary} size={25} />
      </TouchableOpacity>

      <Image
        alt="Logo"
        source={require("../assets/logo.png")}
        style={styles.logo}
      />

      <Text style={styles.title}>Your Route To Success</Text>

      <View style={styles.gridContainer}>
        {homeNavItems.map((navItem) => (
          <TouchableOpacity
            key={navItem.id}
            style={styles.box}
            onPress={() => navigation.navigate(navItem.route)}>
            <Image
              alt={navItem.title}
              source={navItem.iconSrc}
              style={styles.boxIcon}
            />
            <Text style={styles.boxText}>{navItem.title.toUpperCase()}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutButtonWrapper: {
    position: "absolute",
    top: 50,
    right: 10,
    height: 40,
    width: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    height: height * 0.1,
    width: width * 0.8,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
    marginBottom: "20%",
  },
  gridContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    width: "80%",
  },
  box: {
    width: "45%",
    height: height * 0.15,
    backgroundColor: colors.primary,
    boxShadow: "4px 4px black",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: height * 0.02,
    borderRadius: 10,
    padding: 15,
  },
  boxText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.SemiBold,
    textAlign: "center",
  },
  boxIcon: {
    width: Platform.OS === "android" ? width * 0.1 : width * 0.1,
    height: Platform.OS === "android" ? width * 0.1 : width * 0.1,
    marginBottom: height * 0.01,
  },
});
export default HomeScreen;
