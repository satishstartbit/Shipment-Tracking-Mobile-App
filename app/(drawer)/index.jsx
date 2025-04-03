import { Redirect, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";

export default function DrawerIndex() {
  const [role, setRole] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync("authToken");
        const storedRole = await SecureStore.getItemAsync("uRole");


        if (!storedToken || !storedRole) {
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
          return;
        }

        if (storedRole !== role) setRole(storedRole); // Update state only if different
      } catch (error) {
        console.error("Error validating token:", error);
        router.replace("/(auth)/login"); // Redirect on any error
      }
    };

    checkToken();
  }, []);

  return (
    <>
      {role === "logistic_person" ? <Redirect href="/(drawer)/shipment" /> :
       role === "security" ? <Redirect href="/(drawer)/security" /> :
       role === "Munshi" ? <Redirect href="/(drawer)/munshi" /> :
       null}
    </>
  );
}
