import { Stack } from "expo-router";

export default function securityLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="viewSecurityShipment/index"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="assignStatus/index"
        options={{ headerShown: false }}
      />
      {/* <Stack.Screen
        name="assignShipment/index"
        options={{ headerShown: false }}
      /> */}
      {/* <Stack.Screen
        name="createAssignShiment/index"
        options={{ headerShown: false }}
      /> */}
    </Stack>
  );
}
