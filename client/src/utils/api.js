import axios from "axios";

const BACKEND_URL = `http://172.20.10.13:8080/api`;

export const signIn = async (email, password) => {
  try {
    const requestBody = {
      email,
      password,
    };

    const response = await axios.post(
      `${BACKEND_URL}/auth/login`,
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (response.data.status === "success") {
      return { success: true, user: response.data.user };
    } else if (response.data.status === "failure") {
      return {
        success: false,
        description: response.data.description,
      };
    }
  } catch (error) {
    return {
      success: false,
      description: "System Cannot Process. Please try again.",
    };
  }
};

export const signUp = async (
  email,
  password,
  username,
  fullName,
  dateOfPermit,
  dateOfBirth,
  role,
) => {
  const requestBody = {
    email,
    password,
    username,
    fullName,
    dateOfPermit: dateOfPermit.toISOString().split("T")[0],
    dateOfBirth: dateOfBirth.toISOString().split("T")[0],
    role,
  };
  try {
    const response = await axios.post(`${BACKEND_URL}/users`, requestBody, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.data.status === "success") {
      return { success: true, user: response.data.user };
    } else if (response.data.status === "failure") {
      return {
        success: false,
        description: response.data.description,
      };
    }
  } catch (error) {
    return {
      success: false,
      description: "System Cannot Process. Please try again.",
    };
  }
};

export const logout = async () => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/auth/logout`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (response.data.status === "success") {
      return { success: true };
    }
  } catch (error) {
    return {
      success: false,
      description: "System Cannot Process. Please try again.",
    };
  }
};

export const getTestCenters = async () => {
  try {
    const response = await axios.get(`${BACKEND_URL}/centers`);

    if (response.data.status === "success") {
      return { success: true, centers: response.data.centers };
    }
  } catch (error) {
    return {
      success: false,
      description: "System Cannot Process. Please try again.",
    };
  }
};

export const getUserInformation = async (email) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/users/${email}`);
    if (response.data.status === "success") {
      return { success: true, user: response.data.user };
    } else {
      return { success: false, user: response.data.description };
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      description: "System Cannot Process. Please try again.",
    };
  }
};

export const updateUserInformation = async (email, userInfo) => {
  try {
    const response = await axios.put(
      `${BACKEND_URL}/users/${email}`,
      userInfo,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (response.data.status === "success") {
      return { success: true, user: response.data.user };
    } else {
      return { success: false, user: response.data.description };
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      description: "System Cannot Process. Please try again.",
    };
  }
};

export const getDataFromRoadsAPI = async (coordinates) => {
  const apiKey = "API_KEY";
  const path = coordinates
    .map((coord) => `${coord.latitude},${coord.longitude}`)
    .join("|");
  const url = `https://roads.googleapis.com/v1/snapToRoads?path=${path}&interpolate=true&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    if (response.data.snappedPoints) {
      return response.data.snappedPoints.map((point) => ({
        latitude: point.location.latitude,
        longitude: point.location.longitude,
      }));
    }
  } catch (error) {
    console.error("Error snapping route to roads:", error);
    return [];
  }
};

export const checkEmail = async (email) => {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/users/exists?email=${email}`,
    );
    if (response.data.status === "success") {
      return { success: true, exists: response.data.exists };
    }
  } catch (error) {
    console.error(error);
    return {
      success: false,
      description: "System Cannot Process. Please try again.",
    };
  }
};

export const getDataFromDirectionsAPI = async (
  origin,
  destination,
  waypoints,
) => {
  const apiKey = "API_KEY";
  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${encodeURIComponent(
    origin,
  )}&destination=${encodeURIComponent(
    destination,
  )}&waypoints=optimize:false|${encodeURIComponent(waypoints)}&key=${apiKey}`;

  try {
    const response = await axios.get(url);
    const legs = response.data.routes[0].legs;

    const filteredResponse = legs.map((leg) => {
      const [step] = leg.steps;
      return {
        instruction: step.html_instructions.replace(/<[^>]+>/g, ""),
        distance: step.distance.text,
        duration: step.duration.text,
        currentLatitude: step.start_location.lat,
        currentLongitude: step.start_location.lng,
        nextLatitude: step.end_location.lat,
        nextLongitude: step.end_location.lng,
      };
    });

    return filteredResponse;
  } catch (error) {
    console.error("Error fetching directions:", error);
  }
};

export const getWaypoints = async (routeId) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/waypoints/${routeId}`);

    if (response.data.status === "success") {
      return { success: true, waypoints: response.data.waypoints };
    }
  } catch (error) {
    return {
      success: false,
      description: "System Cannot Process. Please try again.",
    };
  }
};

export const getTurnsByRoute = async (routeId) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/turns/${routeId}`);

    if (response.data.status === "success") {
      return { success: true, turns: response.data.turns };
    }
  } catch (error) {
    return {
      success: false,
      description: "System Cannot Process. Please try again.",
    };
  }
};

export const getManeuversByRoute = async (routeId) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/maneuver/${routeId}`);

    if (response.data.status === "success") {
      return { success: true, maneuvers: response.data.maneuvers };
    }
  } catch (error) {
    return {
      success: false,
      description: "System Cannot Process. Please try again.",
    };
  }
};

// Feedback related APIs
export const getManeuverFeedback = async (userEmail) => {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/feedback?userEmail=${userEmail}`,
    );
    if (response.data.status === "success") {
      return { success: true, feedback: response.data.feedback };
    }
    return response.data;
  } catch (error) {
    return {
      success: false,
      description: "System Cannot Process. Please try again.",
    };
  }
};

export const saveManueverFeedbackScore = async (reqParams) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/feedback`,
      { reqParams },
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    if (response.data.status === "success") {
      return { success: true };
    }
    return response.data;
  } catch (error) {
    return {
      success: false,
      description: "System Cannot Process. Please try again.",
    };
  }
};

export const fetchLessons = async ({ learnerEmail, instructorEmail }) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/lessons/learner_lessons`, {
      params: {
        instructorEmail,
        learnerEmail,
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.data.status === "success") {
      const mappedData = response.data.lessons.map((lesson) => {
        return {
          ...lesson,
          checked: lesson.status === "completed" ? true : false,
          disabled: lesson.status !== "completed" ? true : false,
        };
      });
      return {
        success: true,
        lessons: mappedData,
      };
    } else if (response.data.status === "failure") {
      return {
        success: false,
        description: response.data.description,
      };
    }
  } catch (err) {
    return {
      success: false,
      description: err.message,
    };
  }
};

export const updateLessonFeedback = async (lessonId, feedback) => {
  try {
    const reqBody = {
      lessonId,
      feedback,
    };
    const response = await axios.post(
      `${BACKEND_URL}/lessons_feedback/updateFeedback`,
      reqBody,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (response.data.status === "success") {
      return {
        success: true,
      };
    } else if (response.data.status === "failure") {
      return {
        success: false,
        description: response.data.description,
      };
    }
  } catch (err) {
    return {
      success: false,
      description: err.message,
    };
  }
};

export const addLessonFeedback = async (lessonFeedback) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/lessons_feedback`,
      lessonFeedback,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (response.data.status === "success") {
      return {
        success: true,
      };
    } else if (response.data.status === "failure") {
      return {
        success: false,
        description: response.data.description,
      };
    }
  } catch (err) {
    return {
      success: false,
      description: err.message,
    };
  }
};

export const fetchProfile = async (email) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/users/profile/${email}`);
    if (response.data.status === "success") {
      return { success: true, profile: response.data.profile };
    } else {
      return { success: false, profile: response.data.description };
    }
  } catch (error) {
    return {
      success: false,
      description: "System Cannot Process. Please try again.",
    };
  }
};

export const getQuizById = async (quizId) => {
  try {
    const response = await axios.get(`${BACKEND_URL}/quiz/${quizId}`);
    if (response.data.status === "success") {
      return { success: true, quiz: response.data.quiz };
    }
  } catch (error) {
    return {
      success: false,
      description: "System Cannot Process. Please try again.",
    };
  }
};
