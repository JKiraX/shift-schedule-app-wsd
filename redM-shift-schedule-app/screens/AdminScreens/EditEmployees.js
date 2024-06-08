import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import SmallButton from '../../components/Buttons/smallButton';
import { SafeAreaView } from 'react-native-safe-area-context';

const EditEmployeeScreen = () => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const navigation = useNavigation(); // Add this line to get the navigation object

  const handleUpdate = () => {
    // Add employee logic here
    console.log("Employee details updated.");
    Alert.alert("Employee details updated.", "", [
      {
        text: "OK",
        onPress: () => navigation.goBack(),
      },
    ]);

    // Validate the input values (optional)
    if (!name || !contact || !email) {
      Alert.alert('Please fill in all fields.');
      return;
    }

    // Update the employee data (replace this with your actual update logic)
    const employeeData = { name, contact, email };
    updateEmployee(employeeData);

    // Clear the input fields (optional)
    setName('');
    setContact('');
    setEmail('');
  };

  return (
    <SafeAreaView style={styles.container}>
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
        <SmallButton text={"Update"} onPress={handleUpdate}/>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
});

export default EditEmployeeScreen;
