import * as React from 'react';
import { Text, View } from 'react-native';

export default function UserScheduleScreen({ navigation }) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text
                onPress={() => alert('This is the "Schedule" screen.')}
                style={{ fontSize: 26, fontWeight: 'bold' }}>User Schedule Screen</Text>
        </View>
    );
}