import { Image, StyleSheet, View } from "react-native";

const RatingScale = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= Math.floor(rating)) {
      stars.push(
        <Image
          key={i}
          source={require("../assets/icons/rating/star-filled.png")}
          style={styles.star}
        />,
      );
    } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
      stars.push(
        <Image
          key={i}
          source={require("../assets/icons/rating/star-partial-filled.png")}
          style={styles.star}
        />,
      );
    } else {
      stars.push(
        <Image
          key={i}
          source={require("../assets/icons/rating/star-empty.png")}
          style={styles.star}
        />,
      );
    }
  }

  return <View style={styles.starsContainer}>{stars}</View>;
};

const styles = StyleSheet.create({
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  star: {
    width: 25,
    height: 25,
    marginRight: 2,
  },
});

export default RatingScale;
