import { MaterialIcons } from "@expo/vector-icons";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { router } from "expo-router";
import { Drawer } from "expo-router/drawer";
import React, { useEffect, useState } from "react";
import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ToastAndroid,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import NavigationItem from "../../components/DrawerNavigation";
import { useAuth } from "../../context/authContext";
import { jwtDecode } from "jwt-decode";
import { ActivityIndicator } from "react-native-paper";
import Toast from "react-native-toast-message";
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
      ToastAndroid.show("Logout Failed", ToastAndroid.LONG);
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
      {role === "logistic_person" && (
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
        </>
      )}
      {role === "security_gaurd" && (
        <>
          <NavigationItem
            label="Security"
            iconName="description"
            route="security/viewSecurityShipment"
          />
        
        </>
      )}

      {role === "Munshi" && (
        <>
          <NavigationItem
            label="Munshi Shipment"
            iconName="description"
            route="munshi/viewShipment"
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
        const storedToken = await SecureStore.getItemAsync("authToken");
        const storedRole = await SecureStore.getItemAsync("uRole");
  
        console.log("Stored Token:", storedToken);
        console.log("Stored Role:", storedRole);
  
        // If no token or role is found, redirect immediately
        if (!storedToken || !storedRole) {
          console.log("No token or role found. Redirecting to login...");
          router.replace("/(auth)/login");
          return;
        }
  
        // Decode the token and check expiration
        const decoded = jwtDecode(storedToken);
        const currentTime = Math.floor(Date.now() / 1000);
        
        console.log("Token Expiry Time:", decoded.exp);
        console.log("Current Time:", currentTime);
  
        if (decoded.exp < currentTime) {
          console.log("Token expired. Clearing data and redirecting...");
  
          // Clear SecureStore before redirecting
          await SecureStore.deleteItemAsync("authToken");
          await SecureStore.deleteItemAsync("uRole");
          await SecureStore.deleteItemAsync("uid");
  
          router.replace("/(auth)/login");
        }
      } catch (error) {
        console.error("Error validating token:", error);
        router.replace("/(auth)/login"); // Redirect on any error
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
