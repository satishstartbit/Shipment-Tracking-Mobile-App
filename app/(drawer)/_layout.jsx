import {
  AntDesign,
  Feather,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { router, usePathname } from "expo-router";
import { Drawer } from "expo-router/drawer";
import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

/**
 * CustomDrawerContent Component
 * This component renders the custom drawer navigation with user profile and menu items.
 */
const CustomDrawerContent = (props) => {
  const pathname = usePathname(); // Get the current route path

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      {/* User Profile Section */}
      <View style={styles.userInfoWrapper}>
        {/* Add user profile image and details here if needed */}
      </View>

      {/* Drawer Navigation Items */}
      <DrawerItem
        icon={({ size }) => (
          <MaterialIcons
            name="add-box"
            size={size}
            color={pathname.includes("createshipment") ? "#6430B9CC" : "#2C3E50"}
          />
        )}
        label="Create Shipment"
        labelStyle={[
          styles.navItemLabel,
          { color: pathname.includes("createShipment") ? "#6430B9CC" : "#2C3E50" },
        ]}
        style={[
          styles.navItem,
          pathname.includes("createShipment") && styles.activeNavItem,
        ]}
        onPress={() => router.push("/(drawer)/shipment/createShipment")}
      />

      <DrawerItem
        icon={({ size }) => (
          <MaterialIcons
            name="visibility"
            size={size}
            color={pathname.includes("viewShipment") ? "#6430B9CC" : "#2C3E50"}
          />
        )}
        label="View Shipment"
        labelStyle={[
          styles.navItemLabel,
          { color: pathname.includes("viewShipment") ? "#6430B9CC" : "#2C3E50" },
        ]}
        style={[
          styles.navItem,
          pathname.includes("viewShipment") && styles.activeNavItem,
        ]}
        onPress={() => router.push("/(drawer)/shipment/viewShipment")}
      />
    </DrawerContentScrollView>
  );
};

/**
 * AppLayout Component
 * This component defines the drawer navigation structure for the app.
 */
export default function AppLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true, // Show header for all screens
        headerTintColor: "#6430B9CC", // Header text color
        headerTitleStyle: {
          fontWeight: "bold",
          textTransform: "capitalize",
          width: "100%",
        },
      }}
    >
      {/* Define Drawer Screens */}
      <Drawer.Screen
        name="shipment/index"
        options={{ title: "Shipment List" }}
      />
      <Drawer.Screen
        name="createshipment/index"
        options={{ title: "Create Shipment" }}
      />
      <Drawer.Screen
        name="viewShipment/index"
        options={{ title: "View Shipment" }}
      />
      <Drawer.Screen
        name="settings/index"
        options={{ title: "App Settings" }}
      />
    </Drawer>
  );
}

// Styles for the Drawer and UI components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F6F2",
  },
  userInfoWrapper: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    alignItems: "center",
  },
  userImg: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    borderColor: "#6430B9CC",
  },
  userDetailsWrapper: {
    marginTop: 15,
    alignItems: "center",
  },
  userName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
  },
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
    fontSize: 16,
    fontWeight: "500",
  },
});
