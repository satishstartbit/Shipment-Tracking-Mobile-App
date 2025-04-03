import React from "react";
import { View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { scaleFont, scalePaddingHorizontal } from "../constants/font";

/**
 * SearchBar component for filtering shipments.
 *
 * @param {string} searchQuery - The current search query input value.
 * @param {function} setSearchQuery - Function to update the search query.
 */
const SearchBar = ({ searchQuery, setSearchQuery }) => {
  return (
    <View style={styles.searchContainer}>
      {/* Search Icon */}
      <MaterialIcons name="search" size={20} color="#6430B9CC" style={styles.searchIcon} />

      {/* Search Input Field */}
      <TextInput
        style={styles.searchInput}
        placeholder="Search shipments..."
        placeholderTextColor="#999"
        value={searchQuery}
        onChangeText={setSearchQuery} // Updates the search query state
      />

      {/* Clear Button - Appears only when there is input */}
      {searchQuery.length > 0 && (
        <TouchableOpacity onPress={() => setSearchQuery("")}>
          <MaterialIcons name="close" size={20} color="#D32F2F" />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row", // Aligns children horizontally
    alignItems: "center", // Centers items vertically
    backgroundColor: "#FFF", // White background
    borderRadius: 25, // Rounded corners
    paddingHorizontal: scalePaddingHorizontal(15), // Adds horizontal padding
    margin: 12, // External margin
    height: 50, // Fixed height for consistency
    shadowColor: "#6430B9CC", // Soft shadow effect
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android shadow
  },
  searchIcon: {
    marginRight: 10, // Spacing between icon and input field
  },
  searchInput: {
    flex: 1, // Takes up remaining space
    fontSize: scaleFont(16), // Text size
    color: "#2C3E50", // Text color
  },
});

export default SearchBar;
