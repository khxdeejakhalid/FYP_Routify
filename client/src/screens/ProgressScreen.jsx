import React, { useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import RatingScale from "../components/RatingScale";
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";

const { width, height } = Dimensions.get("window");

const ProgressScreen = () => {
  const navigation = useNavigation();

  const [noOfRoutesCompleted, setNoOfRoutesCompleted] = useState(8);
  const Ratings = {
    reverseAroundCorner: "4",
    turnAbout: "3",
    hillStart: "4",
  };

  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButtonWrapper} onPress={handleGoBack}>
        <Ionicons
          name={"arrow-back-outline"}
          color={colors.primary}
          size={25}
        />
      </TouchableOpacity>

      {/* Logo */}
      <Image
        source={require("../assets/logo.png")}
        style={styles.logo}
        alt="Logo"
      />

      {/* Progress Content */}
      <View style={styles.contentWrapper}>
        <Text style={styles.title}>YOUR PROGRESS</Text>
        <View style={styles.routesCompleted}>
          <Text style={[styles.description, styles.fontSize18]}>
            No. Of Routes Completed: {noOfRoutesCompleted}
          </Text>
        </View>
        <View style={styles.manouvreContainer}>
          <Text
            style={[
              styles.description,
              styles.fontSize18,
              styles.marginBottom1percent,
            ]}>
            Overall Manouvre Rating
          </Text>

          <Text style={[styles.description, styles.fontSize14]}>
            Reverse Around Corner
          </Text>
          <RatingScale rating={Ratings.reverseAroundCorner} />

          <Text style={[styles.description, styles.fontSize14]}>
            Turnabout:
          </Text>

          <RatingScale rating={Ratings.turnAbout} />

          <Text style={[styles.description, styles.fontSize14]}>
            Hill Start:
          </Text>
          <RatingScale rating={Ratings.hillStart} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
    justifyContent: "space-between",
  },
  backButtonWrapper: {
    position: "absolute",
    top: 50,
    left: 20,
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
    alignItems: "center",
    marginTop: "10%",
  },
  title: {
    fontSize: 32,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
    marginBottom: 20,
  },
  routesCompleted: {
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  manouvreContainer: {
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "5%",
    paddingHorizontal: "5%",
    paddingBottom: "5%",
    borderRadius: 5,
  },
  fontSize18: {
    fontSize: 18,
  },
  fontSize14: {
    fontSize: 14,
  },
  marginBottom1percent: {
    marginBottom: "1%",
  },
  description: {
    fontFamily: fonts.Medium,
    color: colors.white,
    padding: "5%",
  },
});

export default ProgressScreen;
