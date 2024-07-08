import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ShiftCard = ({ shiftId,
  shiftName,
  startTime,
  endTime,
  assignedUsers,
  allUsers, }) => {
  return (
    <View style={styles.card}>
      <Text style={styles.shiftName}>{shiftName}</Text>
      <Text style={styles.assignedUsers}>{assignedUsers}</Text>
      <View style={styles.timeContainer}>
        <Text style={styles.time}>Start: {startTime}</Text>
        <Text style={styles.time}>End: {endTime}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f2f2f2",
    padding: 16,
    borderRadius: 15,
    marginVertical: 8,
    width: 350,
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
    fontSize: 14,
  },
  assignedUsers: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ShiftCard;