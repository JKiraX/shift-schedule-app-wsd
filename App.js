import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserNav from "./redM-shift-schedule-app/components/Navigation/UserNav";
import AdminNav from './redM-shift-schedule-app/components/Navigation/AdminNav';
import AdminNav1 from "./redM-shift-schedule-app/components/Navigation/AdminNav1";
import AppLogin from "./redM-shift-schedule-app/screens/LogInScreens/loginscreen";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={AppLogin} />
        <Stack.Screen name="AdminNav" component={AdminNav} />
        <Stack.Screen name="AdminNav1" component={AdminNav1} />
        <Stack.Screen name="UserNav" component={UserNav} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}