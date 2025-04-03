import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { BottomSheet } from "react-native-btr";
import { MaterialIcons } from "@expo/vector-icons";
import { scaleFont, scalePadding, scalePaddingHorizontal, scalePaddingVertical } from "../constants/font";

// Status Colors Mapping
const statusColors = {
  planned: "#FFA500",
  loaded: "#D32F2F",
  Assigned: "#4CAF50",
  "Gate-In": "#0000FF",
  Confirmed: "#008080",
  new:"#000"
};

/**
 * ShipmentDetailsSheet Component
 * Displays detailed shipment information in a bottom sheet.
 *
 * @param {boolean} visible - Controls the visibility of the bottom sheet
 * @param {Function} onClose - Function to close the sheet
 * @param {Object} shipment - Shipment details object
 * @param {Function} formatDateTime - Function to format date/time
 * @param {boolean} isAssignShipment - Determines if the button is for assigning shipment or viewing it
 * @param {Function} onAssign - Function to trigger when assigning a shipment
 */
const ShipmentDetailsSheet = ({
  visible,
  onClose,
  shipment,
  formatDateTime,
  isAssignShipment = false,
  onAssign,
  title
}) => {

  if (!shipment) return null;

  return (
    <BottomSheet
      visible={visible}
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
    >
      <View style={styles.bottomSheet}>
        {/* Header */}
        <View style={styles.sheetHeader}>
          <Text style={styles.sheetTitle}>Shipment Details</Text>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <MaterialIcons name="close" size={24} color="#D32F2F" />
          </TouchableOpacity>
        </View>

        {/* Shipment Details */}
        <View style={styles.sheetContent}>
          <View style={styles.shipmentHeader}>
            <Text style={styles.shipmentNumberLarge}>{shipment.shipmentNumber || shipment.shipment_number}</Text>
            <View
              style={[
                styles.statusBadgeLarge,
                { backgroundColor: statusColors[shipment.status || shipment.shipment_status ] },
              ]}
            >
              <Text style={styles.statusTextLarge}>{shipment.status || shipment.shipment_status}</Text>
            </View>
          </View>

          {/* Shipment Info */}
          <View style={styles.detailItem}>
            <MaterialIcons name="local-shipping" size={20} color="#6430B9CC" />
            <Text style={styles.detailText}>Truck Type: {shipment.truckType || shipment.truckTypeId.name}</Text>
          </View>

          <View style={styles.detailItem}>
            <MaterialIcons name="place" size={20} color="#6430B9CC" />
            <Text style={styles.detailText}>
              Destination: { shipment.destination_city}, { shipment.destination_state}
            </Text>
          </View>

          {/* <View style={styles.detailItem}>
            <MaterialIcons name="access-time" size={20} color="#6430B9CC" />
            <Text style={styles.detailText}>
              Expected: {formatDateTime(shipment.actual_arrival_date) || formatDateTime(shipment.expectedArrival)}
            </Text>
          </View> */}

          {/* Action Buttons */}
          {isAssignShipment ? (
            <TouchableOpacity style={styles.actionButton} onPress={onAssign}>
              <Text style={styles.actionButtonText}>{title|| "Assign Shipment"}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.actionButton} onPress={onClose}>
              <Text style={styles.actionButtonText}>Close Details</Text>
            </TouchableOpacity>
          )}
        </View>
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
    paddingBottom: 30, // Ensure proper spacing at the bottom
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    paddingBottom: 12,
    marginTop:5
  },
  sheetTitle: {
    fontSize: scaleFont(18),
    fontWeight: "bold",
    color: "#6430B9CC",
  },
  closeButton: {
    padding: 4,
  },
  sheetContent: {
    gap: 16,
  },
  shipmentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop:5
  },
  shipmentNumberLarge: {
    fontSize: scaleFont(18),
    fontWeight: "bold",
    color: "#2C3E50",
  },
  statusBadgeLarge: {
    paddingVertical: scalePaddingVertical(6),
    paddingHorizontal: scalePaddingHorizontal(14),
    borderRadius: 15,
  },
  statusTextLarge: {
    color: "#FFFFFF",
    fontSize: scaleFont(14),
    fontWeight: "600",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingVertical: scalePaddingVertical(10), // Increased padding for better readability
  },
  detailText: {
    fontSize: scaleFont(15),
    color: "#2C3E50",
  },
  actionButton: {
    backgroundColor: "#6430B9CC",
    padding: scalePadding(14),
    borderRadius: 10,
    alignItems: "center",
    marginTop: 16,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: scaleFont(16),
    fontWeight: "600",
  },
});

export default ShipmentDetailsSheet;
