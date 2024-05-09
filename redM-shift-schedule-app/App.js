import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import UserNav from './components/Navigation/UserNav';
// import AdminNav from './components/Navigation/AdminNav';
 
export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <UserNav/>
    </NavigationContainer>
  );
}