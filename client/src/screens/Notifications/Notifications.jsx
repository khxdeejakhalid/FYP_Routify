"use client";

import { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  SafeAreaView,
  RefreshControl,
} from "react-native";
import { Bell, Check, Trash2 } from "react-native-feather";
// Indie Notifications
import {
  getIndieNotificationInbox,
  deleteIndieNotificationInbox,
} from "native-notify";
import { AuthContext } from "../../context/AuthContext";
import { NOTIFY_APP_ID, NOTIFY_APP_TOKEN } from "@env";
import { getRelativeTimeFromNow } from "../../utils/routifyUtilityService";
import { colors } from "../../utils/colors";

export default function NotificationScreen() {
  // * Context
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const unreadCount = notifications.filter(
    (item) => !item.pushData.read,
  ).length;

  const markAsRead = (id) => {
    setNotifications(
      notifications.map((item) =>
        item.notification_id === id
          ? { ...item, pushData: { read: true } }
          : item,
      ),
    );
  };

  const markAllAsRead = () => {
    setNotifications(
      notifications.map((item) => ({ ...item, pushData: { read: true } })),
    );
  };

  const clearAll = async () => {
    // setNotifications([]);
    // await deleteIndieNotificationInbox(
    //   user.email,
    //   NOTIFY_APP_ID,
    //   NOTIFY_APP_TOKEN,
    // );
  };

  const onRefresh = async () => {
    try {
      setRefreshing(true);
      await getNotifications();
    } catch (error) {
      console.error("Error refreshing notifications:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const renderNotificationItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.notificationItem,
        !item.pushData.read && styles.unreadNotification,
      ]}
      onPress={() => {
        markAsRead(item.notification_id);
      }}>
      <View style={styles.notificationContent}>
        <View style={styles.notificationHeader}>
          <Text style={styles.notificationTitle}>{item.title}</Text>
          {!item.pushData.read && <View style={styles.unreadDot} />}
        </View>
        <Text style={styles.notificationMessage}>{item.message}</Text>
        <View style={styles.notificationTimeRow}>
          <Text style={styles.notificationTime}>
            {getRelativeTimeFromNow(item.date)}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Bell width={50} height={50} color={colors.primary} />
      <Text style={styles.emptyTitle}>No Notifications</Text>
      <Text style={styles.emptyMessage}>
        You're all caught up! We'll notify you when there's something new.
      </Text>
    </View>
  );

  //   * API Calls
  const getNotifications = async () => {
    const notifications = await getIndieNotificationInbox(
      user.email,
      NOTIFY_APP_ID,
      NOTIFY_APP_TOKEN,
      20,
    );
    setNotifications(notifications);
  };

  //   * Hooks
  useEffect(() => {
    getNotifications();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor={colors.primary} barStyle="light-content" />

      {unreadCount > 0 && (
        <View style={styles.unreadBanner}>
          <Text style={styles.unreadBannerText}>
            {`${unreadCount} unread ${unreadCount === 1 ? "notification" : "notifications"}`}
          </Text>
          {unreadCount > 0 && (
            <TouchableOpacity
              onPress={markAllAsRead}
              style={styles.headerButton}>
              <Check width={20} height={20} color={colors.primary} />
            </TouchableOpacity>
          )}
        </View>
      )}

      <FlatList
        data={notifications}
        renderItem={renderNotificationItem}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContainer}
        keyExtractor={(item) => item.notification_id.toString()}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={["#880808"]}
            tintColor={colors.primary}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    backgroundColor: colors.primary,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "bold",
  },
  headerActions: {
    flexDirection: "row",
  },
  headerButton: {
    marginLeft: 16,
  },
  unreadBanner: {
    backgroundColor: "#ffebee",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ffcdd2",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
  },
  unreadBannerText: {
    color: colors.primary,
    fontWeight: "500",
    textAlign: "center",
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: 16,
  },
  notificationItem: {
    backgroundColor: colors.white,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  unreadNotification: {
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
  },
  notificationContent: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  notificationTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    flex: 1,
  },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginLeft: 8,
  },
  notificationMessage: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  notificationTimeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  notificationTime: {
    fontSize: 12,
    color: "#999",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
    marginTop: 50,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
});
