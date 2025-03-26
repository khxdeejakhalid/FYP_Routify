import { Dimensions } from "react-native";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import ScreenWithList from "../../components/SectionWithList";

const TutorialsScreen = () => {
  const navigation = useNavigation();
  const tutorialsNavItems = [
    {
      id: 1,
      title: "Reverse Around Corner",
      link: "https://youtu.be/mH9OAv8KiOY?si=pNqDm5w3bSPmkJaB",
      route: "Tutorials",
    },
    {
      id: 2,
      title: "Turnabout",
      link: "https://youtu.be/i6-6k2y7DEA?si=OTmsPZTa78UvqysP",
      route: "Progress",
    },
    {
      id: 3,
      title: "Hill Start",
      link: "https://youtu.be/DiwKsVUmL_M?si=xV75fXxgrPUeuhvT ",
      route: "Help",
    },
    {
      id: 4,
      title: "Roundabouts",
      link: "https://youtu.be/VEd7uAVsHt0?si=gOJsThuprtPLQ_Pl",
    },
    {
      id: 5,
      title: "Turning Right",
      link: "https://youtu.be/nILHzsDznR4?si=vXcGW5rXdFMJxErj",
    },
    {
      id: 6,
      title: "Turning Left",
      link: "https://youtu.be/ZZd72Ox7jP0?si=W_85_D7s9UnQ9KDR",
    },
  ];

  // * Functions
  const handleGoBack = () => {
    navigation.goBack();
  };
  return (
    <ScreenWithList
      title={"Tutorials"}
      onGoBack={handleGoBack}
      navItems={tutorialsNavItems}
    />
  );
};

export default TutorialsScreen;
