import React, { useState, useContext } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  FlatList,
  View,
} from "react-native";
import { colors } from "../../utils/colors";
import { fonts } from "../../utils/fonts";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "react-native-vector-icons/Ionicons";
import RouteCard from "../../components/RouteCard";
import Button from "../../components/Button";
import { AuthContext } from "../../context/AuthContext";

const { width, height } = Dimensions.get("window");

const LearnersSelections = () => {
  const navigation = useNavigation();
  const [selectedLearner, setSelectedLearner] = useState(null);
  const { user } = useContext(AuthContext);

  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleNext = () => {
    if (selectedLearner) {
      navigation.navigate("Calendar", { learnerEmail: selectedLearner });
    }
  };

  const renderItem = ({ item }) => {
    const backgroundColor =
      item.email === selectedLearner ? colors.secondary : colors.primary;

    return (
      <RouteCard
        label={item.name}
        clickHandler={() => {
          setSelectedLearner(item.email);
        }}
        bgColor={backgroundColor}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButtonWrapper} onPress={handleGoBack}>
        <Ionicons
          size={25}
          color={colors.primary}
          name={"arrow-back-outline"}
        />
      </TouchableOpacity>

      <Image
        source={require("../../assets/logo.png")}
        style={styles.logo}
        alt="Logo"
      />

      <View style={styles.contentWrapper}>
        <Text style={styles.title}>Select Learner</Text>
        <FlatList
          style={styles.list}
          renderItem={renderItem}
          data={user.assignedLearners}
          keyExtractor={(item) => item.email}
          showsVerticalScrollIndicator={false}
        />
      </View>

      <Button
        clickHandler={handleNext}
        buttonType="BottomButton"
        disabled={!selectedLearner}>
        Next
      </Button>
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
    marginTop: height * 0.15,
    alignSelf: "center",
  },
  contentWrapper: {
    flex: 1,
    alignItems: "center",
    marginTop: "10%",
  },
  title: {
    fontSize: 20,
    fontFamily: fonts.SemiBold,
    color: colors.primary,
    marginBottom: 20,
  },
  list: {
    height: 50,
    width: "70%",
    color: colors.primary,
    marginBottom: 20,
  },
});

export default LearnersSelections;
