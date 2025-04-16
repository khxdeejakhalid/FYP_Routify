import React, { useEffect, useState, useContext } from "react";
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
import Button from "../../components/Button";
import CustomModal from "../../components/CustomModal";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../utils/colors";
import { fonts } from "../../utils/fonts";
import { AuthContext } from "../../context/AuthContext";
import { getQuizById } from "../../utils/api";
import {
  getImageSource,
  getRandomQuizNumber,
} from "../../utils/routifyUtilityService";

const { width, height } = Dimensions.get("window");

const QuizScreen = () => {
  const navigation = useNavigation();
  const { user } = useContext(AuthContext);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [userResponses, setUserResponses] = useState([]);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalHeader, setModalHeader] = useState("");
  const [modalText, setModalText] = useState("");
  const [modalBtnText, setmodalBtnText] = useState("Close");

  // * Handlers
  const handleGoBack = () => {
    navigation.goBack();
  };

  const handleOptionSelect = (index) => {
    setSelectedOption(index);
  };

  const handleNext = () => {
    const quiz = quizData.questions;
    const newResponses = [...userResponses];
    newResponses[currentQuestionIndex] = selectedOption;
    setUserResponses(newResponses);

    if (currentQuestionIndex < quiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      setQuizCompleted(true);
      handleQuizCompletion(newResponses);
    }
  };

  const handleQuizCompletion = (responses) => {
    const quiz = quizData.questions;
    const score = responses.reduce((total, selectedIndex, questionIndex) => {
      const options = quiz[questionIndex].options;
      const selectedOption = options[selectedIndex];
      return selectedOption && selectedOption.is_correct === 1
        ? total + 1
        : total;
    }, 0);

    setModalHeader("Quiz Completed");
    setModalText(`Quiz completed! Your score: ${score}/${quiz.length}`);
    setmodalBtnText("Okay");
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    navigation.navigate("Home");
  };

  // * API Calls
  useEffect(() => {
    async function fetchQuiz() {
      setIsLoading(true);
      try {
        const response = await getQuizById(getRandomQuizNumber());
        setQuizData(response.quiz);
      } catch (error) {
        setModalHeader("Failure");
        setModalText("System Cannot Process. Please try again.");
        setModalVisible(true);
        setmodalBtnText("Close");
      } finally {
        setIsLoading(false);
      }
    }

    fetchQuiz();
  }, []);

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

      {!isLoading && quizData && (
        <>
          <View style={styles.mainContainer}>
            {/* Question Number */}
            <Text style={styles.questionNumber}>
              Question {currentQuestionIndex + 1}/{quizData.questions.length}
            </Text>

            {/* Question */}
            <View style={styles.questionContainer}>
              <Text style={styles.questionText}>
                {quizData.questions[currentQuestionIndex].question_text ||
                  quizData.questions[currentQuestionIndex].question}
              </Text>
              {quizData.questions[currentQuestionIndex].image_path && (
                <View style={styles.quizImageContainer}>
                  <Image
                    source={getImageSource(
                      quizData.questions[currentQuestionIndex].image_path,
                    )}
                    style={styles.questionImage}
                    resizeMode="contain"
                  />
                </View>
              )}
            </View>
          </View>

          {/* Options Section */}
          <View style={styles.optionsContainer}>
            {quizData.questions[currentQuestionIndex].options.map(
              (option, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.optionButton,
                    selectedOption === index && styles.selectedOptionButton,
                  ]}
                  onPress={() => handleOptionSelect(index)}>
                  <View style={styles.radioContainer}>
                    <View
                      style={[
                        styles.radioOuter,
                        selectedOption === index && styles.selectedRadioOuter,
                      ]}>
                      {selectedOption === index && (
                        <View style={styles.radioInner} />
                      )}
                    </View>
                  </View>
                  <Text
                    style={[
                      styles.optionText,
                      selectedOption === index && styles.selectedOptionText,
                    ]}>
                    {option.option_text}
                  </Text>
                </TouchableOpacity>
              ),
            )}
          </View>

          <Button
            disabled={selectedOption === null}
            buttonType="BottomButton"
            clickHandler={handleNext}>
            {currentQuestionIndex < quizData.questions.length - 1
              ? "Next"
              : "Submit"}
          </Button>
        </>
      )}
      <CustomModal
        visible={modalVisible}
        title={modalHeader}
        message={modalText}
        singleButton={true}
        buttonOneText={modalBtnText}
        onButtonOnePress={handleModalClose}
      />
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
  fallbackBanner: {
    position: "absolute",
    top: 50,
    right: 20,
    backgroundColor: colors.primary + "40",
    padding: 8,
    borderRadius: 4,
    zIndex: 10,
  },
  fallbackText: {
    fontFamily: fonts.Medium,
    fontSize: 12,
    color: colors.primary,
  },
  mainContainer: {
    paddingLeft: 20,
    marginTop: height * 0.12,
  },
  questionNumber: {
    fontSize: 14,
    fontFamily: fonts.Medium,
    color: colors.primary,
  },
  questionContainer: {
    marginTop: 10,
  },
  questionText: {
    fontSize: 16,
    fontFamily: fonts.SemiBold,
    marginTop: 8,
  },
  quizImageContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
    height: height * 0.3,
  },
  questionImage: {
    width: width * 0.7,
    height: "100%",
  },
  optionsContainer: {
    flex: 1,
    marginTop: 20,
  },
  optionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
    backgroundColor: "#F7F7F7",
  },
  selectedOptionButton: {
    backgroundColor: colors.primary,
  },
  radioContainer: {
    marginRight: 10,
  },
  radioOuter: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: colors.lightgrey,
    alignItems: "center",
    justifyContent: "center",
  },
  selectedRadioOuter: {
    borderColor: colors.white,
  },
  radioInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: colors.white,
  },
  optionText: {
    fontSize: 14,
    fontFamily: fonts.Regular,
    color: colors.secondary,
  },
  selectedOptionText: {
    color: colors.white,
    fontFamily: fonts.Medium,
  },
  loadingText: {
    textAlign: "center",
    marginTop: height * 0.4,
    fontSize: 16,
    fontFamily: fonts.Medium,
  },
});

export default QuizScreen;
