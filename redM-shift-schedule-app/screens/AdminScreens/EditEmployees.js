import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Dimensions,
  Switch,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import SmallButton from "../../components/Buttons/smallButton";
import { SafeAreaView } from "react-native-safe-area-context";
import apiClient from "../../../server/aspApiRoutes";

const { width, height } = Dimensions.get("window");

const EditEmployeeScreen = () => {
  const [employee, setEmployee] = useState({
    id: 0,
    email: "",
    firstName: "",
    lastName: "",
    role: "User", 
  });
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(() => {
    if (route.params?.employee) {

      setEmployee(route.params.employee);
    } else {
    
      setEmployee(prevState => ({...prevState, role: "User"}));
    }
  }, [route.params]);

  const handleUpdate = async () => {
    try {
      const response = await apiClient.put(
        "/api/Authentication/update",
        employee
      );
      if (response.status === 200) {
        Alert.alert("Success", "Employee details updated.", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to update employee details.");
    }
  };

  const renderInputField = (
    label,
    key,
    placeholder,
    keyboardType = "default"
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={employee[key]}
        onChangeText={(text) => setEmployee({ ...employee, [key]: text })}
        placeholder={placeholder}
        keyboardType={keyboardType}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        {renderInputField("E-mail", "email", "Enter email", "email-address")}
        {renderInputField("First Name", "firstName", "Enter first name")}
        {renderInputField("Last Name", "lastName", "Enter last name")}
        <View style={styles.toggleContainer}>
          <Text style={styles.label}>Role:</Text>
          <View style={styles.roleContainer}>
            <Text style={styles.roleText}>{employee.role}</Text>
            <Switch
              value={employee.role === "Admin"}
              onValueChange={(value) =>
                setEmployee({ ...employee, role: value ? "Admin" : "User" })
              }
              trackColor={{ false: "#767577", true: "#c82f2f" }}
              thumbColor={employee.role === "Admin" ? "#f4f3f4" : "#f4f3f4"}
            />
          </View>
        </View>
        <SmallButton text="Update" onPress={handleUpdate} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  formContainer: {
    padding: width * 0.05,
    alignItems: "center",
  },
  inputContainer: {
    width: "100%",
    marginBottom: height * 0.02,
  },
  label: {
    fontSize: 18,
    marginBottom: height * 0.01,
  },
  input: {
    height: height * 0.07,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: width * 0.03,
    backgroundColor: "#e9ecef",
    width: "100%",
    fontSize: 17,
  },
  toggleContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: height * 0.02,
  },
  roleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  roleText: {
    fontSize: 17,
    marginRight: 10,
  },
});

export default EditEmployeeScreen;
