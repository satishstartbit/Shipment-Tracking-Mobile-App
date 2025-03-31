import React from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";


/**
 * Input - A reusable text input component with a label and error handling.
 *
 * @param {string} label - The text displayed above the input field.
 * @param {string} placeholder - The placeholder text inside the input field.
 * @param {boolean} secureTextEntry - If true, hides the text for password inputs.
 * @param {object} containerStyle - Custom styles for the input container.
 * @param {object} labelStyle - Custom styles for the label text.
 * @param {object} inputStyle - Custom styles for the text input field.
 * @param {string} error - Error message to display below the input field.
 */
export const InputComponent = ({
  label,
  placeholder,
  secureTextEntry,
  containerStyle,
  labelStyle,
  inputStyle,
  error,
  editable = true,
  selectTextOnFocus=true,
  onChangeText
}) => {
  console.log("hhh",onChangeText)
  return (
    <View style={containerStyle || styles.inputContainer}>
      {/* Label for the input field */}
      <Text style={labelStyle || styles.label}>{label}</Text>

      {/* Text input field */}
      <TextInput
        style={[styles.input, inputStyle, error ? styles.inputError : null]}
        placeholder={placeholder}
        placeholderTextColor="#555" // Light gray placeholder color
        secureTextEntry={secureTextEntry} // Hides text if true (for passwords)
        editable={editable} 
        selectTextOnFocus={selectTextOnFocus}
        onChangeText={onChangeText}
      />

      {/* Display error message if present */}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
};

// Default styles for the input component
const styles = StyleSheet.create({
  inputContainer: {
    marginBottom: 20, // Adds spacing below each input field
  },
  label: {
    fontWeight: "bold", // Bold label text
    color: "#2C3E50", // Dark blue label color
    marginBottom: 8, // Spacing between label and input field
  },
  input: {
    borderWidth: 1, // Thin border around the input field
    borderColor: "#6430B9CC", // Purple border color
    borderRadius: 12, // Rounded corners
    padding: 12, // Padding inside the input field
    fontSize: 16, // Font size of input text
    backgroundColor: "#FFF5E1", // Light background color for better visibility
  },
  inputError: {
    borderColor: "#D32F2F", // Red border for error
  },
  errorText: {
    color: "#D32F2F", // Red text color
    fontSize: 12, // Smaller font size
    marginTop: 5, // Spacing between input and error message
  },
});
