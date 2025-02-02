export const routifyConstantsService = (function () {
  const GOSHO_REMINDERS = [
    "Select gear",
    "Observe surroundings",
    "Signal",
    "Handbrake down",
    "Observation (over the shoulder)",
  ];

  const MSM_REMINDERS = ["Check Mirrors", "Signal", "Manoeuvre"];

  const MANEUVERS_MAP = {
    HILLTOP: "Hill Start",
    REVERSE_PARKING: "Reverse Around the Corner",
    TURN_ABOUT: "Turnabout",
  };

  const MANEUVERS = {
    [MANEUVERS_MAP.HILLTOP]: {
      startPos: {
        lat: 53.2992462,
        lng: -6.3492096,
      },
      endPos: {
        lat: 53.2992462,
        lng: -6.3492096,
      },
    },
    [MANEUVERS_MAP.REVERSE_PARKING]: {
      startPos: {
        lat: 53.295606,
        lng: -6.343768,
      },
      // @TODO: Needs to be figured out
      endPos: {
        lat: 0,
        lng: -6.0,
      },
    },
    [MANEUVERS_MAP.TURN_ABOUT]: {
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
    MSM_REMINDERS,
    MANEUVERS_MAP,
    MANEUVERS,
  };
})();
