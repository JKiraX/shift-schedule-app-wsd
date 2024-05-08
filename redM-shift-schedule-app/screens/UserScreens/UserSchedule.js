import * as React from "react";
import { Text, View } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

export default function UserScheduleScreen({ navigation }) {
  const [selected, setSelected] = React.useState("");
  const data = [
    { key: "1", value: "Yusheen" },
    { key: "2", value: "Roxxane" },
    { key: "3", value: "Hope" },
    { key: "4", value: "Mpho" },
    { key: "5", value: "Charlotte" },
  ];
  return (
    <SafeAreaProvider style={{ flex: 1, alignItems: "center", marginTop: 20 }}>
      <SelectList
        setSelected={(val) => setSelected(val)}
        data={data}
        save="value"
        onSelect={() => console.log(selected)}
        //styling
        placeholder={
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialIcons name="person-outline" size={24} color="black" />
            <Text style={{ marginLeft: 10 }}>Select a user</Text>
          </View>
        }
        notFoundText="User not found"
        boxStyles={{
          maxWidth: 350,
          minWidth: 350,
          backgroundColor: "white",
          borderColor: "#3D5A80",
        }}
        dropdownStyles={{
          maxWidth: 350,
          minWidth: 350,
          backgroundColor: "white",
          borderColor: "#3D5A80",
        }}
      />
    </SafeAreaProvider>
  );
}
