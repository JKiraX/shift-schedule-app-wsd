import React, { useState, useEffect, useCallback } from 'react';
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import ShiftCard from '../../components/Cards/ShiftCard';
import DropdownComponent from '../../components/Dropdown/dropdownComponent';
import moment from 'moment';

const { width, height } = Dimensions.get('window');

const UserScheduleScreen = () => {
  const [selectedDates, setSelectedDates] = useState({});
  const [shiftData, setShiftData] = useState([]);
  const [markedDates, setMarkedDates] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [allUsers, setAllUsers] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (Object.keys(selectedDates).length > 0 && allUsers.length > 0) {
      fetchShiftData();
    } else {
      setShiftData([]);
    }
  }, [selectedDates, selectedUser, allUsers]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://10.2.44.68:3001/users');
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      const formattedUsers = data.map(user => ({
        key: user.user_id?.toString() ?? `unknown-${Math.random()}`,
        value: user.user_name ?? 'Unknown User',
      }));
      setAllUsers(formattedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchShiftData = async () => {
    try {
      const dates = Object.keys(selectedDates).join(',');
      const userId = selectedUser ? selectedUser.key : null;
      const queryParams = `?dates=${dates}${userId ? `&userId=${userId}` : ''}`;
      const response = await fetch(`http://10.2.44.68:3001/api/schedules${queryParams}`);
      if (!response.ok) throw new Error(`Network response was not ok: ${response.status}`);
      const data = await response.json();
      setShiftData(data);
    } catch (error) {
      console.error('Error fetching shift data:', error.message);
    }
  };

  const handleSelect = (selected) => {
    const selectedUser = allUsers.find(user => user.value === selected);
    setSelectedUser(selectedUser);
  };

  const handleDayPress = useCallback((day) => {
    const dateString = day.dateString;
    const newSelectedDates = { ...selectedDates };

    if (newSelectedDates[dateString]) {
      delete newSelectedDates[dateString];
    } else {
      newSelectedDates[dateString] = { selected: true, marked: true, dotColor: '#c82f2f' };
    }

    setSelectedDates(newSelectedDates);
    setMarkedDates(newSelectedDates);
  }, [selectedDates]);

  const groupShiftsByDate = useCallback((shifts) => {
    return shifts.reduce((acc, shift) => {
      const date = shift.date ? moment(shift.date).format('YYYY-MM-DD') : null;
      if (date) {
        if (!acc[date]) acc[date] = [];
        const shiftId = `${date}-${shift.user_id}-${shift.start_time}`;
        acc[date].push({ ...shift, shiftId });
      }
      return acc;
    }, {});
  }, []);

  const groupedShiftData = groupShiftsByDate(shiftData);

  const renderShifts = (date, groupedShiftData, selectedUser, allUsers) => {
    if (selectedUser) {
      const userShifts = groupedShiftData[date]?.filter(shift => shift.user_id === selectedUser.key);
      if (userShifts && userShifts.length > 0) {
        return userShifts.map(shift => (
          <ShiftCard
            key={shift.shiftId}
            shiftId={shift.shiftId}
            shiftName={shift.shift_name}
            startTime={shift.start_time}
            endTime={shift.end_time}
            assignedUsers={shift.user_name}
            allUsers={allUsers}
          />
        ));
      } else {
        return <Text style={styles.noShiftsText}>No shifts available: On leave</Text>;
      }
    } else if (groupedShiftData[date]?.length > 0) {
      return groupedShiftData[date].map(shift => (
        <ShiftCard
          key={shift.shiftId}
          shiftId={shift.shiftId}
          shiftName={shift.shift_name}
          startTime={shift.start_time}
          endTime={shift.end_time}
          assignedUsers={shift.user_name}
          allUsers={allUsers}
        />
      ));
    } else {
      return <Text style={styles.noShiftsText}>No shifts available</Text>;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <DropdownComponent
        data={allUsers}
        onSelect={(selected) => handleSelect(selected)}
      />
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 0 && styles.selectedTab]}
          onPress={() => setSelectedTab(0)}
        >
          <Text style={[styles.tabText, selectedTab === 0 && styles.selectedTabText]}>
            Shifts
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 1 && styles.selectedTab]}
          onPress={() => setSelectedTab(1)}
        >
          <Text style={[styles.tabText, selectedTab === 1 && styles.selectedTabText]}>
            Leave
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <Calendar
          style={styles.calendar}
          enableSwipeMonths={true}
          hideExtraDays={true}
          markingType="multi-dot"
          markedDates={markedDates}
          onDayPress={handleDayPress}
        />
        {Object.keys(selectedDates).map((date) => (
          <View key={date} style={styles.dateContainer}>
            <Text style={styles.dateHeader}>{moment(date).format('LL')}:</Text>
            {renderShifts(date, groupedShiftData, selectedUser, allUsers)}
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'white',
    paddingTop: Platform.OS === 'android' ? 25 : 0,
  },
  scrollViewContent: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  tabContainer: {
    width: '90%',
    height: 60,
    backgroundColor: 'white',
    borderWidth: 0.5,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 5,
    marginTop: 10,
    marginBottom: 10,
  },
  tabButton: {
    width: '48%',
    height: 50,
    backgroundColor: 'white',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedTab: {
    backgroundColor: 'rgba(200, 47, 47, 0.8)',
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  selectedTabText: {
    color: 'white',
  },
  calendar: {
    width: '90%',
    borderRadius: 15,
    marginBottom: 10,
  },
  dateContainer: {
    width: '90%',
    padding: 10,
    marginBottom: 10,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  noShiftsText: {
    fontSize: 16,
    color: 'gray',
  },
});

export default UserScheduleScreen;