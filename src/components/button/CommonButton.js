import React from "react";
import { StyleSheet } from "react-native";
import { TouchableOpacity, Text } from "react-native";

export default function CommonButton({title, onPress}) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  );
}
const styles = StyleSheet.create({
  button: {
    backgroundColor: "#3498db",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    maxwidth: 100,
    alignSelf: "center",
    margin: 2,
  },
  text: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
