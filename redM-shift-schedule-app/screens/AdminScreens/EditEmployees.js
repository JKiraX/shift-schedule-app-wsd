import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  Platform,
  Dimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import SmallButton from "../../components/Buttons/smallButton";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const EditEmployeeScreen = () => {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const navigation = useNavigation();

  const handleUpdate = () => {
    if (!name || !contact || !email) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    // Update the employee data (replace this with your actual update logic)
    const employeeData = { name, contact, email };
    updateEmployee(employeeData);

    Alert.alert("Success", "Employee details updated.", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);

    // Clear the input fields
    setName("");
    setContact("");
    setEmail("");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        <InputField
          label="Name"
          value={name}
          onChangeText={setName}
          placeholder="Enter name"
        />
        <InputField
          label="Phone Number"
          value={contact}
          onChangeText={setContact}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
        />
        <InputField
          label="E-mail"
          value={email}
          onChangeText={setEmail}
          placeholder="Enter email"
          keyboardType="email-address"
        />
        <SmallButton text="Update" onPress={handleUpdate} />
      </View>
    </SafeAreaView>
  );
};

const InputField = ({ label, ...props }) => (
  <View style={styles.inputContainer}>
    <Text style={styles.label}>{label}</Text>
    <TextInput style={styles.input} {...props} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    paddingTop: Platform.OS === "android" ? 25 : 0,
  },
  formContainer: {
    padding: width * 0.05,
  },
  inputContainer: {
    marginBottom: height * 0.02,
  },
  label: {
    fontSize: 18,
    marginBottom: 6,
    color: "#333",
  },
  input: {
    height: Platform.OS === "ios" ? 55 : 50,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#e9ecef",
    width: "100%",
    fontSize: 17,
  },
});

export default EditEmployeeScreen;
