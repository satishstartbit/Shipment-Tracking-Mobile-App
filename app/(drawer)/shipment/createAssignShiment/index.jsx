import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { PaperProvider } from "react-native-paper";
import { useRouter } from "expo-router";
import DropdownSelector from "../../../../components/DropdownSelector";
import { ButtonComponent } from "../../../../components/ButtonComponent";


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

const transportCompanies = [
  { label: "Company A", value: "Company A" },
  { label: "Company B", value: "Company B" },
  { label: "Company C", value: "Company C" },
];

const CreateAssignShipmentScreen = () => {
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
      transportCompany: "",
      mobileNumber: "",
      additionalMobileNumbers: [],
    },
  });

  const [additionalMobileNumbers, setAdditionalMobileNumbers] = useState([]);

  const onSubmit = (data) => {
    console.log("Shipment Data:", data);
    // Handle shipment status change to "Assigned"
    // You can navigate to another screen if needed or update shipment status
    router.push('/shipment/assignShipment');
  };

  const handleAddMobileNumber = () => {
    setAdditionalMobileNumbers([...additionalMobileNumbers, ""]);
  };

  const handleChangeMobileNumber = (index, value) => {
    const updatedMobileNumbers = [...additionalMobileNumbers];
    updatedMobileNumbers[index] = value;
    setAdditionalMobileNumbers(updatedMobileNumbers);
    // Update the form value for additional mobile numbers dynamically
    setValue("additionalMobileNumbers", updatedMobileNumbers);
  };

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
            <Text style={styles.selectedText}>SHIP-1234</Text>
          </View>
        </View>

        {/* Transport Company Dropdown */}
        <Controller
          control={control}
          name="transportCompany"
          render={({ field: { value, onChange } }) => (
            <DropdownSelector
              label="Transport Company"
              options={transportCompanies}
              value={value}
              setValue={onChange}
              error={errors.transportCompany?.message}
            />
          )}
        />

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
        />
      </View>
    </PaperProvider>
  );
};

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
    height: 50, // Ensure the button has a proper height
    backgroundColor: "#D32F2F",
    paddingVertical: 2,
    borderRadius: 30,
    alignItems: "center", // Align items horizontally
    justifyContent: "center", // Center items vertically
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
