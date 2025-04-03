import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Input } from "../../../components/input";
import { ButtonComponent } from "../../../components/button";
import { useRouter } from "expo-router";
import { Menu, PaperProvider } from "react-native-paper";

// Validation Schema
const shipmentSchema = yup.object().shape({
  truckType: yup.string().required("Truck type is required"),
  destinationCity: yup.string().required("Destination city is required"),
});

const CreateShipmentScreen = () => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(shipmentSchema),
    defaultValues: {
      shipmentStatus: "Planned",
    },
  });

  const [truckTypeVisible, setTruckTypeVisible] = useState(false);
  const [cityVisible, setCityVisible] = useState(false);

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

  const onSubmit = (data) => {
    console.log("Shipment Data:", data);
    // Handle submission logic here
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.title}>Create Shipment</Text>

        {/* Truck Type */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Truck Type</Text>
          <Controller
            control={control}
            name="truckType"
            render={({ field: { value } }) => (
              <Menu
                visible={truckTypeVisible}
                onDismiss={() => setTruckTypeVisible(false)}
                anchor={
                  <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => setTruckTypeVisible(true)}
                  >
                    <Text style={value ? styles.selectedText : styles.placeholderText}>
                      {value || "Select Truck Type"}
                    </Text>
                  </TouchableOpacity>
                }
              >
                {truckTypes.map((item) => (
                  <Menu.Item
                    key={item.value}
                    onPress={() => {
                      setValue("truckType", item.value);
                      setTruckTypeVisible(false);
                    }}
                    title={item.label}
                  />
                ))}
              </Menu>
            )}
          />
          {errors.truckType && <Text style={styles.errorText}>{errors.truckType.message}</Text>}
        </View>

        {/* Destination City */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Destination City</Text>
          <Controller
            control={control}
            name="destinationCity"
            render={({ field: { value } }) => (
              <Menu
                visible={cityVisible}
                onDismiss={() => setCityVisible(false)}
                anchor={
                  <TouchableOpacity
                    style={styles.dropdown}
                    onPress={() => setCityVisible(true)}
                  >
                    <Text style={value ? styles.selectedText : styles.placeholderText}>
                      {value || "Select Destination City"}
                    </Text>
                  </TouchableOpacity>
                }
              >
                {cities.map((item) => (
                  <Menu.Item
                    key={item.value}
                    onPress={() => {
                      setValue("destinationCity", item.value);
                      setCityVisible(false);
                    }}
                    title={item.label}
                  />
                ))}
              </Menu>
            )}
          />
          {errors.destinationCity && <Text style={styles.errorText}>{errors.destinationCity.message}</Text>}
        </View>

        {/* Shipment Status (Readonly) */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Shipment Status</Text>
          <View style={styles.readonlyInput}>
            <Text style={styles.selectedText}>Planned</Text>
          </View>
        </View>

        {/* Submit Button */}
        <ButtonComponent 
          title="Submit" 
          onPress={handleSubmit(onSubmit)} 
          buttonStyle={styles.submitButton} 
        />
      </View>
    </PaperProvider>
  );
};

// Updated Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  inputContainer: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 5,
  },
  dropdown: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  placeholderText: {
    color: "#aaa",
  },
  selectedText: {
    color: "#000",
  },
  readonlyInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: "#f8f8f8",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
  submitButton: {
    backgroundColor: "#E53935",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
  },
});

export default CreateShipmentScreen;
