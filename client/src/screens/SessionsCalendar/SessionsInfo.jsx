import React, { useContext, useState } from "react";
import { useNavigation } from "@react-navigation/native";
import ScreenWithList from "../../components/SectionWithList";
import { AuthContext } from "../../context/AuthContext";

const SessionsInfo = () => {
  const { user } = useContext(AuthContext);
  const navigation = useNavigation();
  const [navItems, setNavItems] = React.useState([
    {
      id: "all_sessions",
      title: "View All Sessions",
      route: "BookedSessions",
    },
    {
      id: "book_session",
      title: "Book a Session",
      route: user.role === "instructor" ? "LearnersSelections" : "Calendar",
    },
    {
      id: "session_requests",
      title: "Session Requests",
      route: "SessionRequests",
    },
  ]);
  // * Functions
  const onGoBack = () => {
    navigation.goBack();
  };

  return (
    <ScreenWithList
      title={"SESSIONS INFO"}
      onGoBack={onGoBack}
      navItems={navItems}
    />
  );
};
export default SessionsInfo;
