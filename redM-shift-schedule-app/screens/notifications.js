// // NotificationsPage.js
// import React, { useEffect, useState } from 'react';
// import { View, Text, Button, Platform, Alert } from 'react-native';
// import * as Notifications from 'expo-notifications';
// import 'firebase/messaging';

// const NotificationsPage = () => {
//     const [expoPushToken, setExpoPushToken] = useState('');
//     const [notification, setNotification] = useState(false);

//     useEffect(() => {
//         registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

//         const notificationListener = Notifications.addNotificationReceivedListener(notification => {
//             setNotification(notification);
//         });

//         const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
//             console.log(response);
//         });

//         return () => {
//             Notifications.removeNotificationSubscription(notificationListener);
//             Notifications.removeNotificationSubscription(responseListener);
//         };
//     }, []);

//     async function registerForPushNotificationsAsync() {
//         let token;
//         const { status: existingStatus } = await Notifications.getPermissionsAsync();
//         let finalStatus = existingStatus;

//         if (existingStatus !== 'granted') {
//             const { status } = await Notifications.requestPermissionsAsync();
//             finalStatus = status;
//         }

//         if (finalStatus !== 'granted') {
//             Alert.alert('Failed to get push token for push notification!');
//             return;
//         }

//         token = (await Notifications.getExpoPushTokenAsync()).data;
//         console.log(token);

//         if (Platform.OS === 'android') {
//             await Notifications.setNotificationChannelAsync('default', {
//                 name: 'default',
//                 importance: Notifications.AndroidImportance.MAX,
//                 vibrationPattern: [0, 250, 250, 250],
//                 lightColor: '#FF231F7C',
//             });
//         }

//         return token;
//     }

//     async function sendPushNotification(expoPushToken) {
//         const message = {
//             to: expoPushToken,
//             sound: 'default',
//             title: 'Test Notification',
//             body: 'This is a test notification',
//             data: { someData: 'goes here' },
//         };

//         await fetch('https://exp.host/--/api/v2/push/send', {
//             method: 'POST',
//             headers: {
//                 Accept: 'application/json',
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify(message),
//         });
//     }

//     return (
//         <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//             <Text>Your Expo Push Token: {expoPushToken}</Text>
//             <View style={{ height: 20 }} />
//             <Button
//                 title="Press to Send Notification"
//                 onPress={async () => {
//                     await sendPushNotification(expoPushToken);
//                 }}
//             />
//             {notification && (
//                 <View style={{ marginTop: 20 }}>
//                     <Text>Title: {notification.request.content.title} </Text>
//                     <Text>Body: {notification.request.content.body}</Text>
//                     <Text>Data: {JSON.stringify(notification.request.content.data)}</Text>
//                 </View>
//             )}
//         </View>
//     );
// };

// export default NotificationsPage;
