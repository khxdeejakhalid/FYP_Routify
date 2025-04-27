import { routifyConstantsService } from "../services/routifyConstantsService";
import { mapUtils } from "./mapUtils";

export const maneuverUtils = (function () {
  // Measure how much time the user spends stationary during the maneuver. Long stops might indicate poor execution.
  const trackStationaryTime = (stationaryCount) => {
    if (stationaryCount > 3) {
      return false;
    } else {
      return true;
    }
  };

  // Excessively slow or fast completion may indicate inefficiency or recklessness.
  const trackTimeTakenToCompleteManuever = (
    startTime,
    { startLat, startLng, endLat, endLng },
  ) => {
    const totalDistance = mapUtils.getDistance(
      startLat,
      startLng,
      endLat,
      endLng,
    );
    const IDEAL_AVG_SPEED = (20 * 1000) / 3600; // Ideal speed in meters per second (e.g., 20 km/h)
    const idealTimeToComplete = totalDistance / IDEAL_AVG_SPEED;
    const actualTimeTaken = (Date.now() - startTime) / 1000;

    const BAD_TIME_THRESHOLD = 1.5 * idealTimeToComplete; // Time is bad if it exceeds 150% of ideal time

    if (actualTimeTaken >= BAD_TIME_THRESHOLD) {
      return false;
    } else {
      return true;
    }
  };

  // Analyze acceleration and braking patterns. Erratic changes could indicate poor control.
  const evaluateSmoothness = (speedHistory) => {
    const ACCEPTABLE_JERK_THRESHOLD = 2.5;

    // Calculate time intervals
    const timeIntervals = speedHistory.map(({ timestamp }, index) => {
      if (index === 0) return 1;
      return (timestamp - speedHistory[index - 1].timestamp) / 1000;
    });

    const speedValues = speedHistory.map(({ speed }) => speed);

    // Calculate acceleration
    const acceleration = speedValues.map((speed, index) => {
      if (index === 0) return 0; // No acceleration for the first point

      return (speed - speedValues[index - 1]) / (timeIntervals[index] || 1);
    });

    const jerk = acceleration.map((acc, index) => {
      if (index === 0) return 0;
      return acc - acceleration[index - 1] / (timeIntervals[index] || 1);
    });

    const maxJerk = Math.max(...jerk.map(Math.abs));
    if (maxJerk > ACCEPTABLE_JERK_THRESHOLD) {
      console.log("Movement is not smooth.");
      return false;
    } else {
      console.log("Movement is smooth.");
      return true;
    }
  };

  const isManueverInProgress = (
    currentLat,
    currentLng,
    manueverLat,
    manueverLng,
  ) => {
    const distance = mapUtils.getDistance(
      currentLat,
      currentLng,
      manueverLat,
      manueverLng,
    );

    if (distance <= routifyConstantsService.MANEUVERS_PROXIMITY_THRESHOLD) {
      return true;
    } else {
      return false;
    }
  };

  const scoreManuever = (evaluations) => {
    const totalWeight = evaluations.reduce(
      (acc, evalItem) => acc + evalItem.weight,
      0,
    );
    const weightedScore = evaluations.reduce(
      (sum, evalItem) => sum + (evalItem.evaluate ? evalItem.weight : 0),
      0,
    );

    const starRating = (weightedScore / totalWeight) * 5;
    return Math.round(starRating);
  };

  const calculateDeviationsFromKerbs = (kerbCoordinates, currLocation) => {
    let touchedKerb = false;
    let deviations = [];

    kerbCoordinates.forEach((kerbPoint) => {
      const distance = mapUtils.getDistance(
        currLocation.latitude,
        currLocation.longitude,
        kerbPoint.latitude,
        kerbPoint.longitude,
      );

      if (distance < 1) {
        touchedKerb = true;
      }

      deviations.push(parseFloat(distance));
    });

    return { touchedKerb: touchedKerb, deviations: deviations };
  };

  const getAverage = (arr) => {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  };

  const getMinimumDeviation = (deviations) => {
    return deviations.reduce((min, num) => Math.min(min, num), Infinity);
  };

  const calculateOverallScore = (distanceScore, speedScore, timeScore) => {
    return Math.ceil((distanceScore + speedScore + timeScore) / 3);
  };

  const calculateReverseAroundCornerScore = (
    value,
    idealMin,
    idealMax,
    maxScore = 5,
  ) => {
    if (value < idealMin || value > idealMax) {
      return 0; // Fail if outside the ideal range
    }

    // Calculate how close the value is to the ideal range
    const range = idealMax - idealMin;
    const deviation = Math.min(
      Math.abs(value - idealMin),
      Math.abs(value - idealMax),
    );
    const score = maxScore - (deviation / range) * maxScore;

    return Math.round(score * 10) / 10; // Round to 1 decimal place
  };

  const normalizeScoreOutOf5 = (score, min, max) => {
    if (min === max) return 0;
    return Math.ceil((5 * (score - min)) / (max - min));
  };

  const getTimeDifferenceInMinutes = (startTime, endTime) => {
    return (endTime - startTime) / (1000 * 60);
  };

  return {
    trackStationaryTime,
    trackTimeTakenToCompleteManuever,
    evaluateSmoothness,
    isManueverInProgress,
    scoreManuever,
    calculateDeviationsFromKerbs,
    getAverage,
    getMinimumDeviation,
    calculateOverallScore,
    calculateReverseAroundCornerScore,
    normalizeScoreOutOf5,
    getTimeDifferenceInMinutes,
  };
})();
