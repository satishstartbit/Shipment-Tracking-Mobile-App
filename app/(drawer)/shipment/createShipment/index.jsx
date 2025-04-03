import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
  TextInput,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { PaperProvider } from "react-native-paper";
import { useRouter } from "expo-router";
import DropdownSelector from "../../../../components/DropdownSelector";
import { ButtonComponent } from "../../../../components/ButtonComponent";
import { useApi } from "../../../../hooks/useApi";
import * as SecureStore from "expo-secure-store";
import {
  scaleFont,
  scalePadding,
  scalePaddingHorizontal,
  scalePaddingVertical,
} from "../../../../constants/font";
import ShipmentDetailsSheet from "../../../../components/ShipmentDetailsSheet";
import ModalComponent from "../../../../components/ModalComponent";
import { jwtDecode } from "jwt-decode";
// Validation Schema
const shipmentSchema = yup.object().shape({
  truckType: yup.string().required("Truck type is required"),
  destinationCity: yup.string().required("Destination city is required"),
  destinationState: yup.string().required("Destination state is required"),

});

const countries = [
  { label: "USA", value: "USA" },
  { label: "Canada", value: "Canada" },
  { label: "Mexico", value: "Mexico" },
];

const states = [
  { label: "California", value: "California" },
  { label: "New York", value: "New York" },
  { label: "Texas", value: "Texas" },
];

const cities = [
  { label: "Los Angeles", value: "Los Angeles" },
  { label: "New York City", value: "New York City" },
  { label: "Houston", value: "Houston" },
];

const CreateShipmentScreen = () => {
  const router = useRouter();
  const { apiRequest, loading:apiLoading } = useApi();
  const [truckTypes, setTruckTypes] = useState([]);
  const [loadingTrucks, setLoadingTrucks] = useState(true);
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [shipmentData, setShipmentData] = useState({});
  const [shipmentNumber, setShipmentNumber] = useState("");
  const [shipmentId, setShipmentId] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(shipmentSchema),
    defaultValues: { shipmentStatus: "new" },
  });

  // Fetch truck types
  useEffect(() => {
    const fetchTruckTypes = async () => {
      try {
        const response = await apiRequest(
          "/shipment/getalltrucktype",
          "GET",
          null,
          true
        );

        if (response) {
          const formattedTrucks = response.truckTypes.map((truck) => ({
            label: truck.name,
            value: truck._id,
          }));

          setTruckTypes(formattedTrucks);
        }
      } catch (error) {
        console.error("Error fetching truck types:", error);
      } finally {
        setLoadingTrucks(false);
      }
    };

    const fetchShipmentNumber = async () => {
      try {
        const payload = { userId: await SecureStore.getItemAsync("uid") };
        console.log("uid", payload);
        const response = await apiRequest(
          "/shipment/createshipmentnumber",
          "POST",
          payload,
          true
        );

        if (response) {
          console.log("");
          setShipmentId(response.shipment._id);
          setShipmentNumber(response.shipment.shipment_number);
        }
      } catch (error) {
        console.error("Error fetching shipment number:", error);
      }
    };

    fetchShipmentNumber();
    fetchTruckTypes();
  }, []);

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

  const onSubmit = async (data) => {
    try {
      console.log("ddddadda", data);
      const payload = {
        shipment_status: "planned",
        destination_city: data.destinationCity,
        destination_state: data.destinationState,
        truckTypeId: data.truckType,
        shipment_id: shipmentId,
        userid: await SecureStore.getItemAsync("uid"),
      };

      console.log("pay", payload);
      const response = await apiRequest(
        "/shipment/createshipment",
        "POST",
        payload
      );

      if (response) {
        setShipmentData({
          shipment_number: response.shipment.shipment_number,
          shipment_status: response.shipment.shipment_status,
        });
        setIsSheetVisible(true);
      }
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
          {shipmentNumber ? (
            <TextInput
              style={styles.readonlyInput}
              value={shipmentNumber}
              editable={false}
            />
          ) : (
            <ActivityIndicator size="small" color="#E53935" />
          )}
        </View>
        {/* Truck Type Dropdown */}
        {loadingTrucks ? (
          <ActivityIndicator size="small" color="#E53935" />
        ) : (
          <Controller
            control={control}
            name="truckType"
            render={({ field: { value, onChange } }) => {
              // Find the selected truck name based on its ID
              const selectedTruck = truckTypes.find(
                (truck) => truck.value === value
              );

              return (
                <DropdownSelector
                  label="Truck Type"
                  options={truckTypes}
                  value={selectedTruck ? selectedTruck.label : ""}
                  setValue={(val) => {
                    const selectedTruck = truckTypes.find(
                      (truck) => truck.label === val
                    );
                    onChange(selectedTruck ? selectedTruck.value : val);
                  }}
                  error={errors.truckType?.message}
                />
              );
            }}
          />
        )}

        <Controller
          control={control}
          name="destinationState"
          render={({ field: { value } }) => (
            <DropdownSelector
              label="Destination State"
              options={states}
              value={value}
              setValue={(val) => setValue("destinationState", val)}
              error={errors.destinationState?.message}
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

        {/* Submit Button */}
        <ButtonComponent
          title={ "Submit"}
          onPress={handleSubmit(onSubmit)}
          buttonStyle={styles.submitButton}
          disabled={apiLoading}
          loading={apiLoading}
        />

        <ModalComponent
          visible={isSheetVisible}
          onClose={() => setIsSheetVisible(false)}
          shipment={shipmentData}
          redirectTo="/shipment/assignShipment" // 🚀 Pass the screen to navigate to
        />
      </View>
    </PaperProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: scalePadding(20), backgroundColor: "#fff" },
  title: { fontSize: scaleFont(20), fontWeight: "bold", marginBottom: 15 },
  submitButton: {
    backgroundColor: "#E53935",
    paddingVertical: scalePaddingVertical(14),
    borderRadius: 30,
    alignItems: "center",
  },
  inputContainer: { marginBottom: 15 },
  label: { fontSize: scaleFont(14), fontWeight: "500", marginBottom: 5 },
  readonlyInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingVertical: scalePaddingVertical(14),
    paddingHorizontal: scalePaddingHorizontal(12),
    backgroundColor: "#f8f8f8",
  },
  selectedText: { color: "#000" },
});

export default CreateShipmentScreen;
