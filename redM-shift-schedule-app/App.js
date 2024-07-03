import { StatusBar } from "expo-status-bar";
import * as React from "react";
import { NavigationContainer } from "@react-navigation/native";
import UserNav from "./components/Navigation/UserNav";
// import AdminNav from './components/Navigation/AdminNav';
// import AppLogin from "./screens/LogInScreens/loginscreen"; 
// import { AuthProvider } from "../server/AuthProvider";
export default function App() {
  return (
    // <AuthProvider>
    <NavigationContainer>
      <StatusBar style="auto" />
      <UserNav />
    </NavigationContainer>
    // </AuthProvider>
  );
}