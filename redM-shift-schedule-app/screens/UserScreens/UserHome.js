import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import CalendarStrip from 'react-native-calendar-strip';
import moment from 'moment';

export default function UserHomeScreen({ navigation }) {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const onDateSelected = (date) => {
    setSelectedDate(date);
  };

  const markedDatesFunc = (date) => {
    const currentDate = moment().startOf('day');
    const selectedMoment = moment(selectedDate).startOf('day');
    const dateMoment = moment(date).startOf('day');

    if (dateMoment.isSame(currentDate)) {
      return {
        dots: [
          {
            color: selectedMoment && dateMoment.isSame(selectedMoment) ? '#E6F2FF' : 'red',
            selectedColor: '#E6F2FF',
          },
        ],
      };
    }

    if (selectedMoment && dateMoment.isSame(selectedMoment)) {
      return {
        style: {
          container: {
            backgroundColor: '#E6F2FF',
          },
          text: {
            color: 'black',
            fontWeight: 'bold',
          },
        },
      };
    }

    return {};
  };

  const canScrollToDate = (date) => {
    const currentDate = moment().startOf('day');
    const dateMoment = moment(date).startOf('day');
    return dateMoment.isSameOrAfter(currentDate);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <CalendarStrip
          scrollable
          style={styles.calendarStrip}
          calendarHeaderStyle={styles.calendarHeader}
          calendarColor={'white'}
          dateNumberStyle={styles.dateNumber}
          dateNameStyle={styles.dateName}
          iconContainer={styles.iconContainer}
          selectedDate={selectedDate}
          onDateSelected={onDateSelected}
          markedDatesFunc={markedDatesFunc}
          datesBlacklist={(date) => !canScrollToDate(date)}
          dayContainerStyle={styles.dayContainer}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  calendarStrip: {
    height: 150,
    paddingTop: 20,
    paddingBottom: 10,
  },
  calendarHeader: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  dateNumber: {
    color: 'black',
    fontSize: 20,
    fontWeight: 'normal',
  },
  dateName: {
    color: 'black',
    fontSize: 14,
    marginTop: 5,
  },
  iconContainer: {
    flex: 0.1,
  },
  dayContainer: {
    flexDirection: 'column',
    alignItems: 'center',
  },
});
