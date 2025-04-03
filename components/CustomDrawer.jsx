import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Drawer } from "expo-router/drawer";
import { MaterialIcons } from "@expo/vector-icons";
import {scaleFont} from '../constants/font'
export function CustomDrawerContent(props) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Shipment App</Text>
      </View>
      
      <Drawer.Item
        label="Shipments"
        icon={({ color }) => <MaterialIcons name="local-shipping" size={24} color={color} />}
        onPress={() => props.navigation.navigate("(drawer)/shipment")}
      />
      
      <Drawer.Item
        label="Create Shipment"
        icon={({ color }) => <MaterialIcons name="add" size={24} color={color} />}
        onPress={() => props.navigation.navigate("(drawer)/shipment/createShipment")}
      />
      
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={() => props.navigation.navigate("(auth)/login")}
        >
          <MaterialIcons name="logout" size={24} color="#D32F2F" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    marginBottom: 16,
  },
  title: {
    fontSize: scaleFont(20),
    fontWeight: "bold",
    color: "#6430B9CC",
  },
  footer: {
    marginTop: "auto",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logoutText: {
    color: "#D32F2F",
    fontSize: 16,
  },
});