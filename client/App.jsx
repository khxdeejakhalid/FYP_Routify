import { StyleSheet, ActivityIndicator } from "react-native";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
//Components
import SignupScreen from "./src/screens/SignupScreen";
import LoginScreen from "./src/screens/LoginScreen";
import WelcomeScreen from "./src/screens/WelcomeScreen";
import useAuth from "./hooks/useAuth";
import HomeScreen from "./src/screens/HomeScreen";
import ProgressScreen from "./src/screens/ProgressScreen";
import HelpScreen from "./src/screens/HelpScreen";
import UserProfileScreen from "./src/screens/UserProfileScreen";
import TestCenterScreen from "./src/screens/TestCenterScreen";
import RouteScreen from "./src/screens/RoutesScreen";

const Stack = createNativeStackNavigator();

const App = () => {
  const { user } = useAuth();
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

  if (user) {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Home"
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name={"Home"} component={HomeScreen} />
          <Stack.Screen name={"Progress"} component={ProgressScreen} />
          <Stack.Screen name={"TestCenteres"} component={TestCenterScreen} />
          <Stack.Screen name={"Routes"} component={RouteScreen} />
          <Stack.Screen name={"Help"} component={HelpScreen} />
          <Stack.Screen name={"UserProfile"} component={UserProfileScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Welcome"
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name={"Welcome"} component={WelcomeScreen} />
          <Stack.Screen name={"Login"} component={LoginScreen} />
          <Stack.Screen name={"Signup"} component={SignupScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
};

export default App;

const styles = StyleSheet.create({});
