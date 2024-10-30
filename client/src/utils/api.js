import axios from "axios";

export const signIn = async (email, password) => {
  try {
    const requestBody = {
      email,
      password,
    };

    const response = await axios.post(
      `http://192.168.100.237:8080/api/auth/login`,
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (response.data.status === "success") {
      return { success: true, user: { email } };
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
  firstName,
  lastName,
  dateOfBirth,
) => {
  const requestBody = {
    email,
    password,
    username,
    firstName,
    lastName,
    dateOfBirth: dateOfBirth.toISOString().split("T")[0],
  };
  try {
    const response = await axios.post(
      "http://192.168.100.237:8080/api/users",
      requestBody,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (response.data.status === "success") {
      return { success: true, user: { email } };
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
      `http://192.168.100.237:8080/api/auth/logout`,
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
