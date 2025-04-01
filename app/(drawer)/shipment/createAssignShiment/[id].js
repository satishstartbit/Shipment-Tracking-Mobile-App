import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { PaperProvider } from "react-native-paper";
import { useRouter } from "expo-router";
import DropdownSelector from "../../../../components/DropdownSelector";
import { ButtonComponent } from "../../../../components/ButtonComponent";
import { useLocalSearchParams } from 'expo-router';
import { useApi } from "../../../../hooks/useApi"; // Import your custom hook

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

  // Fetch transport companies on component mount
  useEffect(() => {
    const fetchTransportCompanies = async () => {
      try {
        const response = await apiRequest('/api/company', 'GET', null, true);
        const companies = response.CompanyListing.map(company => ({
          label: company.company_name,
          value: company._id // Using company ID as the value
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

  const onSubmit = (data) => {
    console.log("Shipment Data:", {
      companyId:data.transportCompany,
      shipmentId: shipment.id 
    });
    const payload={
      companyId:data.transportCompany,
      shipmentId: shipment.id 
    }
    // Handle shipment status change to "Assigned"
    router.push('/shipment/assignShipment');
  };

  const handleAddMobileNumber = () => {
    setAdditionalMobileNumbers([...additionalMobileNumbers, ""]);
  };

  const handleChangeMobileNumber = (index, value) => {
    const updatedMobileNumbers = [...additionalMobileNumbers];
    updatedMobileNumbers[index] = value;
    setAdditionalMobileNumbers(updatedMobileNumbers);
    setValue("additionalMobileNumbers", updatedMobileNumbers);
  };

  // Display shipment number from params if available
  const displayShipmentNumber = shipment.id ;

  return (
    <PaperProvider>
      <View style={styles.container}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Create Assign Shipment</Text>
          <ButtonComponent
            title="+"
            onPress={handleAddMobileNumber}
            button={styles.addMobileButton}
            buttonText={styles.buttonText}
          />
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
              return (<DropdownSelector
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
              )
            
            }}
          />
        )}

        {/* Rest of your form remains the same */}
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
        />
      </View>
    </PaperProvider>
  );
};

// Your styles remain the same
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold" },
  submitButton: {
    backgroundColor: "#E53935",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20,
  },
  titleContainer:{
     display:"flex",
     flexDirection:"row",
     justifyContent:"space-between",
     alignItems:"center",
     marginBottom:15
  },
  buttonText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#fff",
  },
  addMobileButton: {
    width: 50,
    height: 50,
    backgroundColor: "#D32F2F",
    paddingVertical: 2,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  inputContainer: { marginBottom: 15 },
  label: { fontSize: 14, fontWeight: "500", marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: "#f8f8f8",
  },
  readonlyInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: "#f8f8f8",
  },
  selectedText: { color: "#000" },
  error: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
});

export default CreateAssignShipmentScreen;