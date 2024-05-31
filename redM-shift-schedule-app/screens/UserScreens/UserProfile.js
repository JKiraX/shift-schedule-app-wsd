import React from 'react';
import { View, Text, TextInput, StyleSheet, SafeAreaView, Alert } from 'react-native';
import SmallButton from "../../components/Buttons/smallButton";
import ContinueButton from "../../components/Buttons/ContinueButton";

const ProfileScreen = () => {
  const handleChangePassword = () => {
    Alert.alert("Change Password", "Change Password button pressed");
  };

  const handleLogout = () => {
    Alert.alert("Logout", "Logout button pressed");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Name</Text>
        <TextInput 
          style={styles.input} 
          placeholder="User's full name" 
          editable={false} 
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Contact Number</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Users phone number" 
          editable={false} 
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Users email" 
          keyboardType="email-address" 
          editable={false} 
        />
      </View>

      <ContinueButton
        text="Change Password"
        onPress={handleChangePassword}
        style={styles.button} // Add this line to apply the button style
      />
      <SmallButton
        text="Logout"
        onPress={handleLogout}
        style={styles.button} // Add this line to apply the button style
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
    marginBottom: 20, // Add space between buttons
  },
});

export default ProfileScreen;
