import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import SmallButton from "../../components/Buttons/smallButton";
import apiClient from "../../../server/aspApiRoutes";

const AddEmployeePage = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigation = useNavigation();

  const handleAddEmployee = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      const response = await apiClient.post("/api/authentication/register", {
        email: email,
        firstName: firstName,
        lastName: lastName,
        password: newPassword,
        role: "User",
      });

      if (response.status === 200) {
        Alert.alert("Success", "Employee added.", [
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
      } else {
        Alert.alert(
          "Error",
          response.data.errors
            ? JSON.stringify(response.data.errors)
            : response.data.error
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to add employee: ");
    }
  };

  const renderInputField = (
    label,
    value,
    setValue,
    placeholder,
    secureTextEntry = false,
    keyboardType = "default"
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        autoCapitalize="none"
      />
    </View>
  );

  const PasswordRequirements = () => (
    <View style={styles.requirementsContainer}>
      <Text style={styles.requirementsTitle}>Password Requirements:</Text>
      <Text style={styles.requirementsText}>• At least 8 characters long</Text>
      <Text style={styles.requirementsText}>• At least 1 number</Text>
      <Text style={styles.requirementsText}>
        • At least 1 special character
      </Text>
      <Text style={styles.requirementsText}>• At least 1 capital letter</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <View style={styles.formContainer}>
            {renderInputField(
              "First Name",
              firstName,
              setFirstName,
              "Enter first name"
            )}
            {renderInputField(
              "Last Name",
              lastName,
              setLastName,
              "Enter last name"
            )}
            {renderInputField(
              "E-mail",
              email,
              setEmail,
              "Enter email",
              false,
              "email-address"
            )}
            <PasswordRequirements />

            {renderInputField(
              "Password",
              newPassword,
              setNewPassword,
              "Enter password",
              true
            )}
            {renderInputField(
              "Confirm Password",
              confirmPassword,
              setConfirmPassword,
              "Confirm password",
              true
            )}
            <SmallButton text="Add Employee" onPress={handleAddEmployee} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  formContainer: {
    padding: 20,
    width: width > 600 ? 600 : "100%",
    alignSelf: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    marginBottom: 6,
  },
  input: {
    height: 55,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#e9ecef",
    fontSize: 17,
  },
  requirementsContainer: {
    marginBottom: 20,
    backgroundColor: "#f0f0f0",
    padding: 10,
    borderRadius: 5,
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  requirementsText: {
    fontSize: 14,
    marginBottom: 2,
  },
});

export default AddEmployeePage;
