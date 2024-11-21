import { onAuthStateChanged } from "firebase/auth";
import React, { useEffect, useState } from "react";
import { firebaseConfig } from "./../src/services/firebase/firebaseConfig";

export default function useAuth() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseConfig.auth, (user) => {
      console.log(user);
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
    return unsubscribe;
  }, []);

  return { user };
}
