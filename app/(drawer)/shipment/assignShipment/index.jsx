import React, { useState, useEffect, useCallback } from "react";
import { View, FlatList, StyleSheet, Dimensions, Text, ActivityIndicator } from "react-native";
import ShipmentCard from "../../../../components/ShipmentCard";
import ShipmentDetailsSheet from "../../../../components/ShipmentDetailsSheet";
import SearchBar from "../../../../components/SearchBar";
import CreateShipmentButton from "../../../../components/CreateShipmentButton";
import { useRouter } from "expo-router";
import { useApi } from "../../../../hooks/useApi";

// Calculate card width based on screen size
const screenWidth = Dimensions.get("window").width;
const cardWidth = (screenWidth - 32) / 2 - 8;

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
      const body = {
        page_size: 15,
        page_no: 1,
        search: "",
        order: "asc",
        slug: "logistic_person",
        userid: "67e636d91a69d6a4496df0db",
      };
      const params = new URLSearchParams({
        page_no: pageNum,
        page_size: 10,
        status: "new" // Filter for "new" status shipments only
      });
      
      if (search) {
        params.append('search', search);
      }

      const data = await apiRequest(`/shipment/getallshipment`, 'POST', body, true);
      
      if (pageNum === 1) {
        setShipments(data.shipments);
      } else {
        setShipments(prev => [...prev, ...data.shipments]);
      }
      
      setTotalPages(data.total_pages);
      setHasMore(data.has_next);
      setPage(pageNum);
    } catch (error) {
      console.error("Error fetching shipments:", error);
    } finally {
      setRefreshing(false);
    }
  }, [apiRequest]);

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

  const handleAssignShipment = (shipmentNumber) => {

    router.push(`/(drawer)/shipment/createAssignShiment/${shipmentNumber}`);
  };

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
        columnWrapperStyle={styles.columnWrapper}
        numColumns={2}
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
        onAssign={()=>handleAssignShipment(selectedShipment.shipment_number)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9F6F2",
    paddingBottom: 10, // Space for the create button
  },
  listContent: {
    paddingHorizontal: 12,
    paddingTop: 12,
    flexGrow: 1,
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
  footer: {
    paddingVertical: 20,
    alignItems: "center",
  },
});

export default AssignShipment;