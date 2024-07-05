import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SmallButton from '../../components/Buttons/smallButton';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const EditEmployeeScreen = () => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const navigation = useNavigation();

  const handleUpdate = () => {
    if (!name || !contact || !email) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    // Update the employee data (replace this with your actual update logic)
    const employeeData = { name, contact, email };
    updateEmployee(employeeData);

    Alert.alert("Success", "Employee details updated.", [
      { text: "OK", onPress: () => navigation.goBack() },
    ]);

    // Clear the input fields
    setName('');
    setContact('');
    setEmail('');
  };

  const renderInputField = (label, value, setValue, placeholder, keyboardType = 'default') => (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={setValue}
        placeholder={placeholder}
        keyboardType={keyboardType}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.formContainer}>
        {renderInputField('Name', name, setName, 'Enter name')}
        {renderInputField('Phone Number', contact, setContact, 'Enter phone number', 'phone-pad')}
        {renderInputField('E-mail', email, setEmail, 'Enter email', 'email-address')}
        <SmallButton text="Update" onPress={handleUpdate} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  formContainer: {
    padding: width * 0.05,
    alignItems: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: height * 0.02,
  },
  label: {
    fontSize: 18,
    marginBottom: height * 0.01,
  },
  input: {
    height: height * 0.07,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 10,
    padding: width * 0.03,
    backgroundColor: "#e9ecef",
    width: '100%',
    fontSize: 17,
  },
});

export default EditEmployeeScreen;