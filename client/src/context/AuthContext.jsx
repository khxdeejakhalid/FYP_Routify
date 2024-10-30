import { createContext, useState, useEffect } from "react";
import { signIn, signUp, logout } from "../utils/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLogin, setIsLogin] = useState(false);

  const handleSignIn = async (email, password) => {
    const response = await signIn(email, password);
    if (response.success) {
      setUser(response.user);
      setIsLogin(true);
    }
    return response;
  };

  const handleSignUp = async (
    email,
    password,
    username,
    firstName,
    lastName,
    dateOfBirth,
  ) => {
    const response = await signUp(
      email,
      password,
      username,
      firstName,
      lastName,
      dateOfBirth,
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
