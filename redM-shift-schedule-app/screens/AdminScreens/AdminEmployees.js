import * as React from 'react';
import { Text, View } from 'react-native';

export default function AdminEmployeesScreen({ navigation }) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text
                onPress={() => alert('This is the "Employees" screen.')}
                style={{ fontSize: 26, fontWeight: 'bold' }}>Employee's Screen</Text>
        </View>
    );
}