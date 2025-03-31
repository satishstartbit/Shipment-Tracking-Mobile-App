import React, { useState } from "react";
import { View, FlatList, StyleSheet, Dimensions, Text, Button } from "react-native";
import ShipmentCard from "../../../../components/ShipmentCard";
import ShipmentDetailsSheet from "../../../../components/ShipmentDetailsSheet";
import SearchBar from "../../../../components/SearchBar";
import CreateShipmentButton from "../../../../components/CreateShipmentButton";
import { useRouter } from "expo-router";

// Calculate card width based on screen size
const screenWidth = Dimensions.get("window").width;
const cardWidth = (screenWidth - 32) / 2 - 8;

// Sample Shipment Data
const shipments = [
  {
    shipmentNumber: "SHP-1001",
    status: "Gate-In",
    truckType: "Medium",
    destination: { city: "New York", state: "NY" },
    expectedArrival: "2025-04-10T14:30:00Z",
  },
  {
    shipmentNumber: "SHP-1002",
    status: "In Transit",
    truckType: "Large",
    destination: { city: "Los Angeles", state: "CA" },
    expectedArrival: "2025-04-12T16:00:00Z",
  },
  {
    shipmentNumber: "SHP-1003",
    status: "Gate-In",
    truckType: "Small",
    destination: { city: "Chicago", state: "IL" },
    expectedArrival: "2025-04-08T10:15:00Z",
  },
  {
    shipmentNumber: "SHP-1004",
    status: "Gate-In",
    truckType: "Large",
    destination: { city: "Houston", state: "TX" },
    expectedArrival: "2025-04-15T09:00:00Z",
  },
];

const docShipmentListScreen = () => {
  const [visible, setVisible] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const toggleBottomSheet = (shipment) => {
    setSelectedShipment(shipment);
    setVisible(!visible);
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Filter only Gate-In status shipments
  const filteredShipments = shipments.filter(
    (shipment) =>
      (shipment.status === "Gate-In") && // Filter by Gate-In status
      (shipment.shipmentNumber
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
        shipment.destination.city
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        shipment.status.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleAssignDoc = () => {
    // Logic to assign the document number
    console.log("Assigning Doc Number for shipment:", selectedShipment.shipmentNumber);
    router.navigate("/(drawer)/docNumber/assignDocNumber")
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
            <Text style={styles.emptyText}>No shipments found</Text>
          </View>
        }
      />

      {/* Bottom Sheet for Shipment Details */}
      <ShipmentDetailsSheet
        visible={visible}
        shipment={selectedShipment}
        onClose={() => setVisible(false)}
        formatDateTime={formatDateTime}
        title="Assign Doc Number"
        isAssignShipment={true}
        onAssign={handleAssignDoc}
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
});

export default docShipmentListScreen;
