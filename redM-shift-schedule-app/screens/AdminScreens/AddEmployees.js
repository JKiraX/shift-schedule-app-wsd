import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
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

const AddEmployeePage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [administrativePrivileges, setAdministrativePrivileges] =
    useState(false);

  const navigation = useNavigation();

  const handleAddEmployee = async () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Passwords do not match.");
      return;
    }

    const adminValue = administrativePrivileges ? 2 : 1;

    try {
      const response = await fetch(
        "http://10.2.44.68:3001/api/add-employee",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_name: name,
            email: email,
            password: newPassword,
            admin: adminValue,
          }),
        }
      );

      const responseText = await response.text();
      const contentType = response.headers.get("content-type");

      if (contentType && contentType.includes("application/json")) {
        const data = JSON.parse(responseText);
        if (response.ok) {
          Alert.alert("Employee added.", "", [
            { text: "OK", onPress: () => navigation.goBack() },
          ]);
        } else {
          Alert.alert("Error", data.error);
        }
      } else {
        throw new Error("Received non-JSON response from server");
      }
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", "Failed to add employee: " + error.message);
    }
  };

  const renderInput = (
    label,
    value,
    setValue,
    placeholder,
    keyboardType = "default",
    secureTextEntry = false
  ) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        autoCapitalize="none"
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === "ios" ? "padding" : null}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <View style={styles.formContainer}>
            {renderInput("Name", name, setName, "Enter name")}
            {renderInput(
              "E-mail",
              email,
              setEmail,
              "Enter email",
              "email-address"
            )}
            {renderInput(
              "Password",
              newPassword,
              setNewPassword,
              "Enter password",
              "default",
              true
            )}
            {renderInput(
              "Confirm Password",
              confirmPassword,
              setConfirmPassword,
              "Confirm password",
              "default",
              true
            )}

            <View style={styles.privilegesContainer}>
              <Text style={styles.label}>Administrative Privileges</Text>
              <TouchableOpacity
                style={styles.privilegesButton}
                onPress={() =>
                  setAdministrativePrivileges(!administrativePrivileges)
                }
              >
                <Text style={styles.privilegesButtonText}>
                  {administrativePrivileges ? "Yes" : "No"}
                </Text>
              </TouchableOpacity>
            </View>
            <SmallButton text={"Add Employee"} onPress={handleAddEmployee} />
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
    width: width * 0.9,
    maxWidth: 400,
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
  privilegesContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  privilegesButton: {
    backgroundColor: "gray",
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
  privilegesButtonText: {
    fontSize: 16,
    color: "white",
  },
});

export default AddEmployeePage;
