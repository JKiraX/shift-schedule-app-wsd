import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

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
    padding: width * 0.04,
    borderRadius: 15,
    marginVertical: height * 0.01,
    width: width * 0.9,
    maxWidth: 400,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  shiftName: {
    fontSize: width * 0.045,
    fontWeight: 'bold',
    marginBottom: height * 0.01,
  },
  assignedUsers: {
    fontSize: width * 0.04,
    color: '#555',
  },
  
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: height * 0.015,
  },
  time: {
    fontSize: width * 0.04,
    fontSize: 14,
  },
  assignedUsers: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default ShiftCard;