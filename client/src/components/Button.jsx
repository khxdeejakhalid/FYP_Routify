import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";

const Button = ({ buttonType, clickHandler, disabled, children }) => {
  return (
    <>
      {buttonType === "BottomButton" && (
        <TouchableOpacity
          style={styles.bottomButton}
          onPress={clickHandler}
          disabled={disabled}>
          <Text style={styles.bottomButtonText}>{children}</Text>
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  bottomButton: {
    backgroundColor: colors.primary,
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
    width: "90%",
    alignSelf: "center",
  },
  bottomButtonText: {
    color: colors.white,
    fontSize: 18,
    fontFamily: fonts.SemiBold,
  },
});

export default Button;
