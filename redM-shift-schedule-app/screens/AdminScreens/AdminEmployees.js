import React, { useState, useCallback } from "react";
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
import { useNavigation, useFocusEffect } from "@react-navigation/native";


const AdminEmployeeScreen = () => {
  const [users, setUsers] = useState([]);
  const navigation = useNavigation();

  const fetchUsers = useCallback(async () => {
    try {
      const response = await fetch(`http://10.0.0.20:3001/api/users`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
      Alert.alert('Error', 'Failed to fetch users');
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchUsers();
    }, [fetchUsers])
  );

  const handleDelete = async (userId) => {
    try {
      const response = await fetch(`http://10.0.0.20:3001/api/users/${userId}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setUsers(users.filter((user) => user.user_id !== userId));
      } else if (response.status === 404) {
        Alert.alert('Error', 'User not found');
      } else {
        throw new Error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      Alert.alert('Error', 'Failed to delete user');
    }
  };

  const handleAdd = () => {
    navigation.push("AddUser");
  };

  const handleEdit = (user) => {
    navigation.push("EditUser", { user });
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
        keyExtractor={(item) => item.user_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userItem}>
            <View>
              <Text style={styles.userName}>{item.user_name}</Text>
              <Text style={styles.userEmail}>{item.email}</Text>
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

export default AdminEmployeeScreen;