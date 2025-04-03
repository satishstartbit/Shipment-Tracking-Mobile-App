import { useState, useCallback } from "react";
import * as SecureStore from "expo-secure-store";
import Toast from "react-native-root-toast";

const BASE_URL = "https://shipment-tracking-backend.vercel.app";

export const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Makes an API request using fetch.
   * @param {string} endpoint - The API endpoint (e.g., "/login").
   * @param {string} method - The HTTP method (GET, POST, etc.).
   * @param {object} body - The request payload (for POST/PUT).
   * @param {boolean} authRequired - If true, includes the auth token.
   * @returns {Promise<any>} - Returns the API response.
   */
  const apiRequest = useCallback(
    async (endpoint, method = "GET", body = null, authRequired = true) => {
      setLoading(true);
      setError(null);
       console.log("harsh",body)
      try {
        let headers = {
          "Content-Type": "application/json",
        };

        if (authRequired) {

          const token = await SecureStore.getItemAsync("authToken");

          if (token) {
            headers["authorization"] = `${token}`;

          }
        }

        const response = await fetch(`${BASE_URL}${endpoint}`, {
          method,
          headers,
          body: body ? JSON.stringify(body) : null,
        });

        const data = await response.json();


        if (!response.ok) {
          throw new Error(data.message || "Request failed");
        }

        return data;
      } catch (err) {
        Toast.show(err.message, {
          duration: Toast.durations.SHORT,
          position: Toast.positions.CENTER,
          backgroundColor: "red",
          textColor: "white",
          shadow: true,
          animation: true,
        });
        setError(err.message);
        console.error(`API Error [${method} ${endpoint}]:`, err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { apiRequest, loading, error };
};



