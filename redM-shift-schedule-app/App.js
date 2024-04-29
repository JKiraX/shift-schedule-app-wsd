import React from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HeaderBackButton } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ContinueButton from './components/Buttons/ContinueButton';

const Stack = createNativeStackNavigator();

const OtpScreen = ({ navigation }) => {
  const handleContinue = () => {
    // Navigate to the next screen or perform any other action
    navigation.navigate('NextScreen');
  };

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: "center" }}>
      <MaterialCommunityIcons name="shield-check-outline" size={60} color="#D3D3D3" />
      <Text style={{ color: "#3D5A80", fontSize: 35 }}>Enter Code</Text>
      <Text>Your temporary login code was sent to</Text>
      {/* Number needs to come from back-end */}
      <Text style={{ fontWeight: "bold" }}>*** *** 1234</Text>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        <Text>Didn't receive a code?</Text>
        <TouchableOpacity>
          <Text style={{ fontStyle: "italic", color: "#98C1D9" }}>{" "}Resend</Text>
        </TouchableOpacity>
      </View>
      <ContinueButton text="Continue" onPress={()=>console.log("continue")} />
    </View>
  );
};

export default function App() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Otp"
            component={OtpScreen}
            options={{
              headerTitle: 'Authentication',
              headerTintColor: "#3D5A80"
            }}
          />

        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}