import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
 
const AddEmployeePage = () => {
  const [name, setName] = useState('');
  const [contact, setContact] = useState('');
  const [email, setEmail] = useState('');
  const [administrativePrivileges, setAdministrativePrivileges] = useState(false);
 
  const handleAddEmployee = () => {
    // Add employee logic here
    console.log('Add employee button pressed');
  };
 
  return (
    <View style={styles.container}>
      <Text style={styles.time}>{'9:41'}</Text>
      <View style={styles.formContainer}>
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
        <Text style={styles.label}>E-mail</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={(text) => setEmail(text)}
          placeholder="Enter email"
        />
        <View style={styles.privilegesContainer}>
          <Text style={styles.label}>Administrative Privileges</Text>
          <TouchableOpacity
            style={styles.privilegesButton}
            onPress={() => setAdministrativePrivileges(!administrativePrivileges)}
          >
            <Text style={styles.privilegesButtonText}>
              {administrativePrivileges? 'Yes' : 'No'}
            </Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.addButton} onPress={handleAddEmployee}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  time: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  formContainer: {
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
  privilegesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  privilegesButton: {
    backgroundColor: 'gray',
    padding: 10,
    borderRadius: 5,
  },
  privilegesButtonText: {
    fontSize: 16,
    color: 'white',
  },
  addButton: {
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    fontSize: 16,
    color: 'white',
  },
});
 
export default AddEmployeePage;