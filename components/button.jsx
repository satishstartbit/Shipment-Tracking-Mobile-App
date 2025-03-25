import React from "react";
import { Text, TouchableOpacity, StyleSheet } from "react-native";

/**
 * ButtonComponent - A reusable button component for handling user interactions.
 *
 * @param {string} title - The text to be displayed on the button.
 * @param {function} onPress - The function to execute when the button is pressed.
 * @param {object} button - Custom styles for the button (optional).
 * @param {object} buttonText - Custom styles for the button text (optional).
 */
export const ButtonComponent = ({ title, onPress, button, buttonText }) => {
  return (
    <TouchableOpacity 
      style={button || styles.loginButton} // Apply custom button style if provided, otherwise use default
      onPress={onPress} // Handle button press event
    >
      <Text style={buttonText || styles.loginButtonText}>
        {title} {/* Display the button text */}
      </Text>
    </TouchableOpacity>
  );
};

// Default styles for the button component
const styles = StyleSheet.create({
  loginButton: {
    backgroundColor: "#6430B9CC", // Default button background color
    padding: 15, // Padding for better touch experience
    borderRadius: 12, // Rounded corners
    alignItems: "center", // Center the text inside the button
    marginTop: 10, // Space between elements
  },
  loginButtonText: {
    color: "#fff", // Text color (white)
    fontWeight: "bold", // Make text bold
    fontSize: 18, // Set text size
  },
});
