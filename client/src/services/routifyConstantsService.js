export const routifyConstantsService = (function () {
    const goshoReminders = [
      "Select gear",
      "Observe surroundings",
      "Signal",
      "Handbrake down",
      "Observation (over the shoulder)",
    ];
    const msmReminders = ["Check Mirrors", "Signal", "Manoeuvre/move"];
  
    return {
      goshoReminders,
      msmReminders,
    };
  })();