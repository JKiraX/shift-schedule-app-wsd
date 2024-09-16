import * as React from "react";
import { Platform } from 'react-native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

import AdminHomeScreen from "../../screens/AdminScreens/AdminHome";
import AdminScheduleScreen from "../../screens/AdminScreens/AdminSchedule";
import AdminEmployeesScreen from "../../screens/AdminScreens/AdminEmployees";
import AdminProfileScreen from "../../screens/AdminScreens/AdminProfile";
import NotificationsScreen from "../../screens/notifications";

const AdminHome = "Home";
const AdminSchedule = "Schedule";
const AdminEmployees = "Employees";
const AdminProfile = "Profile";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  const navigation = useNavigation();

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
        tabBarActiveTintColor: "#c82f2f",
        tabBarInactiveTintColor: "#909090",
        tabBarLabelStyle: { 
          fontSize: 10,
          marginBottom: Platform.OS === 'ios' ? 0 : 5,
        },
        tabBarStyle: { 
          height: Platform.OS === 'ios' ? 90 : 60,
          paddingTop: Platform.OS === 'ios' ? 10 : 5,
          paddingBottom: Platform.OS === 'ios' ? 30 : 5,
          backgroundColor: "white",
        },
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tab.Screen
        name={AdminHome}
        component={AdminHomeScreen}
        options={{
          headerTintColor: "#c82f2f",
          headerTitleAlign: "center",
          headerRight: () => (
            <MaterialCommunityIcons
              name="bell-outline"
              size={25}
              style={{ paddingRight: 15 }}
              color="#909090"
              onPress={() => navigation.navigate("Notifications")}
            />
          ),
 
        }}
      />
      <Tab.Screen
        name={AdminSchedule}
        component={AdminScheduleScreen}
        options={{ headerTintColor: "#c82f2f", headerTitleAlign: "center" }}
      />
      <Tab.Screen
        name={AdminEmployees}
        component={AdminEmployeesScreen}
        options={{
          headerTintColor: "#c82f2f",
          headerTitleAlign: "center",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name={AdminProfile}
        component={AdminProfileScreen}
        options={{
          headerTintColor: "#c82f2f",
          headerTitleAlign: "center",
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

function AdminNav() {
  return (
    <Stack.Navigator initialRouteName="MainTabs">
      <Stack.Screen
        name="MainTabs"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ headerTintColor: "#c82f2f", headerTitleAlign: "center" }}
      />

    </Stack.Navigator>
  );
}

export default AdminNav;