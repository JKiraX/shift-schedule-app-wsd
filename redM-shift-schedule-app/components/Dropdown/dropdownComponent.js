import * as React from "react";
import { Text, View, StyleSheet, Dimensions } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { MaterialIcons } from "@expo/vector-icons";

const DropdownComponent = ({ data = [], onSelect }) => {
  const [selected, setSelected] = React.useState("");

  const handleSelect = (val) => {
    setSelected(val);
    onSelect(val);
  };

  const PlaceholderComponent = () => (
    <View style={styles.placeholderContainer}>
      <MaterialIcons name="person-outline" size={24} color="black" />
      <Text style={styles.placeholderText}>Select User</Text>
    </View>
  );

  return (
    <SelectList
      setSelected={handleSelect}
      data={data}
      save="value"
      placeholder={<PlaceholderComponent />}
      boxStyles={styles.box}
      dropdownStyles={styles.dropdown}
      inputStyles={styles.input}
      searchIconComponent={
        <MaterialIcons name="search" size={24} color="black" />
      }
    />
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  placeholderContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  placeholderText: {
    marginLeft: 10,
  },
  box: {
    width: width * 0.9,
    maxWidth: 350,
    backgroundColor: "white",
    borderColor: "#c82f2f",
    alignSelf: 'center',
  },
  dropdown: {
    width: width * 0.9,
    maxWidth: 350,
    backgroundColor: "white",
    borderColor: "#c82f2f",
    alignSelf: 'center',
  },
  input: {
    color: "black",
    fontWeight: "bold",
  },
});

export default DropdownComponent;