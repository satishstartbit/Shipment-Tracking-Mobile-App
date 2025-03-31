import { Redirect } from 'expo-router';

export default function securityIndex() {
  return <Redirect href="/(drawer)/security/viewSecurityShipment" />;
}