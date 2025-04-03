import React from "react";
import { Text, TouchableOpacity, StyleSheet, ActivityIndicator } from "react-native";
import {scaleFont, scalePadding, scalePaddingVertical} from '../constants/font'
/**
 * ButtonComponent - A reusable button component for handling user interactions.
 *
 * @param {string} title - The text to be displayed on the button.
 * @param {function} onPress - The function to execute when the button is pressed.
 * @param {object} button - Custom styles for the button (optional).
 * @param {object} buttonText - Custom styles for the button text (optional).
 * @param {boolean} loading - Whether to show a loading spinner (optional, default: false).
 */
export const ButtonComponent = ({ title, onPress, button, buttonText, loading = false }) => {
  return (
    <TouchableOpacity
      style={[styles.button, button, loading && styles.disabledButton]}
      onPress={onPress}
      disabled={loading} // Disable button when loading
    >
      {loading ? (
        <ActivityIndicator size={28} color="#fff" />
      ) : (
        <Text style={[styles.buttonText, buttonText]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

// Default styles
const styles = StyleSheet.create({
  button: {
    backgroundColor: "#6430B9CC",
    padding: scalePadding(15),
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    height: 50,
    width: "100%",
    paddingVertical:scalePaddingVertical(1)
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: scaleFont(16),
    lineHeight: scaleFont(20),
  },
  disabledButton: {
    opacity: 0.7, // Slightly fade the button when loading
  },
});
