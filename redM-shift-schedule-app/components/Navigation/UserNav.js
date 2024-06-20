import * as React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useNavigation } from "@react-navigation/native";

// Screens
import UserHomeScreen from "../../screens/UserScreens/UserHome";
import UserScheduleScreen from "../../screens/UserScreens/UserSchedule";
import UserRequestLeaveScreen from "../../screens/UserScreens/UserReportLeave";
import UserProfileScreen from "../../screens/UserScreens/UserProfile";
import NotificationsScreen from "../../screens/notifications";

// Screen names
const UserHome = "Home";
const UserSchedule = "Schedule";
const UserRequestLeave = "Report Leave";
const UserProfile = "Profile";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function TabNavigator() {
  const navigation = useNavigation();

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
        tabBarActiveTintColor: "#c82f2f",
        tabBarInactiveTintColor: "#909090",
        tabBarLabelStyle: { paddingBottom: 10, fontSize: 10 },
        tabBarStyle: { padding: 10, height: 77, backgroundColor: "white" },
        tabBarHideOnKeyboard: true,
      })}
    >
      <Tab.Screen
        name={UserHome}
        component={UserHomeScreen}
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
        name={UserSchedule}
        component={UserScheduleScreen}
        options={{ headerTintColor: "#c82f2f", headerTitleAlign: "center" }}
      />
      <Tab.Screen
        name={UserRequestLeave}
        component={UserRequestLeaveScreen}
        options={{ headerTintColor: "#c82f2f", headerTitleAlign: "center" }}
      />
      <Tab.Screen
        name={UserProfile}
        component={UserProfileScreen}
        options={{
          headerTintColor: "#c82f2f",
          headerTitleAlign: "center",
          headerShown: false,
        }}
      />
    </Tab.Navigator>
  );
}

function UserNav() {
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
        options={{ headerTintColor: "#c82f2f", headerTitleAlign: "center" }}
      />
    </Stack.Navigator>
  );
}

export default UserNav;
