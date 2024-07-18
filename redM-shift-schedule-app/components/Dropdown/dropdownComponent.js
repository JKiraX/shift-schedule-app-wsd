import * as React from "react";
import { Text, View } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { MaterialIcons } from "@expo/vector-icons";

const DropdownComponent = ({ data = [], onSelect }) => {
  const [selected, setSelected] = React.useState("");

  return (
    <SelectList
      setSelected={(val) => {
        setSelected(val);
        onSelect(val); // Ensure onSelect gets called
      }}
      data={data}
      save="value"
      placeholder={
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialIcons name="person-outline" size={24} color="black" />
          <Text style={{ marginLeft: 10 }}>Select User</Text>
        </View>
      }
      boxStyles={{
        maxWidth: 350,
        minWidth: 350,
        backgroundColor: "white",
        borderColor: "#c82f2f",
      }}
      dropdownStyles={{
        maxWidth: 350,
        minWidth: 350,
        backgroundColor: "white",
        borderColor: "#c82f2f",
      }}
      inputStyles={{ color: "black", fontWeight: "bold" }}
      searchIconComponent={
        <MaterialIcons name="search" size={24} color="black" />
      }
    />
  );
};

export default DropdownComponent;
