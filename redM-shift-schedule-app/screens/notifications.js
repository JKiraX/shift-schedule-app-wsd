import React, { useEffect } from 'react';
import { View, Button, Text, Platform, StyleSheet } from 'react-native';
import * as Notifications from 'expo-notifications';
import * as Permissions from 'expo-permissions';

async function registerForPushNotificationsAsync() {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    alert('Failed to get push token for push notification!');
    return;
  }

  try {
    const token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } catch (error) {
    console.log('Error getting push token:', error);
  }
}

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);

  const triggerShiftReminderNotification = () => {
    const triggerTime = new Date();
    triggerTime.setHours(triggerTime.getHours() + 1);

    Notifications.scheduleNotificationAsync({
      content: {
        title: 'Shift Reminder',
        body: 'Your shift will start in one hour.',
      },
      trigger: {
        date: triggerTime,
      },
    });
  };

  return (
    <View style={styles.container}>
      <Text
        onPress={triggerShiftReminderNotification}
        style={styles.title}
      >
        Set Shift Reminder
      </Text>
      <Button
        title="Trigger Notification"
        onPress={triggerShiftReminderNotification}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
});