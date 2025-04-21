import React, { useEffect, useState, useContext } from "react";
import { useNavigation } from "@react-navigation/native";
import {
  fetchLessons,
  updateLessonFeedback,
  addLessonFeedback,
} from "../../utils/api";
import { AuthContext } from "../../context/AuthContext";
import {
  Image,
  StyleSheet,
  Text,
  View,
  Keyboard,
  FlatList,
  TextInput,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  TouchableWithoutFeedback,
} from "react-native";
import { colors } from "../../utils/colors";
import { fonts } from "../../utils/fonts";
import Ionicons from "react-native-vector-icons/Ionicons";
import CustomModal from "../../components/CustomModal";

const { width, height } = Dimensions.get("window");

const LessonsFeedback = ({ route }) => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);

  // * States
  const [lessons, setLessons] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusedLesson, setFocusedLesson] = useState({});

  // * APIs
  const getLessons = async () => {
    setLoading(true);
    const payload = {
      learnerEmail:
        user.role === "instructor"
          ? route.params.learner.learnerEmail
          : user.email,
      instructorEmail:
        user.role === "instructor"
          ? user.email
          : user.assignedInstructors.instructorEmail,
    };
    const response = await fetchLessons(payload);
    setLessons(response.lessons);
    setLoading(false);
  };

  const onSubmitFeedback = async () => {
    if (focusedLesson.feedback === "") {
      alert("Please provide feedback before submitting.");
      return;
    }

    setLoading(true);

    // Check if the lesson is already completed, then update the existing feedback.
    if (focusedLesson.status === "completed") {
      const response = await updateLessonFeedback(
        focusedLesson.lessonId,
        focusedLesson.feedback,
      );
      if (response.success) {
        setModalVisible(false);
        getLessons();
      }
    } else {
      focusedLesson.status = "completed";
      focusedLesson.instructorEmail = user.email;
      focusedLesson.learnerEmail = route.params.learner.learnerEmail;

      // If the lesson is not completed, add the feedback.
      const response = await addLessonFeedback(focusedLesson);
      if (response.success) {
        setModalVisible(false);
        getLessons();
      }
    }
    setLoading(false);
  };

  // * Functions
  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleModalClose = () => {
    setModalVisible(false);
  };

  const onOpenFeedbackModal = (lesson) => {
    setModalVisible(true);
    setFocusedLesson(lesson);
  };

  const onChangeFeedback = (updatedFeedback) => {
    setFocusedLesson({
      ...focusedLesson,
      feedback: updatedFeedback,
    });
  };

  const feedbackComponent = () => {
    return (
      <TextInput
        multiline={true}
        numberOfLines={10}
        placeholder="Type here..."
        value={focusedLesson.feedback}
        onChangeText={onChangeFeedback}
        style={styles.textInputContainer}
        editable={user.role === "instructor"}
        selectTextOnFocus={user.role === "instructor"}></TextInput>
    );
  };

  useEffect(() => {
    getLessons();
  }, []);

  const renderLesson = ({ item }) => (
    <View style={[styles.itemContainer, item?.disabled && styles.disabledItem]}>
      <TouchableOpacity style={styles.checkbox} disabled={item?.disabled}>
        <Ionicons
          size={24}
          color={item?.disabled ? colors.gray : colors.primary}
          name={item?.checked ? "checkbox" : "square-outline"}
        />
      </TouchableOpacity>

      <Text style={[styles.itemText, item?.disabled && styles.disabledText]}>
        {item.lesson_name}
      </Text>

      <TouchableOpacity
        style={styles.feedbackButton}
        onPress={() => onOpenFeedbackModal(item)}>
        <Text style={styles.feedbackButtonText}>
          {user.role === "instructor" ? "Feedback" : "View Feedback"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return loading ? (
    <View style={styles.loader}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  ) : (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity
          onPress={handleGoBack}
          style={styles.backButtonWrapper}>
          <Ionicons
            size={25}
            color={colors.primary}
            name={"arrow-back-outline"}
          />
        </TouchableOpacity>

        {/* Logo */}
        <Image
          alt="Logo"
          style={styles.logo}
          source={require("../../assets/logo.png")}
        />

        <View style={styles.contentWrapper}>
          <Text style={styles.title}>Lesson Feedback</Text>
          <View>
            <FlatList
              data={lessons}
              renderItem={renderLesson}
              keyExtractor={(item) => item.lessonId.toString()}
            />
          </View>
        </View>
        <CustomModal
          loading={loading}
          buttonOneText="Close"
          buttonTwoText="Submit"
          title={"Give Feedback"}
          visible={isModalVisible}
          children={feedbackComponent()}
          onButtonOnePress={handleModalClose}
          onButtonTwoPress={onSubmitFeedback}
          singleButton={user.role === "learner"}
        />
      </View>
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    padding: 20,
  },
  list: {
    paddingVertical: 8,
  },
  card: {
    backgroundColor: colors.primary,
    padding: 20,
    marginVertical: 10,
    borderRadius: 12,
    shadowColor: colors.black,
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    borderWidth: 1,
    borderColor: colors.white,
  },
  cardText: {
    fontSize: 18,
    fontFamily: fonts.Medium,
    color: colors.white,
  },
  textInputContainer: {
    marginVertical: 30,
    width: "100%",
    height: 100,
    borderRadius: 5,
    padding: 10,
    backgroundColor: colors.lightgrey,
  },
  backButtonWrapper: {
    position: "absolute",
    top: 50,
    left: 10,
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
    marginTop: "10%",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    textTransform: "uppercase",
    fontFamily: fonts.SemiBold,
    color: colors.primary,
    marginBottom: 20,
    textAlign: "center",
  },
  itemContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    marginVertical: 5,
    backgroundColor: colors.white,
    borderRadius: 10,
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  disabledItem: {
    backgroundColor: "#ECECEC",
  },
  checkbox: {
    marginRight: 10,
  },
  itemText: {
    fontSize: 16,
    flex: 1,
  },
  disabledText: {
    color: colors.gray,
  },
  feedbackButton: {
    paddingVertical: 5,
    paddingHorizontal: 15,
    backgroundColor: colors.primary,
    borderRadius: 5,
  },
  feedbackButtonText: {
    color: colors.white,
    fontSize: 14,
  },
});

export default LessonsFeedback;
