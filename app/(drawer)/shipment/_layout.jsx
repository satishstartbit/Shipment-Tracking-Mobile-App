import { Stack } from "expo-router";

export default function shipmentLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="viewShipment/index"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="createShipment/index"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="assignShipment/index"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="createAssignShiment/[id]"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
