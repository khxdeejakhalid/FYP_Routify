import React from "react";
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import RatingScale from "../components/RatingScale";

const FeedbackModal = ({ visible, closeHandler, maneuverType, rating }) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={closeHandler}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>FEEDBACK</Text>
          <Text style={styles.message}>YOUR {maneuverType} WAS: </Text>
          <RatingScale rating={rating} />
          {rating <= 3 && (
            <Text style={styles.message}>PRACTICE MAKES PERFECT!</Text>
          )}
          {rating > 3 && (
            <Text style={styles.message}>GOOD JOB!</Text>
          )}
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={closeHandler}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default FeedbackModal;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.backdrop,
  },
  modalContent: {
    width: "80%",
    backgroundColor: colors.white,
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontFamily: fonts.SemiBold,
    marginBottom: 10,
  },
  message: {
    fontSize: 14,
    fontFamily: fonts.Medium,
    textAlign: "center",
    marginVertical: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    flex: 1,
    padding: 10,
    fontFamily: fonts.Regular,
    backgroundColor: colors.primary,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  buttonText: {
    color: colors.white,
    fontFamily: fonts.Regular,
    textAlign: "center",
  },
});
