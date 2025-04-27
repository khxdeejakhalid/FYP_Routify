import axios from "axios";
import { NOTIFY_APP_ID, NOTIFY_APP_TOKEN } from "@env";

export const indieNotificationDataService = (function () {
  const INDIE_NOTIFICATION_APP_URL = "https://app.nativenotify.com/api";

  function unregisterIndieSubID(uniqueUserId) {
    const url = `${INDIE_NOTIFICATION_APP_URL}/app/indie/sub/${NOTIFY_APP_ID}/${NOTIFY_APP_TOKEN}/${uniqueUserId}`;
    return axios
      .delete(url)
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error("Error unregistering Indie Sub ID:", error);
      });
  }

  function getRegisteredIndieSubID(uniqueUserId) {
    const url = `${INDIE_NOTIFICATION_APP_URL}/expo/indie/sub/${NOTIFY_APP_ID}/${NOTIFY_APP_TOKEN}/${uniqueUserId}`;
    return axios
      .get(url)
      .then((response) => {
        return response.data;
      })
      .catch((err) => {
        console.log("Error fetching Indie Sub ID:", err);
      });
  }

  function pushNotification(payload) {
    const url = `${INDIE_NOTIFICATION_APP_URL}/indie/notification`;
    return axios
      .post(url, payload,  {
        headers: {
          "Content-Type": "application/json"
        }
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        console.error("Error sending push notification:", error);
      });
  }

  return {
    unregisterIndieSubID,
    getRegisteredIndieSubID,
    pushNotification,
  };
})();
