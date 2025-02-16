export const routifyConstantsService = (function () {

  const MANEUVERS_PROXIMITY_THRESHOLD = 10;

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
    STARTING_POINT: "Hill Top Manoeuvre Started",
    ENDING_POINT: "Hill Top Manoeuvre Completed",
  };

  const MANEUVERS_TYPE = {
    HILLTOP: "Hill Start",
    REVERSE_PARKING: "Reverse Around the Corner",
    TURN_ABOUT: "Turnabout",
  };

  const MANEUVERS = {
    [MANEUVERS_TYPE.HILLTOP]: {
      startPos: {
        lat: 53.2992462,
        lng: -6.3492096,
      },
      endPos: {
        lat: 53.2992462,
        lng: -6.3492096,
      },
    },
    [MANEUVERS_TYPE.REVERSE_PARKING]: {
      startPos: {
        lat: 53.2956114562911,
        lng: -6.343770754479805,
      },
      kerbs: [
        {
          lat: 53.29551,
          lng: -6.3436,
        },
        {
          lat: 53.29551,
          lng: -6.34361,
        },
        {
          lat: 53.29551,
          lng: -6.34361,
        },
        {
          lat: 53.29551,
          lng: -6.34361,
        },
        {
          lat: 53.2955,
          lng: -6.34362,
        },
        {
          lat: 53.29551,
          lng: -6.34362,
        },
        {
          lat: 53.29551,
          lng: -6.34363,
        },
        {
          lat: 53.29551,
          lng: -6.34363,
        },
      ],
      endPos: {
        lat: 53.29551,
        lng: -6.34363,
      },
    },
    [MANEUVERS_TYPE.TURN_ABOUT]: {
      startPos: {
        lat: 53.296234,
        lng: -6.341734,
      },
      // @TODO: Needs to be figured out
      endPos: {
        lat: 53.0,
        lng: -6.0,
      },
    },
  };
  return {
    GOSHO_REMINDERS,
    REVERSE_AROUND_CORNER_REMINDERS,
    MSM_REMINDERS,
    MANEUVERS_TYPE,
    MANEUVERS,
    MANEUVERS_PROXIMITY_THRESHOLD,
    HILL_TOP_REMINDERS
  };
})();
