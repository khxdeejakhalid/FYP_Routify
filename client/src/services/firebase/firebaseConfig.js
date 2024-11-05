import {
  getAuth,
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";
import { initializeApp } from "firebase/app";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const firebaseConfig = (function () {
  // @TODO: move to env 
  const firebaseConfig = {
    apiKey: "AIzaSyBctCd8FvC8n25oB6R5Dr6GTk1mAZwC4Zo",
    authDomain: "routify-19d15.firebaseapp.com",
    projectId: "routify-19d15",
    storageBucket: "routify-19d15.appspot.com",
    messagingSenderId: "900992434227",
    appId: "1:900992434227:web:16455c0acf8d11dc9d2346"
  };
  
  const app = initializeApp(firebaseConfig);
  const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
  // Initialize Firebase
  return {
    firebaseConfig,
    auth,
    app,
  };
})();
