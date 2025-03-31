import React from "react";
import { View, Text, StyleSheet, Alert } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { PaperProvider } from "react-native-paper";
import { useRouter } from "expo-router";
import DropdownSelector from "../../../../components/DropdownSelector";
import { ButtonComponent } from "../../../../components/ButtonComponent";
import { useApi } from "../../../../hooks/useApi"; // Import the API hook

// Validation Schema
const shipmentSchema = yup.object().shape({
  truckType: yup.string().required("Truck type is required"),
  destinationCity: yup.string().required("Destination city is required"),
});

const truckTypes = [
  { label: "Small", value: "Small" },
  { label: "Medium", value: "Medium" },
  { label: "Large", value: "Large" },
];

const cities = [
  { label: "New York", value: "New York" },
  { label: "Los Angeles", value: "Los Angeles" },
  { label: "Chicago", value: "Chicago" },
];

const CreateShipmentScreen = () => {
  const router = useRouter();
  const { apiRequest, loading } = useApi(); // Use API hook
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(shipmentSchema),
    defaultValues: { shipmentStatus: "new" },
  });

  const onSubmit = async (data) => {
    try {
      const payload = {
        shipment_status: "new",
        destination_city: data.destinationCity,
        truck_type: data.truckType,
        userid: "67e636d91a69d6a4496df0db", // Change this dynamically if needed
      };

      const response = await apiRequest("/shipment/createshipment", "POST", payload);
      console.log("cRE",response)
      Alert.alert("Success", "Shipment created successfully!");
      router.push("/shipment/viewShipment");
    } catch (error) {
      console.error("Error creating shipment:", error);
    }
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.title}>Create Shipment</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Shipment Number</Text>
          <View style={styles.readonlyInput}>
            <Text style={styles.selectedText}>SHIP-1234</Text>
          </View>
        </View>

        {/* Truck Type Dropdown */}
        <Controller
          control={control}
          name="truckType"
          render={({ field: { value } }) => (
            <DropdownSelector
              label="Truck Type"
              options={truckTypes}
              value={value}
              setValue={(val) => setValue("truckType", val)}
              error={errors.truckType?.message}
            />
          )}
        />

        {/* Destination City Dropdown */}
        <Controller
          control={control}
          name="destinationCity"
          render={({ field: { value } }) => (
            <DropdownSelector
              label="Destination City"
              options={cities}
              value={value}
              setValue={(val) => setValue("destinationCity", val)}
              error={errors.destinationCity?.message}
            />
          )}
        />

        {/* Read-Only Shipment Status */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Shipment Status</Text>
          <View style={styles.readonlyInput}>
            <Text style={styles.selectedText}>Planned</Text>
          </View>
        </View>

        {/* Submit Button */}
        <ButtonComponent
          title={loading ? "Submitting..." : "Submit"}
          onPress={handleSubmit(onSubmit)}
          buttonStyle={styles.submitButton}
          disabled={loading}
        />
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  submitButton: {
    backgroundColor: "#E53935",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },
  inputContainer: { marginBottom: 15 },
  label: { fontSize: 14, fontWeight: "500", marginBottom: 5 },
  readonlyInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: "#f8f8f8",
  },
  selectedText: { color: "#000" },
});

export default CreateShipmentScreen;
