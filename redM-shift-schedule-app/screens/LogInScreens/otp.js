import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator(); 

const verification =function () {
    return (
        <SafeAreaView>
            <NavigationContainer>
                <Stack.Navigator>
                    <Stack.Screen
                        name="Authentication"
                        component={Authentication} 
                        options={{
                            title: 'Authentication',
                        }}
                    />
                </Stack.Navigator>
            </NavigationContainer>
        </SafeAreaView>
    )
} 

export default verification;