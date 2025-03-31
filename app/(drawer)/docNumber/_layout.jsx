import { Stack } from "expo-router";

export default function shipmentLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="viewDocShipment/index"
        options={{ headerShown: false }}
      />
       <Stack.Screen
        name="assignDocNumber/index"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
