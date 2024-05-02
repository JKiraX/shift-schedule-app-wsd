import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";

//Screens
import AdminHomeScreen from "../../screens/AdminScreens/AdminHome";
import AdminScheduleScreen from "../../screens/AdminScreens/AdminSchedule";
import AdminEmployeesScreen from "../../screens/AdminScreens/AdminEmployees";
import AdminProfileScreen from "../../screens/AdminScreens/AdminProfile";
//Screen names
const AdminHome = "Home";
const AdminSchedule = "Schedule";
const AdminEmployees = "Employees";
const AdminProfile = "Profile";

const Tab = createBottomTabNavigator();

function AdminNav() {
  return (
    <Tab.Navigator
      initialRouteName={AdminHome}
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let rn = route.name;
          if (rn === AdminHome) {
            iconName = focused ? "home" : "home-outline";
          } else if (rn === AdminSchedule) {
            iconName = focused ? "calendar" : "calendar-outline";
          } else if (rn === AdminEmployees) {
            iconName = focused ? "account-group" : "account-group-outline";
          } else if (rn === AdminProfile) {
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
        name={AdminHome}
        component={AdminHomeScreen}
        options={{ headerTintColor: "#3D5A80" }}
      />
      <Tab.Screen
        name={AdminSchedule}
        component={AdminScheduleScreen}
        options={{ headerTintColor: "#3D5A80" }}
      />
      <Tab.Screen
        name={AdminEmployees}
        component={AdminEmployeesScreen}
        options={{ headerTintColor: "#3D5A80" }}
      />
      <Tab.Screen
        name={AdminProfile}
        component={AdminProfileScreen}
        options={{ headerTintColor: "#3D5A80" }}
      />
    </Tab.Navigator>
  );
}

export default AdminNav;
