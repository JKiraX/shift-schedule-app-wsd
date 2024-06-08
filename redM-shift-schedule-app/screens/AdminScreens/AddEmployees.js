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
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [administrativePrivileges, setAdministrativePrivileges] =
    useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigation = useNavigation();

  const handleAddEmployee = () => {
    // Add employee logic here
    console.log("Add employee button pressed");
    Alert.alert("Employee added.", "", [
      {
        text: "OK",
        onPress: () => navigation.goBack(),
      },
    ]);
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
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={contact}
              onChangeText={(text) => setContact(text)}
              placeholder="Enter phone number"
            />
            <Text style={styles.label}>E-mail</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholder="Enter email"
              keyboardType="email-address"
            />

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter password"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
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
