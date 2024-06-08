import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

// Screens
import AdminHomeScreen from "../../screens/AdminScreens/AdminHome";
import AdminScheduleScreen from "../../screens/AdminScreens/AdminSchedule";
import AdminEmployeesScreen from "../../screens/AdminScreens/AdminEmployees";
import AdminProfileScreen from "../../screens/AdminScreens/AdminProfile";
import NotificationsScreen from "../../screens/notifications";
import ReportsScreen from "../../screens/report";

// Screen names
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
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "#D3D3D3",
        tabBarLabelStyle: { paddingBottom: 10, fontSize: 10 },
        tabBarStyle: { padding: 10, height: 77, backgroundColor: "#3D5A80" },
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tab.Screen
        name={AdminHome}
        component={AdminHomeScreen}
        options={{
          headerTintColor: "#3D5A80",
          headerTitleAlign: "center",
          headerRight: () => (
            <MaterialCommunityIcons
              name="bell-outline"
              size={25}
              style={{ paddingRight: 15 }}
              color="#3D5A80"
              onPress={() => navigation.navigate("Notifications")}
            />
          ),
          headerLeft: () => (
            <MaterialCommunityIcons
              name="chart-bar"
              size={25}
              style={{ paddingLeft: 15 }}
              color="#3D5A80"
              onPress={() => navigation.navigate("Reports")}
            />
          ),
        }}
      />
      <Tab.Screen
        name={AdminSchedule}
        component={AdminScheduleScreen}
        options={{ headerTintColor: "#3D5A80", headerTitleAlign: "center" }}
      />
      <Tab.Screen
        name={AdminEmployees}
        component={AdminEmployeesScreen}
        options={{
          headerTintColor: "#3D5A80",
          headerTitleAlign: "center",
          headerShown: false,
        }}
      />
      <Tab.Screen
        name={AdminProfile}
        component={AdminProfileScreen}
        options={{
          headerTintColor: "#3D5A80",
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
        name="Back"
        component={TabNavigator}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Notifications"
        component={NotificationsScreen}
        options={{ headerTintColor: "#3D5A80", headerTitleAlign: "center" }}
      />
      <Stack.Screen
        name="Reports"
        component={ReportsScreen}
        options={{ headerTintColor: "#3D5A80", headerTitleAlign: "center" }}
      />
    </Stack.Navigator>
  );
}

export default AdminNav;
