import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, useWindowDimensions, TouchableOpacity } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import { MaterialIcons } from "@expo/vector-icons";

const DropdownComponent4 = ({ data = [], onSelect }) => {
  const [selected, setSelected] = useState(""); 
  const [key, setKey] = useState(0); 
  const { width: windowWidth } = useWindowDimensions();

  const handleSelect = (val) => {
    setSelected(val);  
    onSelect(val); 
  };

  const clearSelection = () => {
    setSelected(""); 
    onSelect("");
    setKey(prevKey => prevKey + 1); 
  };

  useEffect(() => {
    return () => {
      setSelected("");
      onSelect("");
    };
  }, []);

  const renderPlaceholder = () => (
    <View style={styles.placeholderContainer}>
      <MaterialIcons name="person-outline" size={24} color="black" />
      <Text style={styles.placeholderText}>
        {selected ? selected : "Select User"}
      </Text>
    </View>
  );

  const renderItem = (item) => (
    <Text>{item.value}</Text>
  );

  return (
    <View>
      <SelectList
        key={key} 
        setSelected={handleSelect}  
        data={data}
        save="value"
        placeholder={renderPlaceholder()}  
        boxStyles={[styles.dropdownBox, { width: windowWidth - 40 }]}
        dropdownStyles={[styles.dropdown, { width: windowWidth - 40 }]}
        inputStyles={styles.input}
        searchIconComponent={
          <MaterialIcons name="search" size={24} color="black" />
        }
        closeicon={<MaterialIcons name="close" size={24} color="black" />}
        notFoundText="No user found"
        renderItem={renderItem} 
        defaultOption={null} 
      />
 
      <TouchableOpacity onPress={clearSelection} style={styles.clearFilterButton}>
        <Text style={styles.clearFilterText}>Clear Filter</Text>
      </TouchableOpacity>
    </View>
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
  clearFilterButton: {
    marginTop: 10,   
    alignItems: "flex-end",
    justifyContent: "center",
    margin: 10,
  },
  clearFilterText: {
    color: "red",   
    textAlign:"justify",
    fontWeight: "normal",  
  },
});

export default DropdownComponent4;
