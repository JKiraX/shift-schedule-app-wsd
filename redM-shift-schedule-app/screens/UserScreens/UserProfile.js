import React from 'react';
import { View, Text, TextInput, Button, StyleSheet, SafeAreaView, Alert } from 'react-native';
//import SmallButton from "../../components/Buttons/smallButton";

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
          placeholder="Enter your name" 
          editable={false} 
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Contact Number</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Enter your contact number" 
          keyboardType="phone-pad" 
          editable={false} 
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput 
          style={styles.input} 
          placeholder="Enter your email" 
          keyboardType="email-address" 
          editable={false} 
        />
      </View>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,

    alignItems: 'center',
  },
  inputContainer: {
    marginBottom: 12,
    width: '80%',
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    backgroundColor: '#e9ecef',
    width: '100%',
  },
  buttonContainer: {
    backgroundColor: "#3D5A80",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginBottom: 10,
    alignSelf: "center",
    width: '80%',
  },
  smallButton: {
    backgroundColor: "#3D5A80",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: '80%',
  }
});

export default ProfileScreen;
