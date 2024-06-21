import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

export default function SmallButton({ text, onPress }) {
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
    borderRadius: 15,
    paddingVertical: 16,
    paddingHorizontal: 50,
    backgroundColor: "#c82f2f",
  },
  buttonText: {
    color: "white",
    fontWeight: "semi-bold",
    textTransform: "uppercase",
    fontSize: 16,
    textAlign: "center",
  },
});
