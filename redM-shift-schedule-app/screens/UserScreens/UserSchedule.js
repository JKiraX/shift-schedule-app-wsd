import * as React from "react";
import { Text, TouchableOpacity, View, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DropdownComponent from "../../components/Dropdown/dropdownComponent";
import {Calendar} from "react-native-calendars" 


export default function UserScheduleScreen({ navigation }) {
  //data for the DropdownComponent
  const data = [
    { key: "1", value: "Yusheen" },
    { key: "2", value: "Roxanne" },
    { key: "3", value: "Hope" },
    { key: "4", value: "Mpho" },
    { key: "5", value: "Charlotte" },
  ];

  const handleSelect = (selected) => {
    console.log(selected);
  };

  // Switch Button
  const [selectedTab, setSelectedTab] = React.useState(0);

  return (
    <SafeAreaView style={{ flex: 1, alignItems: "center" }}>
    
    {/* dropdown */}
      <DropdownComponent data={data} onSelect={handleSelect} />
    {/* switch and shift buttons */}
      <View
        style={{
          width: 350,
          height: 60,
          backgroundColor: "white",
          borderWidth: 0.5,
          borderRadius: 15,
          flexDirection: "row",
          alignItems: "center",
          paddingLeft: 5,
          paddingRight: 5,
          marginTop: 10,
        }}
      >
        <TouchableOpacity
          style={{
            width: "45%",
            height: 50,
            backgroundColor: selectedTab === 0 ? "#98C1D9" : "white",
            borderRadius: 15,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => setSelectedTab(0)}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Shifts</Text>
        </TouchableOpacity>
        <View style={{ width: "10%" }} />
        <TouchableOpacity
          style={{
            width: "45%",
            height: 50,
            backgroundColor: selectedTab === 1 ? "#98C1D9" : "white",
            borderRadius: 15,
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => setSelectedTab(1)}
        >
          <Text style={{ fontSize: 18, fontWeight: "bold" }}>Leave</Text>
        </TouchableOpacity>
      </View>
      {/* Switch between shift and leave calander "pages"*/}
      {selectedTab == 0 ? (
        // Shifts Page
        <ScrollView style={{flex: 1, alignItems: "center", paddingTop: 10}}>
          <Calendar
            style = {{width: 350, borderRadius:15}}
            enableSwipeMonths = {true}
            markingType= "period"
          />
        </ScrollView>
      ) : (
        // Leave Page
        <ScrollView >
          <View style={{flex: 1, alignItems: "center", paddingTop: 10}}>
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}
