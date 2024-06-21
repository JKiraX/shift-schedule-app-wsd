import * as React from "react";
import { Text, View } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { MaterialIcons } from "@expo/vector-icons";

const DropdownComponent2 = ({ data, onSelect }) => {
  const [selected, setSelected] = React.useState("");

  const handleSelect = (val) => {
    setSelected(val);
    const selectedItem = data.find(item => item.value === val);
    onSelect(selectedItem);
  };

  return (
    <SelectList
      setSelected={handleSelect}
      data={data}
      save="value"
      placeholder={
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialIcons name="person-outline" size={24} color="black" />
          <Text style={{ marginLeft: 10 }}>Select Leave Type</Text>
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
// for merging
export default DropdownComponent2;
