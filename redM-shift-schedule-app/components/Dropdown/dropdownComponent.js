import React, { useState } from "react";
import { Text, View, StyleSheet, useWindowDimensions } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { MaterialIcons } from "@expo/vector-icons";

const DropdownComponent = ({ data = [], onSelect }) => {
  const [selected, setSelected] = useState("");
  const { width: windowWidth } = useWindowDimensions();

  const handleSelect = (val) => {
    setSelected(val);
    onSelect(val);
  };

  const renderPlaceholder = () => (
    <View style={styles.placeholderContainer}>
      <MaterialIcons name="person-outline" size={24} color="black" />
      <Text style={styles.placeholderText}>Select User</Text>
    </View>
  );

  return (
    <SelectList
      setSelected={(val) => {
        setSelected(val);
        onSelect(val); // Ensure onSelect gets called
      }}
      data={data}
      save="value"
      placeholder={renderPlaceholder()}
      boxStyles={[styles.dropdownBox, { width: windowWidth - 40 }]}
      dropdownStyles={[styles.dropdown, { width: windowWidth - 40 }]}
      inputStyles={styles.input}
      searchIconComponent={
        <MaterialIcons name="search" size={24} color="black" />
      }
    />
  );
};

const styles = StyleSheet.create({
  placeholderContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  placeholderText: {
    marginLeft: 10,
  },
  dropdownBox: {
    backgroundColor: "white",
    borderColor: "#c82f2f",
    borderWidth: 1,
    borderRadius: 15,
  },
  dropdown: {
    backgroundColor: "white",
    borderColor: "#c82f2f",
    borderWidth: 1,
    borderRadius: 15,
  },
  input: {
    color: "black",
    fontWeight: "bold",
  },
});

export default DropdownComponent;
