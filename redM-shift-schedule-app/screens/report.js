import * as React from "react";
import { Text, View } from "react-native";

export default function ReportsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text
        onPress={() => alert('This is the "Reports" screen.')}
        style={{ fontSize: 26, fontWeight: "bold" }}
      >
        Reports
      </Text>
    </View>
  );
}
