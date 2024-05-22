import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    // Here you can implement the logic to send a reset password link to the provided email
    if (email.trim() === '') {
      Alert.alert('Error', 'Please enter your email.');
      return;
    }

    // Your logic to send the reset password link goes here
    // For example, you can call an API to send a reset password email

    // Display a confirmation message to the user
    Alert.alert('Reset Password', 'A password reset link has been sent to your email.');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Forgot your Password</Text>
      <Text style={styles.description}>Enter your email associated with the account</Text>
      <TextInput
        style={styles.input}
        placeholder="Email address"
        onChangeText={(text) => setEmail(text)}
        value={email}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <View style={styles.signInContainer}>
        <Text style={styles.signInText}>Remember your password? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
          <Text style={[styles.signInText, styles.signInLink]}>Sign in</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Reset Password</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#3D5A80',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginVertical: 20 
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '300',
  },
  signInContainer: {
    flexDirection: 'row',
    alignItems: 'center'

  }
});

export default ForgotPasswordScreen;

