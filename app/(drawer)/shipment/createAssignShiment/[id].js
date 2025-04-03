import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { PaperProvider } from "react-native-paper";
import { useRouter } from "expo-router";
import DropdownSelector from "../../../../components/DropdownSelector";
import { ButtonComponent } from "../../../../components/ButtonComponent";
import { useLocalSearchParams } from "expo-router";
import { useApi } from "../../../../hooks/useApi"; // Import your custom hook
import {
  scaleFont,
  scalePadding,
  scalePaddingHorizontal,
  scalePaddingVertical,
} from "../../../../constants/font";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ScrollView } from "react-native";
import ModalComponent from "../../../../components/ModalComponent";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
// Validation Schema
const shipmentSchema = yup.object().shape({
  transportCompany: yup.string().required("Transport company is required"),
  mobileNumber: yup
    .string()
    .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits")
    .required("Munshi mobile number is required"),
  additionalMobileNumbers: yup
    .array()
    .of(
      yup
        .string()
        .matches(/^[0-9]{10}$/, "Each mobile number must be exactly 10 digits")
    )
    .required("At least one additional mobile number is required"),
});

const CreateAssignShipmentScreen = () => {
  const router = useRouter();
  const { apiRequest, loading: apiLoading } = useApi();
  const shipment = useLocalSearchParams();

  const [shipmentNumber, shipId] = shipment.id.split("_");

  const [transportCompanies, setTransportCompanies] = useState([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(shipmentSchema),
    defaultValues: {
      shipmentStatus: "Planned",
      transportCompany: "",
      mobileNumber: "",
      additionalMobileNumbers: [],
    },
  });

  const [additionalMobileNumbers, setAdditionalMobileNumbers] = useState([]);
  const [isSheetVisible, setIsSheetVisible] = useState(false);
  const [shipmentData, setShipmentData] = useState({});
  // Fetch transport companies on component mount
  useEffect(() => {
    const fetchTransportCompanies = async () => {
      try {
        const response = await apiRequest("/api/company", "GET", null, true);
        const companies = response.CompanyListing.map((company) => ({
          label: company.company_name,
          value: company._id, // Using company ID as the value
        }));
        setTransportCompanies(companies);
      } catch (error) {
        console.error("Error fetching transport companies:", error);
      } finally {
        setLoadingCompanies(false);
      }
    };

    fetchTransportCompanies();
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
    const payload = {
      companyId: data.transportCompany,
      shipmentId: shipId,
    };

    const response = await apiRequest(
      "/shipment/assignshipment",
      "POST",
      payload
    );

    if (response) {
      console.log("assign", response);
      setShipmentData({
        shipment_number: response.shipment.shipment_number,
        shipment_status: response.shipment.shipment_status,
      });
      setIsSheetVisible(true);
    }

    // Alert.alert("Success", "Assign Shipment created successfully!");
    // router.push("/shipment/assignShipment");
  };

  const handleAddMobileNumber = () => {
    if (additionalMobileNumbers.length < 2) {
      setAdditionalMobileNumbers([...additionalMobileNumbers, ""]);
    }
  };

  const handleChangeMobileNumber = (index, value) => {
    const updatedMobileNumbers = [...additionalMobileNumbers];
    updatedMobileNumbers[index] = value;
    setAdditionalMobileNumbers(updatedMobileNumbers);
    setValue("additionalMobileNumbers", updatedMobileNumbers);
  };

  // Display shipment number from params if available
  const displayShipmentNumber = shipmentNumber;

  return (
    <PaperProvider>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <View style={styles.titleContainer}>
            <Text style={styles.title}>Assign Shipment</Text>

            <TouchableOpacity
              style={styles.button}
              onPress={handleAddMobileNumber}
            >
              <Ionicons name="add-circle-outline" size={18} color="white" />
              <Text style={styles.buttonText}> Mobile</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.label}>Shipment Number</Text>
            <View style={styles.readonlyInput}>
              <Text style={styles.selectedText}>{displayShipmentNumber}</Text>
            </View>
          </View>

          {/* Transport Company Dropdown */}
          {loadingCompanies ? (
            <Text>Loading transport companies...</Text>
          ) : (
            <Controller
              control={control}
              name="transportCompany"
              render={({ field: { value, onChange } }) => {
                const selectedcompany = transportCompanies.find(
                  (company) => company.value === value
                );
                return (
                  <DropdownSelector
                    label="Transport Company"
                    options={transportCompanies}
                    value={selectedcompany ? selectedcompany.label : ""}
                    setValue={(val) => {
                      const selectedcompany = transportCompanies.find(
                        (company) => company.label === val
                      );
                      onChange(selectedcompany ? selectedcompany.value : val);
                    }}
                    error={errors.transportCompany?.message}
                  />
                );
              }}
            />
          )}

          {/* Munshi Mobile Number */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Munshi Mobile Number</Text>
            <Controller
              control={control}
              name="mobileNumber"
              render={({ field: { value, onChange } }) => (
                <>
                  <TextInput
                    style={styles.input}
                    value={value || ""}
                    onChangeText={onChange}
                    placeholder="Enter mobile number"
                    keyboardType="phone-pad"
                  />
                  {errors.mobileNumber && (
                    <Text style={styles.error}>
                      {errors.mobileNumber.message}
                    </Text>
                  )}
                </>
              )}
            />
          </View>

          {/* Additional Mobile Numbers */}
          {additionalMobileNumbers.map((mobile, index) => (
            <View key={index} style={styles.inputContainer}>
              <Text style={styles.label}>
                Additional Mobile Number {index + 1}
              </Text>
              <TextInput
                style={styles.input}
                value={mobile}
                onChangeText={(text) => handleChangeMobileNumber(index, text)}
                placeholder="Enter mobile number"
                keyboardType="phone-pad"
              />
              {errors.additionalMobileNumbers?.[index] && (
                <Text style={styles.error}>
                  {errors.additionalMobileNumbers[index]?.message}
                </Text>
              )}
            </View>
          ))}

          {/* Submit Button */}
          <ButtonComponent
            title="Submit"
            onPress={handleSubmit(onSubmit)}
            buttonStyle={styles.submitButton}
            disabled={apiLoading}
            loading={apiLoading}
          />

          <ModalComponent
            visible={isSheetVisible}
            onClose={() => setIsSheetVisible(false)}
            shipment={shipmentData}
            redirectTo="/shipment/viewShipment" // 🚀 Pass the screen to navigate to
          />
        </View>
      </ScrollView>
    </PaperProvider>
  );
};

// Your styles remain the same
const styles = StyleSheet.create({
  container: { flex: 1, padding: scalePadding(20), backgroundColor: "#fff" },
  title: { fontSize: scaleFont(20), fontWeight: "bold" },
  submitButton: {
    backgroundColor: "#E53935",
    paddingVertical: scalePaddingVertical(15),
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20,
  },
  titleContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    fontSize: scaleFont(2),
    fontWeight: "bold",
    color: "#fff",
  },
  addMobileButton: {
    width: 50,
    height: 50,
    backgroundColor: "#D32F2F",
    paddingVertical: scalePaddingVertical(2),
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: { marginBottom: 15 },
  label: { fontSize: scaleFont(14), fontWeight: "500", marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingVertical: scalePaddingVertical(14),
    paddingHorizontal: scalePaddingHorizontal(12),
    backgroundColor: "#f8f8f8",
  },
  readonlyInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingVertical: scalePaddingVertical(14),
    paddingHorizontal: scalePaddingHorizontal(12),
    backgroundColor: "#f8f8f8",
  },
  selectedText: { color: "#000" },
  error: {
    color: "red",
    fontSize: scaleFont(12),
    marginTop: 5,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#D32F2F",
    padding: scalePadding(6),
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    fontSize: scaleFont(14),
    marginLeft: 2,
  },
});

export default CreateAssignShipmentScreen;
