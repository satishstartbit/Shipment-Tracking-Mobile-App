import { Slot, useRouter, useSegments } from "expo-router";
import { AuthProvider, useAuth } from "../context/authContext";
import { useEffect } from "react";
export default function RootLayout() {
  const { authState } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authState?.authenticated === true) {
      router.replace("/(drawer)");
    } else if (authState?.authenticated === true) {
      router.replace("/(drawer)");
    } else if (authState?.authenticated === true) {
      router.replace("/(drawer)");
    }
  }, [authState]);

  return (
    <AuthProvider>
      <Slot />
    </AuthProvider>
  );
}
