import * as React from 'react';
import { Text, View } from 'react-native';

export default function UserRequestLeaveScreen({ navigation }) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text
                onPress={() => alert('This is the "Home" screen.')}
                style={{ fontSize: 26, fontWeight: 'bold' }}>User Request Leave Screen</Text>
        </View>
    );
}