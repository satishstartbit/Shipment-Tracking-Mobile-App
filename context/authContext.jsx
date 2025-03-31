import { useRouter } from "expo-router";
import { createContext, useContext, useState } from "react";
import { useApi } from "../hooks/useApi";
import * as SecureStore from "expo-secure-store";
import Toast from 'react-native-root-toast';

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
      console.log("data", response);

      if (!response) {
        throw new Error(error || "Login failed");
      }

      await SecureStore.setItemAsync("authToken", response.accessToken);
      await SecureStore.setItemAsync("uRole",response.roles.slug);

      // console.log("data true",data)

      // Check user role from API response
      if (response.roles.slug === "security_gaurd") {
        console.log("Admin logged in",response.roles.slug);
        setAuthState({
          authenticated: true,
          username: username,
          role: Role.ADMIN,
        });
        router.replace("/(drawer)");
      } else if (response.roles.slug === "munshi") {
        console.log("User logged in");
        setAuthState({
          authenticated: true,
          username: username,
          role: Role.USER,
        });
        router.replace("/(drawer)/munshi");
      } else if (response.roles.slug === "logistic") {
        console.log("logistic logged in");
        setAuthState({
          authenticated: true,
          username: username,
          role: Role.USER,
        });
        router.replace("/(drawer)/shipment");
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

    console.log("helo", response);
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
