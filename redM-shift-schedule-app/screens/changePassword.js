import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  Alert,
  Dimensions,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import ContinueButton from "../components/Buttons/ContinueButton";

const { width } = Dimensions.get("window");

const ChangePasswordScreen = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New password and confirm password do not match");
    } else {
      Alert.alert("Success", "Password changed successfully");
      // Handle password change logic here
    }
  };

  const renderInputField = (label, value, setValue, placeholder) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        secureTextEntry
        value={value}
        onChangeText={setValue}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          {renderInputField(
            "Current Password",
            currentPassword,
            setCurrentPassword,
            "Enter current password"
          )}
          {renderInputField(
            "New Password",
            newPassword,
            setNewPassword,
            "Enter new password"
          )}
          {renderInputField(
            "Confirm New Password",
            confirmPassword,
            setConfirmPassword,
            "Confirm new password"
          )}
          <ContinueButton text="Change password" onPress={handleChangePassword} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  inputContainer: {
    marginBottom: 18,
    width: "100%",
    maxWidth: width * 9,
  },
  label: {
    fontSize: 16,
    marginBottom: 6,
    fontWeight: "600",
  },
  input: {
    height: 55,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: "#e9ecef",
    width: "100%",
    fontSize: 16,
  },
});

export default ChangePasswordScreen;