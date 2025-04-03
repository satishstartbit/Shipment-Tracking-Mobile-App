import React from "react";
import {
  TouchableOpacity,
  View,
  Text,
  StyleSheet,
  Dimensions,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import {
  scaleFont,
  scalePadding,
  scalePaddingHorizontal,
  scalePaddingVertical,
} from "../constants/font";
const { width, height } = Dimensions.get("window");
// Status Colors Mapping
const statusColors = {
  Planned: "#FFA500",
  loaded: "#D32F2F",
  Assigned: "#4CAF50",
  GateIn: "#0000FF",
  Confirmed: "#008080",
  new: "#000",
};
/**
 * ShipmentCard Component
 * Displays shipment details including shipment number, status, truck type, destination, and expected arrival time.
 *
 * @param {Object} item - Shipment details
 * @param {Function} onPress - Function triggered when card is pressed
 * @param {number} cardWidth - Width of the card
 * @param {Function} formatDateTime - Function to format expected arrival time
 */
const ShipmentCard = ({ item, onPress, cardWidth, formatDateTime }) => {
  return (
    <TouchableOpacity
      style={[styles.card, { width: cardWidth }]}
      onPress={() => onPress(item)}
    >
      {/* Header Section: Shipment Number & Status Badge */}
      <View style={styles.cardHeader}>
        <Text style={styles.shipmentNumber}>
          {item.shipment_number || item.shipmentNumber}
        </Text>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                statusColors[item.status || item.shipment_status],
            }, // Dynamic status color
          ]}
        >
          <Text style={styles.statusText}>
            {item.status || item.shipment_status}
          </Text>
        </View>
      </View>

      <View style={styles.infoRow}>
        <MaterialIcons name="local-shipping" size={16} color="#6430B9CC" />
        <Text style={styles.infoText}>
          {(item.truckType || item.truckTypeId.name)?.length > 10
            ? (item.truckType || item.truckTypeId.name).slice(0, 15) + "..."
            : item.truckType || item.truckTypeId.name}
        </Text>
      </View>
      {/* Body Section: Truck Type, Destination, Expected Arrival */}
      <View style={styles.cardBody}>
        {/* Truck Type */}

        {/* Destination */}
        <View style={styles.infoRow}>
          <MaterialIcons name="place" size={16} color="#6430B9CC" />
          <Text style={styles.infoText}>
            {item.destination_city || item.destination.city}
          </Text>
        </View>
        {/* Expected Arrival Time */}
        {/* <View style={styles.infoRow}>
          <MaterialIcons name="access-time" size={16} color="#6430B9CC" />
          <Text style={styles.infoText}>
            {formatDateTime(item.actual_arrival_date) || " "}
          </Text>
        </View> */}
      </View>
    </TouchableOpacity>
  );
};

// Styles
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFFFFF", // White card background
    borderRadius: 10, // Rounded corners
    padding: scalePadding(14), // Internal spacing
    shadowColor: "#6430B9CC", // Soft shadow effect
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3, // Android shadow
    borderLeftWidth: 3, // Left border for visual distinction
    borderLeftColor: "#6430B9CC", // Primary theme color
    width: "100%",
    marginHorizontal: 4,
    marginBottom: 8,
  },
  cardHeader: {
    flexDirection: "row", // Aligns elements horizontally
    justifyContent: "space-between", // Spaces elements apart
    alignItems: "center", // Aligns items vertically
    marginBottom: 8, // Space below header
    flexWrap: "wrap",
  },
  shipmentNumber: {
    fontSize: scaleFont(14), // Readable text size
    fontWeight: "bold", // Bold for emphasis
    color: "#2C3E50", // Dark text color
  },
  statusBadge: {
    paddingVertical: scalePaddingVertical(3), // Vertical padding for better visibility
    paddingHorizontal: scalePaddingHorizontal(8), // Horizontal padding
    borderRadius: 12, // Rounded badge shape
  },
  statusText: {
    color: "#FFFFFF", // White text on status badge
    fontSize: scaleFont(8), // Small font size
    fontWeight: "600", // Semi-bold for visibility
  },
  cardBody: {
    gap: 12, // Vertical spacing between info rows
    display: "flex",
    flexDirection: "row",
    marginTop: 8,
  },
  infoRow: {
    flexDirection: "row", // Aligns icon & text horizontally
    alignItems: "center", // Centers items vertically
    gap: 6, // Space between icon and text
  },
  infoText: {
    fontSize: scaleFont(12), // Small font size
    color: "#2C3E50", // Dark text color
  },
});

export default ShipmentCard;
