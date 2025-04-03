import React, { useState } from "react";
import { Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { Menu } from "react-native-paper";
import { scaleFont, scalePaddingHorizontal, scalePaddingVertical } from "../constants/font";

const DropdownSelector = ({ label, options, value, setValue, error }) => {
  const [visible, setVisible] = useState(false);

  return (
    <View style={styles.inputContainer}>
      <Text style={styles.label}>{label}</Text>
      <Menu
        visible={visible}
        onDismiss={() => setVisible(false)}
        anchor={
          <TouchableOpacity style={styles.dropdown} onPress={() => setVisible(true)}>
            <Text style={value ? styles.selectedText : styles.placeholderText}>
              {value || `Select ${label}`}
            </Text>
          </TouchableOpacity>
        }
      >
        {options.map((item) => (
          <Menu.Item
            key={item.value}
            onPress={() => {
              setValue(item.value);
              setVisible(false);
            }}
            title={item.label}
          />
        ))}
      </Menu>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: { marginBottom: 15 },
  label: { fontSize: scaleFont(16), fontWeight: "500", marginBottom: 5 },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingVertical: scalePaddingVertical(14),
    paddingHorizontal: scalePaddingHorizontal(12),
    backgroundColor: "#fff",
  },
  placeholderText: { color: "#aaa" },
  selectedText: { color: "#000" },
  errorText: { color: "red", fontSize: 12, marginTop: 5 },
});

export default DropdownSelector;
