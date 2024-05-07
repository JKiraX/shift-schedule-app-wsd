import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ShiftCard = ({ shiftName, startTime, endTime, assignedUsers }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.shiftName}>{shiftName}</Text>
      {assignedUsers.map((user, index) => (
        <Text key={index}>{user}</Text>
      ))}
      <View style={styles.timeContainer}>
        <Text style={styles.time}>Start: {startTime}</Text>
        <Text style={styles.time}>End: {endTime}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#d3d3d3',
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
  },
  shiftName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  time: {
    fontSize: 16,
  },
});

export default ShiftCard;