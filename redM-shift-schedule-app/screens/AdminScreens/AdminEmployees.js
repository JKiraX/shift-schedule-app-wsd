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
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AddEmployeePage from './AddEmployees';
import EditEmployeeScreen from './EditEmployees';

const Stack = createNativeStackNavigator();

const AdminEmployeeScreen = () => {

  const [employees, setEmployees] = useState([
    { id: "1", name: "Roxanne Smith" },
    { id: "2", name: "Yusheen Sriram" },
    { id: "3", name: "Mpho Mafalo" },
    { id: "4", name: "Phumeza Ntwashu" },
    { id: "5", name: "Hope" },
  ]);


  const [users, setUsers] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("http://192.168.5.61:3001/api/users");
        console.log('Response status:', response.status);
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`Network response was not ok: ${response.status} ${errorText}`);
        }
        const data = await response.json();
        console.log("Fetched users:", data);
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
        Alert.alert('Error', `Failed to fetch users: ${error.message}`);
      }
    };

    fetchUsers();
  }, []);

  // const handleDelete = async (userId) => {
  // //   try {
  // //     const response = await fetch(`http://192.168.5.61:3001/api/users/${userId}`, {
  // //       method: 'DELETE',
  // //     });
  // //     if (response.ok) {
  // //       setUsers(users.filter((user) => user.user_id !== userId));
  // //     } else if (response.status === 404) {
  // //       Alert.alert('Error', 'User not found');
  // //     } else {
  // //       throw new Error('Failed to delete user');
  // //     }
  // //   } catch (error) {
  // //     console.error('Error deleting user:', error);
  // //     Alert.alert('Error', 'Failed to delete user');
  // //   }
  // // };

  const handleAdd = () => {
    navigation.push("AddEmployees");
  };

  const handleEdit = (user) => {
    navigation.push("EditEmployee", { user });
  };

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
        keyExtractor={(item) => item.user_id ? item.user_id.toString() : Math.random().toString()}
        renderItem={({ item }) => (
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
                onPress={() => handleDelete(item.user_id)}
                style={styles.actionButton}
              >
                <MaterialCommunityIcons name="delete" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.userList}
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
  userList: {
    paddingBottom: 20,
  },
  userItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 14,
    color: "#666",
  },
  actions: {
    flexDirection: "row",
  },
  actionButton: {
    marginLeft: 10,
  },
});

export default AdminEmployee;
