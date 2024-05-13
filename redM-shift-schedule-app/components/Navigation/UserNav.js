import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

//Screens
import UserHomeScreen from "../../screens/UserScreens/UserHome";
import UserScheduleScreen from "../../screens/UserScreens/UserSchedule";
import UserRequestLeaveScreen from "../../screens/UserScreens/UserRequestLeave";
import UserProfileScreen from "../../screens/UserScreens/UserProfile";
import NotificationsScreen from "../../screens/notifications";

//Screen names
const UserHome = "Home";
const UserSchedule = "Schedule";
const UserRequestLeave = "Request Leave";
const UserProfile = "Profile";


const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function UserNav() {
  return (
    <Tab.Navigator
      initialRouteName={UserHome}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let rn = route.name;
          if (rn === UserHome) {
            iconName = focused ? "home" : "home-outline";
          } else if (rn === UserSchedule) {
            iconName = focused ? "calendar" : "calendar-outline";
          } else if (rn === UserRequestLeave) {
            iconName = focused ? "note-edit-outline" : "note-edit-outline";
          } else if (rn === UserProfile) {
            iconName = focused ? "account" : "account-outline";
          }
          return (
            <MaterialCommunityIcons name={iconName} size={size} color={color} />
          );
        },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "#D3D3D3",
        tabBarLabelStyle: { paddingBottom: 10, fontSize: 10 },
        tabBarStyle: { padding: 10, height: 77, backgroundColor: "#3D5A80" },
      })}
    >
      <Tab.Screen
        name={UserHome}
        component={UserHomeScreen}
        options={{ headerTintColor: "#3D5A80", headerTitleAlign: "center" }}
      />
      <Tab.Screen
        name={UserSchedule}
        component={UserScheduleScreen}
        options={{ headerTintColor: "#3D5A80", headerTitleAlign: "center" }}
      />
      <Tab.Screen
        name={UserRequestLeave}
        component={UserRequestLeaveScreen}
        options={{ headerTintColor: "#3D5A80", headerTitleAlign: "center" }}
      />
      <Tab.Screen
        name={UserProfile}
        component={UserProfileScreen}
        options={{ headerTintColor: "#3D5A80", headerTitleAlign: "center" }}
      />
    </Tab.Navigator>
  );
}

export default UserNav;
