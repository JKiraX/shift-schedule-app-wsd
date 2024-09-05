import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react"; // Include necessary hooks
import { StyleSheet, Text, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserNav from "./redM-shift-schedule-app/components/Navigation/UserNav";
import AdminNav from './redM-shift-schedule-app/components/Navigation/AdminNav';
import AdminNav1 from "./redM-shift-schedule-app/components/Navigation/AdminNav1";
import AppLogin from "./redM-shift-schedule-app/screens/LogInScreens/loginscreen";
import * as SplashScreen from 'expo-splash-screen';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

const Stack = createNativeStackNavigator();

SplashScreen.preventAutoHideAsync(); // Prevent splash screen from hiding automatically

export default function App() {
  const [isReady, setIsReady] = useState(false);
  const opacity = useSharedValue(0); // Shared value for opacity

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: withTiming(opacity.value, {
        duration: 1000, // Duration of the fade-in effect in milliseconds
        easing: Easing.out(Easing.ease),
      }),
    };
  });

  useEffect(() => {
    async function prepare() {
      try {
        // Simulate some initialization task
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate loading or data fetching

        // Set opacity to 1 to trigger fade-in animation
        opacity.value = 1;
      } catch (e) {
        console.warn(e);
      } finally {
        setIsReady(true);
        // Hide the splash screen after the animation is done
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!isReady) {
    return (
      // Render splash screen animation while loading
      <Animated.View style={[styles.container, animatedStyle]}>
        <Text>Welcome to Your App!</Text>
      </Animated.View>
    );
  }

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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff', // Match your splash screen background color
  },
});
