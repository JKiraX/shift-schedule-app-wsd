import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Platform,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AddEmployeePage from "./AddEmployees";
import EditEmployeeScreen from "./EditEmployees";

const Stack = createNativeStackNavigator();

const AdminEmployeeScreen = () => {
  const [users, setUsers] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("http://192.168.5.61:3001/api/users");
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
          `Network response was not ok: ${response.status} ${errorText}`
        );
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      Alert.alert("Error", `Failed to fetch users: ${error.message}`);
    }
  };

  const handleAdd = () => {
    navigation.push("AddEmployees");
  };

  const handleEdit = (user) => {
    navigation.push("EditEmployee", { user });
  };

  const renderUserItem = ({ item }) => (
    <View style={styles.userItem}>
      <View>
        <Text style={styles.userName}>{item.name}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleEdit(item)}
        >
          <MaterialCommunityIcons name="pencil" size={24} color="black" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => handleDelete(item.user_id)}
        >
          <MaterialCommunityIcons name="delete" size={24} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput style={styles.searchInput} placeholder="Search" />
        <TouchableOpacity style={styles.addButton} onPress={handleAdd}>
          <Text style={styles.addButtonText}>Add User</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={users}
        keyExtractor={(item) =>
          item.user_id ? item.user_id.toString() : Math.random().toString()
        }
        renderItem={renderUserItem}
        contentContainerStyle={styles.userList}
      />
    </SafeAreaView>
  );
};

const AdminEmployee = () => (
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
  },
  searchBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    padding: Platform.OS === "ios" ? 15 : 10,
    borderColor: "#ddd",
    borderWidth: 1,
    borderRadius: 15,
    marginRight: 10,
  },
  addButton: {
    padding: 10,
    backgroundColor: "#c82f2f",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  userList: {
    paddingBottom: 20,
  },
  userItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  actions: {
    flexDirection: "row",
  },
  actionButton: {
    marginLeft: 15,
    padding: 5,
  },
});

export default AdminEmployee;
