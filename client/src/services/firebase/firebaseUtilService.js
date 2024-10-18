import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
} from "firebase/auth";
import { firebaseConfig } from "./firebaseConfig";

export const firebaseUtilService = (function () {
  function signupUser({ email, password }) {
    // Implement email and password authentication

    return createUserWithEmailAndPassword(firebaseConfig.auth, email, password);
  }

  function signInUser({ email, password }) {
    return signInWithEmailAndPassword(firebaseConfig.auth, email, password);
  }
  return {
    signupUser,
    signInUser,
  };
})();
