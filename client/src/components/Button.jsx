import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import { colors } from "../utils/colors";
import { fonts } from "../utils/fonts";

const Button = ({
  buttonType,
  clickHandler,
  disabled,
  children,
  imageSource,
}) => {
  return (
    <>
      {buttonType === "BottomButton" && (
        <TouchableOpacity
          style={[
            styles.bottomButton,
            disabled ? styles.buttonDisabled : styles.buttonEnabled,
          ]}
          onPress={clickHandler}
          disabled={disabled}>
          <Text style={styles.bottomButtonText}>{children}</Text>
        </TouchableOpacity>
      )}
      {buttonType === "AuthButton" && (
        <TouchableOpacity
          style={styles.authButton}
          onPress={clickHandler}
          disabled={disabled}>
          {imageSource && (
            <Image source={imageSource} style={styles.authButtonImage} />
          )}
          <Text style={styles.authButtonText}>{children}</Text>
        </TouchableOpacity>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  bottomButton: {
    padding: Platform.OS === "android" ? "3%" : "4%",
    borderRadius: 10,
    alignItems: "center",
    marginBottom: Platform.OS === "android" ? 0 : 10,
    width: "90%",
    alignSelf: "center",
  },
  bottomButtonText: {
    color: colors.white,
    fontSize: 16,
    fontFamily: fonts.Medium,
  },
  buttonEnabled: {
    backgroundColor: colors.primary,
  },
  buttonDisabled: {
    backgroundColor: colors.disabled,
  },
  authButton: {
    flexDirection: "row",
    backgroundColor: colors.primary,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    padding: Platform.OS === "android" ? "3%" : "4%",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  authButtonText: {
    color: colors.white,
    fontSize: 14,
    fontFamily: fonts.Regular,
    textAlign: "center",
  },
  authButtonImage: {
    height: 25,
    width: 25,
  },
});

export default Button;
