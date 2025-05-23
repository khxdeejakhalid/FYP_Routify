import {
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Platform,
} from "react-native";
import { useContext } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import { AuthProvider, AuthContext } from "./src/context/AuthContext";
// Push Notifications
import registerNNPushToken from "native-notify";

// Components

import WelcomeScreen from "./src/screens/WelcomeScreen";
import HomeScreen from "./src/screens/HomeScreen";

// * Auth Screens
import SignupScreen from "./src/screens/SignupScreen";
import LoginScreen from "./src/screens/LoginScreen";
import ResetPassword from "./src/screens/ForgetPassword";

// * Maps
import TestCenterScreen from "./src/screens/Maps/TestCentersScreen";
import RouteScreen from "./src/screens/Maps/RoutesScreen";
import MapScreen from "./src/screens/Maps/MapsScreen";

// * Profile
import UserProfileScreen from "./src/screens/Profile/ProfileScreen";
import UserInformationScreen from "./src/screens/Profile/UserInformationScreen";

// * Sessions
import SessionsInfo from "./src/screens/SessionsCalendar/SessionsInfo";
import Calendar from "./src/screens/SessionsCalendar/Calender";
import BookedSessions from "./src/screens/SessionsCalendar/BookedSessions";
import ViewLearnersScreen from "./src/screens/Instructor/ViewLearnersScreen";
import SessionRequests from "./src/screens/SessionsCalendar/SessionRequests";
import LearnersSelections from "./src/screens/SessionsCalendar/LearnersSelections";

// * Resources
import TutorialsScreen from "./src/screens/Resources/TutorialsScreen";
import LinksScreen from "./src/screens/Resources/LinksScreen";
import HelpScreen from "./src/screens/Resources/HelpScreen";
import PreTestChecklist from "./src/screens/Resources/PretestChecklistScreen";
import FeedbackScreen from "./src/screens/Progress/FeedbackScreen";
import LessonsFeedback from "./src/screens/LessonsFeedback/LessonsFeedback";
import QuizScreen from "./src/screens/Resources/QuizScreen";

// * Notifications
import Notifications from "./src/screens/Notifications/Notifications";

const Stack = createNativeStackNavigator();
import { NOTIFY_APP_ID, NOTIFY_APP_TOKEN } from "@env";

const App = () => {
  registerNNPushToken(NOTIFY_APP_ID, NOTIFY_APP_TOKEN);

  const { isLogin } = useContext(AuthContext);

  const [fontsLoaded] = useFonts({
    "Poppins-Bold": require("./assets/fonts/Poppins-Bold.ttf"),
    "Poppins-Light": require("./assets/fonts/Poppins-Light.ttf"),
    "Poppins-Medium": require("./assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("./assets/fonts/Poppins-Regular.ttf"),
    "Poppins-SemiBold": require("./assets/fonts/Poppins-SemiBold.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <ActivityIndicator size="large" color="#ffffff" style={{ flex: 1 }} />
    );
  }

  return (
    <>
      {Platform.OS === "ios" && <StatusBar barStyle="dark-content" />}
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={isLogin ? "Home" : "Welcome"}
          screenOptions={{
            headerShown: false,
          }}>
          {isLogin ? (
            <>
              <Stack.Screen name={"Home"} component={HomeScreen} />
              <Stack.Screen name={"Progress"} component={FeedbackScreen} />
              <Stack.Screen
                name={"UserProfile"}
                component={UserProfileScreen}
              />
              {/* Manuever's screen */}
              <Stack.Screen name={"Routes"} component={RouteScreen} />
              <Stack.Screen
                name={"TestCenteres"}
                component={TestCenterScreen}
              />
              <Stack.Screen name={"Map"} component={MapScreen} />
              {/* Resources Screens */}
              <Stack.Screen name={"Help"} component={HelpScreen} />
              <Stack.Screen name={"Tutorials"} component={TutorialsScreen} />
              <Stack.Screen name={"Links"} component={LinksScreen} />
              <Stack.Screen
                name={"PreTestChecklist"}
                component={PreTestChecklist}
              />
              <Stack.Screen
                name={"ViewLearnersScreen"}
                component={ViewLearnersScreen}
              />
              <Stack.Screen name={"QuizScreen"} component={QuizScreen} />
              <Stack.Screen name={"Calendar"} component={Calendar} />
              <Stack.Screen name={"SessionsInfo"} component={SessionsInfo} />
              <Stack.Screen
                name={"BookedSessions"}
                component={BookedSessions}
              />
              <Stack.Screen
                name={"SessionRequests"}
                component={SessionRequests}
              />
              <Stack.Screen
                name={"LearnersSelections"}
                component={LearnersSelections}
              />
              <Stack.Screen
                name={"LessonsFeedback"}
                component={LessonsFeedback}
              />
              <Stack.Screen name={"Notifications"} component={Notifications} />
            </>
          ) : (
            <>
              <Stack.Screen name={"Welcome"} component={WelcomeScreen} />
              <Stack.Screen name={"Login"} component={LoginScreen} />
              <Stack.Screen name={"Signup"} component={SignupScreen} />
              <Stack.Screen name={"ResetPassword"} component={ResetPassword} />
              <Stack.Screen
                name={"UserInformation"}
                component={UserInformationScreen}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
};

export default () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);

const styles = StyleSheet.create({});
