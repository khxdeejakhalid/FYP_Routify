import React from "react";
import { useNavigation } from "@react-navigation/native";
import ScreenWithList from "../../components/SectionWithList";

const sessionNavItems = [
  {
    id: 1,
    title: "View All Sessions",
    route: "BookedSessions",
  },
  {
    id: 2,
    title: "Book a Session",
    route: "Calendar",
  },
];

const SessionsInfo = () => {
  const navigation = useNavigation();

  // * Functions
  const onGoBack = () => {
    navigation.goBack();
  };

  return (
    <ScreenWithList
      title={"SESSIONS INFO"}
      onGoBack={onGoBack}
      navItems={sessionNavItems}
    />
  );
};
export default SessionsInfo;
