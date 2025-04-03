import React, { useState, useEffect, useCallback } from "react";
import { View, FlatList, StyleSheet, Dimensions, Text, ActivityIndicator } from "react-native";
import ShipmentCard from "../../../../components/ShipmentCard";
import ShipmentDetailsSheet from "../../../../components/ShipmentDetailsSheet";
import SearchBar from "../../../../components/SearchBar";
import { useRouter } from "expo-router";
import { useApi } from "../../../../hooks/useApi";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
// Calculate card width based on screen size
const screenWidth = Dimensions.get("window").width;
const cardWidth = (screenWidth - 32) ;

const AssignShipment = () => {
  const [visible, setVisible] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [shipments, setShipments] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const router = useRouter();
  
  const { apiRequest, loading } = useApi();

  const fetchShipments = useCallback(async (pageNum = 1, search = "", isRefreshing = false) => {
    try {
      if (isRefreshing) {
        setRefreshing(true);
      }
  
      // Get dynamic values from SecureStore
      const [slug, userid] = await Promise.all([
        SecureStore.getItemAsync("uRole"),
        SecureStore.getItemAsync("uid")
      ]);
  
      const body = {
        page_size: 15,
        page_no: pageNum,
        search: search,
        order: "asc",
        slug: slug, // Fallback to default if not found
        userid: userid , // Fallback to default if not found
      };
  
      const data = await apiRequest(`/shipment/getallshipment`, "POST", body, true);
  

      const plannedShipments = (data.shipments || []).filter(
        (shipment) => shipment.shipment_status === "Planned"
      );
  
      if (pageNum === 1) {
        setShipments(plannedShipments);
      } else {
        setShipments(prev => [...prev, ...plannedShipments]);
      }
  
      setTotalPages(data.total_pages || 1);
      setHasMore(data.has_next || false);
      setPage(pageNum);
    } catch (error) {
      console.error("Error fetching shipments:", error);
      if (pageNum === 1) {
        setShipments([]);
      }
    } finally {
      setRefreshing(false);
    }
  }, [apiRequest]);
  
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

  useEffect(() => {
    fetchShipments();
  }, [fetchShipments]);

  useEffect(() => {
    // Debounce search to avoid too many API calls
    const timer = setTimeout(() => {
      fetchShipments(1, searchQuery, false);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, fetchShipments]);

  const toggleBottomSheet = (shipment) => {
    setSelectedShipment(shipment);
    setVisible(!visible);
  };

  const formatDateTime = (isoString) => {
    if (!isoString) return "Not specified";
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleLoadMore = () => {
    if (!loading && hasMore && page < totalPages) {
      fetchShipments(page + 1, searchQuery);
    }
  };

  const handleRefresh = () => {
    fetchShipments(1, searchQuery, true);
  };

  const handleAssignShipment = (shipmentNumber, shipId) => {
    router.push(`/(drawer)/shipment/createAssignShiment/${shipmentNumber}_${shipId}`);
  };
  console.log("ps",shipments)

  const renderFooter = () => {
    if (!loading || page === 1) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#6430B9" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />

      {/* Shipment List */}
      <FlatList
        data={shipments}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <ShipmentCard
            item={{
              shipmentNumber: item.shipment_number,
              status: item.shipment_status,
              truckType: item.truckTypeId?.name || "Not specified",
              destination: {
                city: item.destination_city,
                state: item.destination_state
              },
              expectedArrival: item.expected_arrival_date
            }}
            onPress={() => toggleBottomSheet(item)}
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
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshing={refreshing}
        onRefresh={handleRefresh}
      />

      {/* Bottom Sheet for Shipment Details */}
      <ShipmentDetailsSheet
        visible={visible}
        shipment={selectedShipment ? {
          ...selectedShipment,
          shipmentNumber: selectedShipment.shipment_number,
          status: selectedShipment.shipment_status,
          truckType: selectedShipment.truckTypeId?.name || "Not specified",
          destination: {
            city: selectedShipment.destination_city,
            state: selectedShipment.destination_state
          },
          expectedArrival: selectedShipment.expected_arrival_date
        } : null}
        onClose={() => setVisible(false)}
        formatDateTime={formatDateTime}
        isAssignShipment={true}
        onAssign={() => handleAssignShipment(selectedShipment?.shipment_number, selectedShipment?._id)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F6F2",
    paddingBottom: 10,
  },
  listContent: {
    paddingHorizontal: 12,
    paddingTop: 12,
    flexGrow: 1,
  },
  columnWrapper: {
    justifyContent: "space-between",
    marginBottom: 8,
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
  footer: {
    paddingVertical: 20,
    alignItems: "center",
  },
});

export default AssignShipment;