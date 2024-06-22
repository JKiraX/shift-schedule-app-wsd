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
        'http://192.168.5.61:3001/api/add-employee',
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_name: name,
            email: email,
            password: newPassword,
            admin: adminValue
          }),
        }
      );

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);
      const responseText = await response.text();
      console.log("Response body:", responseText);

      const contentType = response.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = JSON.parse(responseText);
        if (response.ok) {
          Alert.alert("Employee added.", "", [
            {
              text: "OK",
              onPress: () => navigation.goBack(),
            },
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

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : null}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContainer}>
          <View style={styles.formContainer}>
            <Text style={styles.label}>Name</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={(text) => setName(text)}
              placeholder="Enter name"
            />
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholder="Enter email"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter password"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Confirm Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Confirm password"
                secureTextEntry
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                autoCapitalize="none"
              />
            </View>

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "stretch",
    justifyContent: "space-evenly",
    backgroundColor: "white",
  },
  scrollViewContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  formContainer: {
    padding: 20,
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
    width: "auto",
    fontSize: 17,
    marginBottom: 18,
  },
  inputContainer: {
    marginBottom: 20,
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
  },
  privilegesButtonText: {
    fontSize: 16,
    color: "white",
  },
  addButton: {
    backgroundColor: "blue",
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    fontSize: 16,
    color: "white",
  },
});

export default AddEmployeePage;
