// components/NavigationItem.js
import React from "react";
import { DrawerItem } from "@react-navigation/drawer";
import { MaterialIcons } from "@expo/vector-icons";
import { router, usePathname } from "expo-router";
import { StyleSheet } from "react-native";
import {scaleFont} from '../constants/font'
const NavigationItem = ({ label, iconName, route }) => {
  const pathname = usePathname(); // Get the current route path

  return (
    <DrawerItem
      icon={({ size }) => (
        <MaterialIcons
          name={iconName}
          size={size}
          color={pathname.includes(route) ? "#6430B9CC" : "#D32F2F"}
        />
      )}
      label={label}
      labelStyle={[
        styles.navItemLabel,
        {
          color: pathname.includes(route) ? "#6430B9CC" : "#2C3E50",
        },
      ]}
      style={[
        styles.navItem,
        pathname.includes(route) && styles.activeNavItem,
      ]}
      onPress={() => router.push(`/(drawer)/${route}`)}
    />
  );
};

const styles = StyleSheet.create({
  navItem: {
    borderRadius: 8,
    marginHorizontal: 5,
    marginVertical: 5,
  },
  activeNavItem: {
    backgroundColor: "rgba(100, 48, 185, 0.1)", // Light purple background for active item
  },
  navItemLabel: {
    marginLeft: 2,
    fontSize: scaleFont(16),
    fontWeight: "500",
  },
});

export default NavigationItem;
