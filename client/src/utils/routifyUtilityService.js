import { imageRegistry } from "./imageRegistry";
import moment from "moment";

export const getImageSource = (path) => {
  return imageRegistry[path] || imageRegistry["quiz01/Question01.png"];
};

export const getRandomQuizNumber = () => {
  return Math.floor(Math.random() * 8) + 1;
};

/**
 * Calculates the relative time between the given date and now
 * @param {string} dateString - Date string in format 'M-D-YYYY h:mmAM/PM' (e.g., '4-25-2025 8:25PM')
 * @returns {string} - Human-readable relative time (e.g., "3 days ago", "2 hours ago")
 */
export const getRelativeTimeFromNow = (dateString) => {
  // Parse the input date string
  const parseDateString = (str) => {
    // Format: 'M-D-YYYY h:mmAM/PM' (e.g., '4-25-2025 8:25PM')
    const regex = /(\d{1,2})-(\d{1,2})-(\d{4})\s+(\d{1,2}):(\d{2})([AP]M)/;
    const matches = str.match(regex);

    if (!matches) {
      throw new Error(
        "Invalid date format. Expected format: 'M-D-YYYY h:mmAM/PM' (e.g., '4-25-2025 8:25PM')",
      );
    }

    const [, month, day, year, hours, minutes, ampm] = matches;

    // Convert hours to 24-hour format
    let hour = parseInt(hours, 10);
    if (ampm === "PM" && hour < 12) hour += 12;
    if (ampm === "AM" && hour === 12) hour = 0;

    return new Date(year, month - 1, day, hour, parseInt(minutes, 10));
  };

  // Parse the input date
  const date = parseDateString(dateString);
  const now = new Date();

  // Calculate time difference in milliseconds
  const diffMs = now - date;

  // Convert to seconds
  const diffSeconds = Math.floor(diffMs / 1000);

  // Convert to appropriate time unit
  if (diffSeconds < 60) {
    return diffSeconds === 1 ? "1 second ago" : `${diffSeconds} seconds ago`;
  }

  // Minutes
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) {
    return diffMinutes === 1 ? "1 minute ago" : `${diffMinutes} minutes ago`;
  }

  // Hours
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) {
    return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
  }

  // Days
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) {
    return diffDays === 1 ? "1 day ago" : `${diffDays} days ago`;
  }

  // Months
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) {
    return diffMonths === 1 ? "1 month ago" : `${diffMonths} months ago`;
  }

  // Years
  const diffYears = Math.floor(diffMonths / 12);
  return diffYears === 1 ? "1 year ago" : `${diffYears} years ago`;
};

export const formatTime = (time) => {
  return moment(time, "HH:mm:ssZ").local().format("hh:mm A");
};
