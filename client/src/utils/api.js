import axios from "axios";

const BACKEND_URL = `http://192.168.0.94:8080/api`;

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
      return { success: true, user: { email } };
    } else if (response.data.status === "failure") {
      return {
        success: false,
        description: response.data.description,
      };
    }
  } catch (error) {
    console.log(error);
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
) => {
  const requestBody = {
    email,
    password,
    username,
    fullName,
    dateOfPermit: dateOfPermit.toISOString().split("T")[0],
    dateOfBirth: dateOfBirth.toISOString().split("T")[0],
  };
  try {
    const response = await axios.post(`${BACKEND_URL}/users`, requestBody, {
      headers: {
        "Content-Type": "application/json",
      },
    });

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
