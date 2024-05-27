import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const SwitchButton = ({ text, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text style={styles.buttonText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
};

const ShiftCardChange = ({ shiftName, startTime, endTime, assignedUsers }) => {
  const handleSwitchPress = () => {
    console.log("Switch");
  };

  return (
    <View style={styles.card}>
      <Text style={styles.shiftName}>{shiftName}</Text>
      {assignedUsers.map((user, index) => (
        <Text key={index}>{user}</Text>
      ))}
      <View style={styles.timeContainer}>
        <Text style={styles.time}>Start: {startTime}</Text>
        <Text style={styles.time}>End: {endTime}</Text>
        <SwitchButton text="Switch" onPress={handleSwitchPress} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#d3d3d3',
    padding: 16,
    borderRadius: 15,
    marginVertical: 8,
    width:350,
    alignItems:"stretch"

  },
  shiftName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  time: {
    fontSize: 16,
  },
  button: {
    borderRadius: 15,
    paddingVertical: 16,
    paddingHorizontal: 15,
    backgroundColor: "#3D5A80",
  },
  buttonText: {
    color: "white",
    fontWeight: "semi-bold",
    textTransform: "uppercase",
    fontSize: 16,
    textAlign: "center",
  },
});

export default ShiftCardChange;