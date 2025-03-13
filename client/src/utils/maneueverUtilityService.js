import { routifyConstantsService } from "../services/routifyConstantsService";
import { mapUtils } from "./mapUtils";

export const maneuverUtils = (function () {
    const calculateDeviationsFromKerbs = (kerbCoordinates, currLocation) => {
        let touchedKerb = false;
        let deviations = [];
    
        kerbCoordinates.forEach((kerbPoint) => {
          const distance = mapUtils.getDistance(
            currLocation.latitude,
            currLocation.longitude,
            kerbPoint.lat,
            kerbPoint.lng,
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

      return {
        calculateDeviationsFromKerbs,
        getAverage,
        getMinimumDeviation,
        calculateOverallScore,
        calculateReverseAroundCornerScore,
      };
})();