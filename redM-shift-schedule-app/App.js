import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
<<<<<<< HEAD
import UserNav from './components/Navigation/UserNav';
//import AdminNav from './components/Navigation/AdminNav';
 
=======
//import UserNav from './components/Navigation/UserNav';
import AdminNav from './components/Navigation/AdminNav';

>>>>>>> 2ed4825b50043cadcabd54d9328802cc8c14b371
export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <AdminNav/>
    </NavigationContainer>
  );
}