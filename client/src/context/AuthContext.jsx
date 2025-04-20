import { createContext, useState, useEffect } from "react";
import { signIn, signUp, logout, fetchProfile } from "../utils/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(false);

  const handleSignIn = async (email, password) => {
    try {
      const response = await signIn(email, password);

      if (!response.success) return response;

      setUser(response.user);
      setIsLogin(true);

      const { success, profile } = await fetchProfile(email);

      if (success) {
        setUser((prev) => ({
          ...prev,
          ...profile,
        }));
      } else {
        alert("Error fetching user profile");
      }

      return response;
    } catch (error) {
      console.error("Sign-in failed:", error);
      return {
        success: false,
        message: "An unexpected error occurred during sign-in.",
      };
    }
  };

  const handleSignUp = async (
    email,
    password,
    username,
    firstName,
    lastName,
    dateOfBirth,
    role,
  ) => {
    const response = await signUp(
      email,
      password,
      username,
      firstName,
      lastName,
      dateOfBirth,
      role,
    );
    if (response.success) {
      setUser(response.user);
      setIsLogin(true);
    }
    return response;
  };

  const handleSignOut = async () => {
    const response = await logout();
    if (response.success) {
      setUser(null);
      setIsLogin(false);
    }
    return response;
  };

  return (
    <AuthContext.Provider
      value={{ user, isLogin, handleSignOut, handleSignIn, handleSignUp }}>
      {children}
    </AuthContext.Provider>
  );
};
