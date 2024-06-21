import * as React from "react";
import { Text, View } from "react-native";

export default function NotificationsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center",backgroundColor:"white" }}>
      <Text
        onPress={() => alert('This is the "Notifications" screen.')}
        style={{ fontSize: 26, fontWeight: "bold" }}
      >
        Notifications
      </Text>
    </View>
  );
}
