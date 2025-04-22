import React from "react";
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

const CustomModal = ({
  visible,
  title,
  message = "",
  singleButton = false,
  buttonOneText,
  buttonTwoText,
  onButtonOnePress,
  onButtonTwoPress,
  onClose,
  loading = false,
  children,
}) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.title}>{title}</Text>
          {message && <Text style={styles.message}>{message}</Text>}

          {children}

          {/* Buttons */}
          <View style={styles.buttonContainer}>
            {singleButton ? (
              <TouchableOpacity
                style={styles.button}
                onPress={onButtonOnePress}>
                <Text style={styles.buttonText}>{buttonOneText}</Text>
              </TouchableOpacity>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.button}
                  onPress={onButtonOnePress}>
                  <Text style={styles.buttonText}>{buttonOneText}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  loading={loading}
                  style={styles.button}
                  onPress={onButtonTwoPress}>
                  <Text style={styles.buttonText}>{buttonTwoText}</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default CustomModal;

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
    fontFamily: fonts.Regular,
    textAlign: "center",
    marginBottom: 20,
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
