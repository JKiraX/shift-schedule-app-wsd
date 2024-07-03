import * as React from "react";
import { Text, View } from "react-native";

export default function AnalyticsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center", backgroundColor:"white" }}>
      <Text
        onPress={() => alert('This is the "Analytics" screen.')}
        style={{ fontSize: 26, fontWeight: "bold" }}
      >
        Analytics
      </Text>
    </View>
  );
}
