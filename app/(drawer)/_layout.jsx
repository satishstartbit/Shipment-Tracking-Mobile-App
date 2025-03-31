import { MaterialIcons } from "@expo/vector-icons";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { router } from "expo-router";
import { Drawer } from "expo-router/drawer";
import React, { useEffect, useState } from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import NavigationItem from "../../components/DrawerNavigation";
import { useAuth } from "../../context/authContext";
import { jwtDecode } from "jwt-decode";
import { ActivityIndicator } from "react-native-paper";
/**
 * CustomDrawerContent Component
 * This component renders the custom drawer navigation with user profile and menu items.
 */
const CustomDrawerContent = (props) => {
  const { onLogout } = useAuth();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getRole = async () => {
      try {
        const storedRole = await SecureStore.getItemAsync("uRole");
        const storedToken = await SecureStore.getItemAsync("authToken");
        if (!storedToken) {
          router.replace("/(auth)/login");
        }
        if (!storedRole) {
          router.replace("/(auth)/login");
        }
        setRole(storedRole);
      } catch (error) {
        console.error("Error fetching role from SecureStore:", error);
      }
    };
    getRole();
  }, []);

  console.log("User Role:", role);

  const handleLogout = async () => {
    console.log("User Logged Out");

    setLoading(true); // Start loading
    try {
      await onLogout();
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <DrawerContentScrollView
      {...props}
      contentContainerStyle={styles.container}
    >
      {/* User Profile Section */}
      <View style={styles.userInfoWrapper}>
        <Image
          source={require("../../assets/images/Campa_logo2.png")}
          style={styles.logo}
        />
      </View>

      {/* Drawer Navigation Items */}
      {role === "security_gaurd" && (
        <>
          <NavigationItem
            label="View Shipment"
            iconName="visibility"
            route="shipment/viewShipment"
          />
          <NavigationItem
            label="Create Shipment"
            iconName="add-box"
            route="shipment/createShipment"
          />
          <NavigationItem
            label="Assign Shipment"
            iconName="check-circle"
            route="shipment/assignShipment"
          />
          <NavigationItem
            label="Doc Number"
            iconName="description"
            route="docNumber/viewDocShipment"
          />
          <NavigationItem
            label="Munshi Shipment"
            iconName="description"
            route="munshi/viewShipment"
          />
        </>
      )}
      {role === "user" && (
        <>
          <NavigationItem
            label="Security"
            iconName="description"
            route="security/viewSecurityShipment"
          />
        </>
      )}

      {/* Logout Button */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          {loading ? (
            <ActivityIndicator size={28} color="#fff" />
          ) : (
            <>
              <MaterialIcons name="logout" size={24} color="#fff" />
              <Text style={styles.logoutButtonText}>Logout</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </DrawerContentScrollView>
  );
};

/**
 * AppLayout Component
 * This component defines the drawer navigation structure for the app.
 */
export default function AppLayout() {
  useEffect(() => {
    const checkToken = async () => {
      try {
        const storedRole = await SecureStore.getItemAsync("uRole");
        const storedToken = await SecureStore.getItemAsync("authToken");
        if (!storedToken) {
          router.replace("/(auth)/login");
        }
        if (!storedRole) {
          router.replace("/(auth)/login");
        }
        const decoded = jwtDecode(storedToken);
        const currentTime = Math.floor(Date.now() / 1000);
        if (decoded.exp < currentTime) {
          router.replace("/(auth)/login");
        }
      } catch (error) {
        console.error("Error fetching role from SecureStore:", error);
      }
    };
    checkToken();
  }, []);
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: true,
        headerTintColor: "#6430B9CC",
        headerTitleStyle: {
          fontWeight: "bold",
          textTransform: "capitalize",
          width: "100%",
        },
      }}
    />
  );
}

// Styles for the Drawer and UI components
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F6F2",
  },
  userInfoWrapper: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    alignItems: "center",
  },
  logo: {
    width: 80,
    height: 80,
  },
  logoutContainer: {
    marginTop: "auto",
    padding: 10,
    marginBottom: 20,
  },
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#D32F2F",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 10,
  },
});
