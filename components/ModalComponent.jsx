import { useRouter } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { BottomSheet } from "react-native-btr";
import { MaterialIcons } from "@expo/vector-icons"; // ✅ Icons for better UI
import { scaleFont } from "../constants/font";

const statusColors = {
  planned: "#FFA500",
  loaded: "#D32F2F",
  Assigned: "#4CAF50",
  "Gate-In": "#0000FF",
  Confirmed: "#008080",
  new: "#000",
  Planned:"#FFA500"
};

const ModalComponent = ({ visible, onClose, shipment,redirectTo }) => {
  const router = useRouter();
  if (!shipment) return null;
console.log("fff",shipment)
  const handleRedirect = () => {
    router?.navigate(redirectTo);
  };






  return (
    <BottomSheet visible={visible}>
      <View style={styles.bottomSheet}>
        {/* Header with Icon */}
        <View style={styles.header}>
          <MaterialIcons name="local-shipping" size={26} color="#6430B9CC" />
          <Text style={styles.sheetTitle}>Shipment Details</Text>
        </View>

        {/* Shipment Info */}
        <View style={styles.shipmentHeader}>
          <Text style={styles.shipmentNumber}>
            {shipment.shipmentNumber || shipment.shipment_number}
          </Text>
          <View
            style={[
              styles.statusBadge,
              {
                backgroundColor:
                  statusColors[shipment.status || shipment.shipment_status],
              },
            ]}
          >
            <Text style={styles.statusText}>
              {shipment.status || shipment.shipment_status}
            </Text>
          </View>
        </View>

        {/* Action Button */}
        <TouchableOpacity style={styles.actionButton} onPress={handleRedirect}>
          <Text style={styles.actionButtonText}>Done</Text>
        </TouchableOpacity>
      </View>
    </BottomSheet>
  );
};

// Styles
const styles = StyleSheet.create({
  bottomSheet: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    alignItems: "center",
    position: "absolute",
    bottom: 0,
    height: "30%", 
    width: "100%",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 15,
  },
  sheetTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#6430B9CC",
  },
  shipmentHeader: {
    alignItems: "left",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  shipmentNumber: {
    fontSize: scaleFont(18),
    fontWeight: "bold",
    color: "#2C3E50",
  },
  statusBadge: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 15,
    width:"30%",
    marginTop:10
  },
  statusText: {
    color: "#FFFFFF",
    fontSize: scaleFont(15),
    fontWeight: "600",
    textAlign:"center"
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    width: "100%",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  detailText: {
    fontSize: 15,
    color: "#2C3E50",
  },
  actionButton: {
    backgroundColor: "#6430B9CC",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
    width:"95%"
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: scaleFont(18),
    fontWeight: "800",
  },
});

export default ModalComponent;
