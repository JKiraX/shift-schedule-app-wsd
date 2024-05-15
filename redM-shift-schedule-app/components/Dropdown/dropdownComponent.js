import * as React from "react";
import { Text, View } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { MaterialIcons } from "@expo/vector-icons";

const DropdownComponent = ({ data, onSelect }) => {
  const [selected, setSelected] = React.useState("");

  return (
    <SelectList
      setSelected={(val) => setSelected(val)}
      data={data}
      save="value"
      onSelect={() => onSelect(selected)}
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
      inputStyles={{ color: "black", fontWeight: "bold" }}
      searchIconComponent={
        <MaterialIcons name="search" size={24} color="black" />
      }
    />
  );
};

export default DropdownComponent;