import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet, Dimensions, Text } from "react-native";
import ShipmentCard from "../../../../components/ShipmentCard";
import ShipmentDetailsSheet from "../../../../components/ShipmentDetailsSheet";
import SearchBar from "../../../../components/SearchBar";
import CreateShipmentButton from "../../../../components/CreateShipmentButton";
import { useRouter } from "expo-router";
import { useApi } from "../../../../hooks/useApi";

// Calculate card width based on screen size
const screenWidth = Dimensions.get("window").width;
const cardWidth = (screenWidth - 32) / 2 - 8;

const ShipmentListScreen = () => {
  const [visible, setVisible] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [shipments, setShipments] = useState([]);
  const [pageNo, setPageNo] = useState(1); // Track the current page
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { apiRequest } = useApi();

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

  // Function to fetch data
  const fetchShipments = async () => {
    try {
      setLoading(true);
      const body = {
        page_size: 15,
        page_no: 1,
        search: "",
        order: "asc",
        slug: "logistic_person",
        userid: "67e636d91a69d6a4496df0db",
      };
      console.log("body", body);
      const response = await apiRequest(
        "/shipment/getallshipment",
        "POST",
        body
      );
      const data = response.shipments; // Access the shipments array from the response

      console.log("dataaa", data);
      // If this is the first page, reset the shipments array
      if (data && pageNo == 1) {
        setShipments(data); // Fallback to empty array if data is undefined
      } else {
        setShipments((prevShipments) => [...prevShipments, ...data]);
      }
    } catch (err) {
      console.error("Error fetching shipments:", err);
      setShipments([]); // Reset to empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShipments(); // Initial load
  }, [pageNo]); // Fetch data when pageNo changes

  // Handle search query change
  const filteredShipments = shipments.filter((shipment) => {
    if (!shipment) return false; // Skip if shipment is null/undefined

    const searchTerm = searchQuery.toLowerCase();

    // Check shipment number
    if (shipment.shipment_number?.toLowerCase().includes(searchTerm)) {
      return true;
    }

    // Check destination city
    if (shipment.destination_city?.toLowerCase().includes(searchTerm)) {
      return true;
    }

    // Check shipment status
    if (shipment.shipment_status?.toLowerCase().includes(searchTerm)) {
      return true;
    }

    return false; // No match found
  });

  const loadMoreData = () => {
    if (!loading) {
      console.log("hii");
    }
  };

  console.log("shipments", filteredShipments);

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <CreateShipmentButton
        onPress={() => router.navigate("/(drawer)/shipment/createShipment")}
      />
      {/* Shipment List */}
      <FlatList
        data={filteredShipments}
        keyExtractor={(item) => item.shipment_number}
        renderItem={({ item }) => (
          <ShipmentCard
            item={item}
            onPress={toggleBottomSheet}
            cardWidth={cardWidth}
            formatDateTime={formatDateTime}
          />
        )}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        numColumns={2}
        ListEmptyComponent={
          !loading ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No shipments found</Text>
            </View>
          ) : null
        }
        onEndReached={loadMoreData} // Trigger when user reaches the bottom
        onEndReachedThreshold={0.5} // Trigger when the user is 50% away from the bottom
        ListFooterComponent={
          loading && shipments.length > 0 ? (
            <View style={styles.loadingContainer}>
              <Text style={styles.loadingText}>Loading...</Text>
            </View>
          ) : null
        }
      />

      {/* Bottom Sheet for Shipment Details */}
      <ShipmentDetailsSheet
        visible={visible}
        shipment={selectedShipment}
        onClose={() => setVisible(false)}
        formatDateTime={formatDateTime}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F6F2",
    paddingBottom: 0, // Space for the create button
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
  loadingContainer: {
    padding: 10,
    alignItems: "center",
  },
  loadingText: {
    color: "#6430B9CC",
  },
});

export default ShipmentListScreen;
