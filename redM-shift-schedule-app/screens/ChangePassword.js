import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, Alert } from 'react-native';
import ContinueButton from "../../shift-schedule-app-wsd/redM-shift-schedule-app/components/Buttons/ContinueButton"

const ChangePasswordScreen = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleChangePassword = () => {
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New password and confirm password do not match");
    } else {
      Alert.alert("Success", "Password changed successfully");
      // Handle password change logic here
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Current Password</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Enter current password" 
          secureTextEntry
          value={currentPassword}
          onChangeText={setCurrentPassword}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>New Password</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Enter new password" 
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Confirm New Password</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Confirm new password" 
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
      </View>

      <ContinueButton
        text="Change password"
        onPress={handleChangePassword}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: "center",
  },
  inputContainer: {
    marginBottom: 18,
    width: 350,
    borderRadius: 15,
  },
  label: {
    fontSize: 18,
    marginBottom: 6,
  },
  input: {
    height: 55,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#e9ecef',
    width: '100%',
    fontSize: 17,
  },
  button: {
    marginBottom: 20,
  },
});

export default ChangePasswordScreen;
