import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';

const ShiftCard = ({ shiftName, startTime, endTime, assignedUsers }) => {
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

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f2f2f2',
    padding: 16,
    borderRadius: 15,
    marginVertical: 8,
    width: width * 0.9,
    maxWidth: 350,
    alignSelf: 'center',
  },
  shiftName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  assignedUsers: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  time: {
    fontSize: 14,
  },
});

export default ShiftCard;