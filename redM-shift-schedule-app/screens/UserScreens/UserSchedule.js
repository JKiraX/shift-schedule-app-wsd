import * as React from "react";
import { Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import DropdownComponent from "../../components/Dropdown/dropdownComponent";

export default function UserScheduleScreen({ navigation }) {
  const data = [
    { key: "1", value: "Yusheen" },
    { key: "2", value: "Roxanne" },
    { key: "3", value: "Hope" },
    { key: "4", value: "Mpho" },
    { key: "5", value: "Charlotte" },
  ];

  const handleSelect = (selected) => {
    console.log(selected);
  }

  return (
    <SafeAreaProvider style={{ flex: 1, alignItems: "center", marginTop: 20 }}>
      <DropdownComponent data={data} onSelect={handleSelect} />
    </SafeAreaProvider>
  );
}