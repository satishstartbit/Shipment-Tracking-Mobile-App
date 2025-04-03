import React, { useEffect, useState } from "react";
import { View, FlatList, StyleSheet, Dimensions, Text } from "react-native";
import ShipmentCard from "../../../../components/ShipmentCard";
import ShipmentDetailsSheet from "../../../../components/ShipmentDetailsSheet";
import SearchBar from "../../../../components/SearchBar";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useApi } from "../../../../hooks/useApi";
import { jwtDecode } from "jwt-decode";
// Calculate card width based on screen size
const screenWidth = Dimensions.get("window").width;
const cardWidth = (screenWidth - 32);



const ShipmentListScreen = () => {
  const [visible, setVisible] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();
  const [shipments, setShipments] = useState([]);
  const [pageNo, setPageNo] = useState(1); // Track the current page
  const [loading, setLoading] = useState(false);
    const { apiRequest } = useApi();

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

  const fetchShipments = async () => {
    try {
      setLoading(true);
      const body = {
        page_size: 15,
        page_no: 1,
        search: "",
        order: "asc",
        slug: await SecureStore.getItemAsync("uRole"),
        userid: await SecureStore.getItemAsync("uid"),
      };

      const response = await apiRequest(
        "/shipment/getallshipment",
        "POST",
        body
      );
      const data = response.shipments; // Access the shipments array from the response


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

    }
  };



  const handleAssignShipment = (shipmentId) => {
    // Navigate to the create assign shipment page
    router.push(`/(drawer)/munshi/assignTruck/${shipmentId}`);
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

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
        isAssignShipment={true}
        onAssign={() => handleAssignShipment(selectedShipment?._id)}
        title={"Assign Truck"}
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
});

export default ShipmentListScreen;
