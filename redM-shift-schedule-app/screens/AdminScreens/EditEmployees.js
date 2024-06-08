import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
 
const EditEmployeeScreen = () => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
 
  const handleUpdate = () => {
    // Get the values from the input fields
    const employeeData = { name, contact, email };
 
    // Validate the input values (optional)
    if (!employeeData.name || !employeeData.contact || !employeeData.email) {
      alert('Please fill in all fields.');
      return;
    }
 
    // Update the employee data (replace this with your actual update logic)
    updateEmployee(employeeData);
 
    // Clear the input fields (optional)
    setName('');
    setContact('');
    setEmail('');
  };
 
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Name</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={(text) => setName(text)}
        placeholder="Enter name"
      />
      <Text style={styles.label}>Contact</Text>
      <TextInput
        style={styles.input}
        value={contact}
        onChangeText={(text) => setContact(text)}
        placeholder="Enter contact"
      />
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={(text) => setEmail(text)}
        placeholder="Enter email"
      />
      <TouchableOpacity style={styles.button} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Update</Text>
      </TouchableOpacity>
    </View>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 16,
    color: 'white',
  },
});
 
export default EditEmployeeScreen;