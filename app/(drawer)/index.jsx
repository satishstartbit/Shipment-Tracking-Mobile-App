import { Redirect } from 'expo-router';

export default function drawerIndex() {
  return <Redirect href="/(drawer)/shipment/viewShipment" />;
}