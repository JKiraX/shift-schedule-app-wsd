import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function ContinueButton({ text, onPress }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.button}>
        <Text style={styles.buttonText}>{text}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 120,
    backgroundColor: '#3D5A80'
  },
  buttonText: {
    color: 'white',
    fontWeight: 'semi-bold',
    textTransform: 'uppercase',
    fontSize: 16,
    textAlign: 'center'
  }
});