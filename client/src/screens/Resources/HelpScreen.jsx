import React from "react";
import { useNavigation } from "@react-navigation/native";
import ScreenWithList from "../../components/SectionWithList";

const HelpScreen = () => {
  const navigation = useNavigation();
  const resourceNavItems = [
    {
      id: 1,
      title: "Tutorials",
      // @TODO: Revert to Tutorials route
      route: "Calendar",
    },
    {
      id: 2,
      title: "Links",
      route: "Links",
    },
    {
      id: 3,
      title: "Q&A",
      route: "QuizScreen",
    },
    {
      id: 4,
      title: "Checklists",
      route: "PreTestChecklist",
    },
  ];

  // * Functions
  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <ScreenWithList
      navItems={resourceNavItems}
      onGoBack={handleGoBack}
      title={"Resources"}
    />
  );
};
export default HelpScreen;
