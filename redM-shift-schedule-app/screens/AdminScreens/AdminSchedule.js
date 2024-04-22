import * as React from 'react';
import { Text, View } from 'react-native';

export default function AdminScheduleScreen({ navigation }) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text
                onPress={() => alert('This is the "Schedule" screen.')}
                style={{ fontSize: 26, fontWeight: 'bold' }}>Shecdule Screen</Text>
        </View>
    );
}