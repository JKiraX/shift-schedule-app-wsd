import React, { useState, useEffect } from "react";
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
import * as SecureStore from 'expo-secure-store';
import apiClient from "../../server/aspApiRoutes";

const { width } = Dimensions.get("window");

const ChangePasswordScreen = () => {
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const fetchEmail = async () => {
      const storedEmail = await SecureStore.getItemAsync('email');
      if (storedEmail) {
        setEmail(storedEmail);
      }
    };
    fetchEmail();
  }, []);

  const handleChangePassword = async () => {
    try {
      const response = await apiClient.put("/api/authentication/update-password", {
        email,
        oldPassword,
        newPassword
      });

      if (response.status === 200) {
        Alert.alert("Success", "Password changed successfully",[
          { text: "OK", onPress: () => navigation.goBack() },
        ]);
        setOldPassword("");
        setNewPassword("");
        
      } else {
        throw new Error("Failed to change password");
      }
    } catch (error) {
      console.error("Change password failed:", error);
      let errorMessage = "An unexpected error occurred. Please try again.";
      if (error.response && error.response.data && error.response.data.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      Alert.alert("Change Password Failed", errorMessage);
    }
  };

  const renderInputField = (label, value, setValue, placeholder, secureTextEntry = true) => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
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
            "Email",
            email,
            setEmail,
            "Your email",
            false
          )}
          {renderInputField(
            "Old Password",
            oldPassword,
            setOldPassword,
            "Enter old password"
          )}
          {renderInputField(
            "New Password",
            newPassword,
            setNewPassword,
            "Enter new password"
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
    maxWidth: width * 0.9,
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