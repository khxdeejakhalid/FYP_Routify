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
// Components
import SignupScreen from "./src/screens/SignupScreen";
import LoginScreen from "./src/screens/LoginScreen";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import { AuthProvider, AuthContext } from "./src/context/AuthContext";
import HomeScreen from "./src/screens/HomeScreen";
import FeedbackScreen from "./src/screens/FeedbackScreen";
import HelpScreen from "./src/screens/HelpScreen";
import UserProfileScreen from "./src/screens/UserProfileScreen";
import TestCenterScreen from "./src/screens/TestCenterScreen";
import RouteScreen from "./src/screens/RoutesScreen";
import MapScreen from "./src/screens/MapScreen";
import UserInformationScreen from "./src/screens/UserInformationScreen";

const Stack = createNativeStackNavigator();

const App = () => {
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
                name={"TestCenteres"}
                component={TestCenterScreen}
              />
              <Stack.Screen name={"Routes"} component={RouteScreen} />
              <Stack.Screen name={"Help"} component={HelpScreen} />
              <Stack.Screen
                name={"UserProfile"}
                component={UserProfileScreen}
              />
              <Stack.Screen name={"Map"} component={MapScreen} />
            </>
          ) : (
            <>
              <Stack.Screen name={"Welcome"} component={WelcomeScreen} />
              <Stack.Screen name={"Login"} component={LoginScreen} />
              <Stack.Screen name={"Signup"} component={SignupScreen} />
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
