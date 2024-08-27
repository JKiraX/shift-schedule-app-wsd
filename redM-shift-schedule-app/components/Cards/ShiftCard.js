import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ShiftCard = ({ shiftName, startTime, endTime, assignedUsers }) => {
  return (
    <View style={styles.card}>
      <View style={styles.contentContainer}>
        <Text style={styles.shiftName}>{shiftName}</Text>
        <View style={styles.usersContainer}>
          {assignedUsers.map((user, index) => (
            <Text key={index} style={styles.assignedUser}>{user}</Text>
          ))}
        </View>
      </View>
      <Text style={styles.time}>{startTime} - {endTime}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'column',
    justifyContent: 'space-between',
  },
  contentContainer: {
    flex: 1,
  },
  shiftName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  usersContainer: {
    marginBottom: 8,
  },
  assignedUser: {
    fontSize: 16,
    marginBottom: 4,
  },
  time: {
    fontSize: 16,
    color: '#666',
    alignSelf: 'flex-end',
    marginTop: 8,
  },
});

export default ShiftCard;