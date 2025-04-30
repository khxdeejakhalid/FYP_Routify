export const routifyConstantsService = (function () {
  const MANEUVERS_PROXIMITY_THRESHOLD = 10;
  const MSM_PROXIMITY_THRESHOLD = 30;

  const MSM_REMINDERS = ["Check Mirrors", "Signal", "Manoeuvre/move"];

  const GOSHO_REMINDERS = [
    "Select gear",
    "Observe surroundings",
    "Signal",
    "Handbrake down",
    "Observation (over the shoulder)",
  ];

  const REVERSE_AROUND_CORNER_REMINDERS = {
    STARTING_POINT: "Reverse Around Corner Manoeuvre Started",
    ENDING_POINT: "Reverse Around Corner Manoeuvre Completed",
    KERB_TOO_CLOSE: "Too Close To The Kerb, Steer Away",
    KERB_TOO_FAR: "Too Far From The Kerb, Steer Closer To The Kerb",
  };

  const HILL_TOP_REMINDERS = {
    STARTING_POINT: "Hill Start Manoeuvre Started",
    ENDING_POINT: "Hill Start Manoeuvre Completed",
  };

  const TURN_ABOUT_REMINDERS = {
    STARTING_POINT: "Turn About Manoeuvre Started",
    ENDING_POINT: "Turn About Manoeuvre Completed",
  };
  // @TODO: MIGHT NEED TO CHANGE THIS CONSTANT NAME
  const MANEUVERS_TYPE = {
    REVERSE_PARKING: {
      ID: "REVERSE_AROUND_CORNER",
      DISPLAY_NAME: "Reverse Around Corner",
    },
    TURN_ABOUT: {
      ID: "TURN_ABOUT",
      DISPLAY_NAME: "Turnabout",
    },
    HILLTOP: {
      ID: "HILL_TOP",
      DISPLAY_NAME: "Hill Start",
    },
  };

  return {
    GOSHO_REMINDERS,
    REVERSE_AROUND_CORNER_REMINDERS,
    MSM_REMINDERS,
    MANEUVERS_TYPE,
    MANEUVERS_PROXIMITY_THRESHOLD,
    MSM_PROXIMITY_THRESHOLD,
    HILL_TOP_REMINDERS,
    TURN_ABOUT_REMINDERS,
  };
})();
