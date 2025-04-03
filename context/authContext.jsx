import { useRouter } from "expo-router";
import { createContext, useContext, useEffect, useState } from "react";
import { useApi } from "../hooks/useApi";
import * as SecureStore from "expo-secure-store";
import Toast from 'react-native-root-toast';
import { jwtDecode } from "jwt-decode";

export const Role = {
  ADMIN: "admin",
  USER: "user",
};

const AuthContext = createContext({});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const router = useRouter();
  const { apiRequest, loading, error } = useApi();
  const [authState, setAuthState] = useState({
    authenticated: null,
    username: null,
    role: null,
  });

  const checkToken = async () => {
    try {
      const storedToken = await SecureStore.getItemAsync("authToken");

      if (!storedToken) {
        router.replace("/(auth)/login");
        return;
      }

      const decoded = jwtDecode(storedToken);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decoded.exp < currentTime) {

        await SecureStore.deleteItemAsync("authToken");
        await SecureStore.deleteItemAsync("uRole");
        await SecureStore.deleteItemAsync("uid");
        router.replace("/(auth)/login");
      } else {
        router.replace("/(drawer)/");
      }
    } catch (error) {
      console.error("Error checking token:", error);
      router.replace("/(auth)/login");
    }
  };

  useEffect(() => {
    checkToken();
  }, []);

  const login = async (username, password) => {
    try {
      const deviceInfo = {
        deviceId: "12345-abcde-67890",
        deviceType: "Phone",
        manufacturer: "Apple",
        model: "iPhone 12",
        systemVersion: "iOS 14.4",
        systemName: "iOS",
        appVersion: "1.0.0",
        appBuildNumber: "1001",
        isEmulator: false,
        timezone: "America/New_York",
        locale: "en-US",
      };
      const response = await apiRequest("/mobile/login", "POST", {
        emailOrUsername: username,
        password,
        deviceInfo,
      });

      // const data = await response.json();


      if (!response) {
        throw new Error(error || "Login failed");
      }

      await SecureStore.setItemAsync("authToken", response.accessToken);
      await SecureStore.setItemAsync("uRole",response.roles.slug);
      await SecureStore.setItemAsync("uid",response.user._id);
  

      // Check user role from API response
      if (response.roles.slug === "security_gaurd") {
   
        setAuthState({
          authenticated: true,
          username: username,
          role: Role.ADMIN,
        });
        router.replace("/(drawer)/security/viewSecurityShipment");
      } else if (response.roles.slug === "Munshi") {

        setAuthState({
          authenticated: true,
          username: username,
          role: Role.USER,
        });
        router.replace("/(drawer)/munshi/viewShipment");
      } else if (response.roles.slug === "logistic_person") {

        setAuthState({
          authenticated: true,
          username: username,
          role: Role.USER,
        });
        router.replace("/(drawer)/shipment/viewShipment");
      }
       else {
        Toast.show('Unknown', {
          duration: Toast.durations.SHORT,
          position: Toast.positions.CENTER,
          backgroundColor: 'red', 
          textColor: 'white', 
          shadow: true, 
          animation: true
        });
      }
    } catch (error) {
      console.error("Login error:", error.message);
    }
  };

  const logout = async () => {
    const response = await apiRequest("/mobile/logout", "POST");
    if (!response) {
      throw new Error("sign out failed" || response.error);
    }


    await SecureStore.deleteItemAsync("authToken");
    await SecureStore.deleteItemAsync("uRole");

    router.replace("/(auth)/login");

    setAuthState({
      authenticated: false,
      username: null,
      role: null,
    });
  };

  return (
    <AuthContext.Provider
      value={{ authState, onLogin: login, onLogout: logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
