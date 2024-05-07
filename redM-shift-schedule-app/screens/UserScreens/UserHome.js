import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import ShiftCard from '../../components/Cards/ShiftCard';
 
const UserHomeScreen = ({ navigation }) => {
  const [shiftData, setShiftData] = useState([]);
 
  useEffect(() => {
    // Fetch shift data from the database
    fetchShiftData();
  }, []);
 
  const fetchShiftData = async () => {
    try {
      // Replace this with your actual database query logic
      const data = [
        {
          shiftName: '6am Shift',
          startTime: '06:00',
          endTime: '14:00',
          assignedUsers: ['User 1', 'User 2'],
        },
        {
          shiftName: '8am Shift',
          startTime: '08:00',
          endTime: '16:00',
          assignedUsers: ['User 3', 'User 4'],
        },
        {
          shiftName: '2pm Shift',
          startTime: '14:00',
          endTime: '22:00',
          assignedUsers: ['User 1', 'User 2'],
        },
 
        {
          shiftName: '10pm Shift',
          startTime: '22:00',
          endTime: '06:00',
          assignedUsers: ['User 1', 'User 2'],
        },
        // Add more shift data objects as needed
      ];
 
      setShiftData(data);
    } catch (error) {
      console.error('Error fetching shift data:', error);
    }
  };
 
  return (
    <View style={styles.container}>
   
      {shiftData.map((shift, index) => (
        <ShiftCard
          key={index}
          shiftName={shift.shiftName}
          startTime={shift.startTime}
          endTime={shift.endTime}
          assignedUsers={shift.assignedUsers}
        />
      ))}
    </View>
  );
};
 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'left',
    justifyContent: 'left',
    padding: 20,
  },
});
 
export default UserHomeScreen;