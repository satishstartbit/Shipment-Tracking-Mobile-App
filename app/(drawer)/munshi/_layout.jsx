import { Stack } from "expo-router";

export default function shipmentLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="viewShipment/index"
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="assignTruck/index"
        options={{ headerShown: false }}
      />
  
    </Stack>
  );
}
