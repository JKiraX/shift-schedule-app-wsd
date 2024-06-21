import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";
import AddEmployeePage from "../AdminScreens/AddEmployees";
import EditEmployeeScreen from "../AdminScreens/EditEmployees";

const Stack = createNativeStackNavigator();

const AdminEmployeeScreen = () => {
  const [employees, setEmployees] = useState([
    { id: "1", name: "Kgothatso Louw" },
    { id: "2", name: "Muzzammil Govender" },
    { id: "3", name: "Ashton Khan" },
  ]);

  const navigation = useNavigation();

  const handleDelete = (employeeId) => {
    setEmployees(employees.filter((emp) => emp.id !== employeeId));
  };

  const handleAdd = () => {
    navigation.push("AddEmployees");
  };

  const handleEdit = (employee) => {
    navigation.push("EditEmployee", { employee });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput style={styles.searchInput} placeholder="Search" />
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Text style={styles.addButtonText}>Add Employee</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={employees}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.employeeItem}>
            <Text style={styles.employeeName}>{item.name}</Text>
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.actionButton}
                onPress={() => handleEdit(item)}
              >
                <MaterialCommunityIcons name="pencil" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => handleDelete(item.id)}
                style={styles.actionButton}
              >
                <MaterialCommunityIcons name="delete" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.employeeList}
      />
    </SafeAreaView>
  );
};

const AdminEmployee = () => {
  return (
    <Stack.Navigator initialRouteName="AdminEmployeeScreen">
      <Stack.Screen
        name="AdminEmployeeScreen"
        component={AdminEmployeeScreen}
        options={{
          title: "Employees",
          headerTintColor: "#c82f2f",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="AddEmployees"
        component={AddEmployeePage}
        options={{
          title: "Add Employee",
          headerTintColor: "#c82f2f",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="EditEmployee"
        component={EditEmployeeScreen}
        options={{
          title: "Edit Employee",
          headerTintColor: "#c82f2f",
          headerTitleAlign: "center",
        }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:"white",
    padding: 20,
  },
  searchBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 15,
    marginRight: 10,
  },
  addButton: {
    padding: 10,
    backgroundColor: "#c82f2f",
    borderRadius: 15,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  employeeList: {
    paddingBottom: 20,
  },
  employeeItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  employeeName: {
    fontSize: 18,
  },
  actions: {
    flexDirection: "row",
  },
  actionButton: {
    marginLeft: 10,
  },
});

export default AdminEmployee;
