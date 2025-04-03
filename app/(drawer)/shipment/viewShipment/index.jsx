import React, { useState, useEffect } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Dimensions,
  Text,
  ActivityIndicator,
} from "react-native";
import ShipmentCard from "../../../../components/ShipmentCard";
import ShipmentDetailsSheet from "../../../../components/ShipmentDetailsSheet";
import SearchBar from "../../../../components/SearchBar";
import CreateShipmentButton from "../../../../components/CreateShipmentButton";
import { useRouter } from "expo-router";
import { useApi } from "../../../../hooks/useApi";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
const screenWidth = Dimensions.get("window").width;
const cardWidth = (screenWidth - 32);

const ShipmentListScreen = () => {
  const [visible, setVisible] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [shipments, setShipments] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { apiRequest } = useApi();

  const fetchShipments = async (pageNum = 1, search = "") => {
    try {
      setLoading(true);
      
      const slug = await SecureStore.getItemAsync("uRole");
      const userid = await SecureStore.getItemAsync("uid");
      
      const body = {
        page_size: 10,
        page_no: pageNum,
        search: search,
        order: "asc",
        slug: slug,
        userid: userid,
      };

      const response = await apiRequest("/shipment/getallshipment", "POST", body,true);
      const data = response.shipments;
      
      if (pageNum === 1) {
        setShipments(data);
      } else {
        setShipments([...shipments, ...data]);
      }
      
      setHasMore(response.pagination?.has_next || false);
      setPage(pageNum);
    } catch (err) {
      console.error("Error fetching shipments:", err);
    } finally {
      setLoading(false);
    }
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

  // Initial load
  useEffect(() => {
    fetchShipments(page,searchQuery);
  }, [page,hasMore]);

  // Search effect
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchShipments(1, searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      fetchShipments(page + 1, searchQuery);
    }
  };

  const handleRefresh = () => {
    fetchShipments(1, searchQuery);
  };

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

  return (
    <View style={styles.container}>
      <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <CreateShipmentButton
        onPress={() => router.navigate("/(drawer)/shipment/createShipment")}
      />

      <FlatList
        data={shipments}
        keyExtractor={(item) => item._id}
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
          !loading && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No shipments found</Text>
            </View>
          )
        }
        ListFooterComponent={
          loading && page > 1 && (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#6430B9" />
            </View>
          )
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.7}
        onRefresh={handleRefresh}
        refreshing={loading && page === 1}
      />

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
    paddingBottom: 0,
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
  loadingContainer: {
    padding: 10,
    alignItems: "center",
  },
});

export default ShipmentListScreen;