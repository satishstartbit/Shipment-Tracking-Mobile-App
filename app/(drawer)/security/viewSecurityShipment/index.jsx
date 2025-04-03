import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Dimensions, Text, TouchableOpacity } from "react-native";
import ShipmentCard from "../../../../components/ShipmentCard";
import ShipmentDetailsSheet from "../../../../components/ShipmentDetailsSheet";
import SearchBar from "../../../../components/SearchBar";
import CreateShipmentButton from "../../../../components/CreateShipmentButton";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
// Calculate card width based on screen size
const screenWidth = Dimensions.get("window").width;
const cardWidth = (screenWidth - 32) / 2 - 8;

// Sample Shipment Data
const shipments = [
  {
    shipmentNumber: "SHP-1001",
    status: "Planned",
    truckType: "Medium",
    destination: { city: "New York", state: "NY" },
    expectedArrival: "2025-04-10T14:30:00Z",
  },
  {
    shipmentNumber: "SHP-1002",
    status: "In Transit", // Confirmed
    truckType: "Large",
    destination: { city: "Los Angeles", state: "CA" },
    expectedArrival: "2025-04-12T16:00:00Z",
  },
  {
    shipmentNumber: "SHP-1003",
    status: "Delivered", // Confirmed
    truckType: "Small",
    destination: { city: "Chicago", state: "IL" },
    expectedArrival: "2025-04-08T10:15:00Z",
  },
  {
    shipmentNumber: "SHP-1004",
    status: "Planned",
    truckType: "Large",
    destination: { city: "Houston", state: "TX" },
    expectedArrival: "2025-04-15T09:00:00Z",
  },
];

const securityShipmentListScreen = () => {
  const [visible, setVisible] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  // Only show shipments with "Confirmed" status (In Transit or Delivered)
  const filteredShipments = shipments.filter(
    (shipment) =>
      (shipment.status === "In Transit" || shipment.status === "Delivered") && // Filter for confirmed shipments
      (shipment.shipmentNumber
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
        shipment.destination.city
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        shipment.status.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleBottomSheet = (shipment) => {
    setSelectedShipment(shipment);
    setVisible(!visible);
  };
  useEffect(() => {
    const checkToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync("authToken");
        const storedRole = await SecureStore.getItemAsync("uRole");
  
  
        // If no token or role is found, redirect immediately
        if (!storedToken || !storedRole) {
          router.replace("/(auth)/login");
          return;
        }
  
        // Decode the token and check expiration
        const decoded = jwtDecode(storedToken);
        const currentTime = Math.floor(Date.now() / 1000);
        

  
        if (decoded.exp < currentTime) {
          // Clear SecureStore before redirecting
          await SecureStore.deleteItemAsync("authToken");
          await SecureStore.deleteItemAsync("uRole");
          await SecureStore.deleteItemAsync("uid");
  
          router.replace("/(auth)/login");
        }
      } catch (error) {
        console.error("Error validating token:", error);
        router.replace("/(auth)/login"); // Redirect on any error
      }
    };
  
    checkToken();
  }, []);

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const changeStatusToGateIn = () => {
    // Change the status to "Gate In"
    if (selectedShipment) {
      selectedShipment.status = "Gate In"; // Update the status
      setSelectedShipment({ ...selectedShipment }); // Force re-render
  
    }
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      {/* Shipment List */}
      <FlatList
        data={filteredShipments}
        keyExtractor={(item) => item.shipmentNumber}
        renderItem={({ item }) => (
          <ShipmentCard
            item={item}
            onPress={() => toggleBottomSheet(item)}
            cardWidth={cardWidth}
            formatDateTime={formatDateTime}
          />
        )}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        numColumns={2}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No confirmed shipments found</Text>
          </View>
        }
      />

      {/* Bottom Sheet for Shipment Details */}
      <ShipmentDetailsSheet
        visible={visible}
        shipment={selectedShipment}
        onClose={() => setVisible(false)}
        formatDateTime={formatDateTime}
        isAssignShipment={true}
        title="Update Status"
        onAssign={()=>router.navigate("/(drawer)/security/assignStatus")}
      />


    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F6F2",
    paddingBottom: 80, // Space for the create button
  },
  listContent: {
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 8, // Add vertical gap between rows
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyText: {
    fontSize: 16,
    color: "#6430B9CC",
  },
  gateInContainer: {
    position: "absolute",
    bottom: 10,
    left: 12,
    right: 12,
    marginTop: 20,
  },
  gateInButton: {
    backgroundColor: "#6430B9CC",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  gateInButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default securityShipmentListScreen;
