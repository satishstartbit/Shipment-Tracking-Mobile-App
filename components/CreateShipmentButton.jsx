import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

/**
 * CreateShipmentButton - A floating action button to trigger the shipment creation process.
 *
 * @param {function} onPress - Function to execute when the button is pressed.
 */
const CreateShipmentButton = ({ onPress,text }) => {
  return (
    <View style={styles.container}>
      {/* Button with icon and text */}
      <TouchableOpacity style={styles.createButton} onPress={onPress}>
        <MaterialIcons name="add" size={24} color="white" /> 
        <Text style={styles.createButtonText}>{text || "Create Shipment"}</Text>
      </TouchableOpacity>
    </View>
  );
};

// Styles for the button and container
const styles = StyleSheet.create({
  container: {
    position: 'absolute', // Keeps the button floating
    right: 10, // Position it towards the right
    bottom: 40, // Position it above the bottom edge
  },
  createButton: {
    backgroundColor: "#6430B9CC", // Button background color
    flexDirection: "row", // Align icon and text in a row
    alignItems: "center", // Center the content vertically
    justifyContent: "center", // Center the content horizontally
    paddingVertical: 12, // Top and bottom padding
    paddingHorizontal: 20, // Left and right padding
    borderRadius: 30, // Rounded button corners
    shadowColor: "#000", // Shadow color for elevation effect
    shadowOffset: { width: 0, height: 2 }, // Shadow positioning
    shadowOpacity: 0.25, // Shadow transparency
    shadowRadius: 4, // Shadow blur radius
    elevation: 5, // Shadow for Android
  },
  createButtonText: {
    color: "#FFF", // Text color (white)
    fontSize: 16, // Text size
    fontWeight: "600", // Semi-bold text
    marginLeft: 8, // Space between icon and text
  },
});

export default CreateShipmentButton;
