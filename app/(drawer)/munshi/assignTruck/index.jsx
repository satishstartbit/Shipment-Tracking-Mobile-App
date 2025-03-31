import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { PaperProvider } from "react-native-paper";
import { useRouter } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { ButtonComponent } from "../../../../components/ButtonComponent";

// Validation Schema
const shipmentSchema = yup.object().shape({
  truckNumber: yup.string().required("Truck number is required"),
  driverName: yup.string().required("Driver name is required"),
  driverMobile: yup
    .string()
    .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits")
    .required("Driver mobile number is required"),
  plannedArrival: yup.date().required("Planned arrival date is required"),
});

const AssignShipmentScreen = () => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: yupResolver(shipmentSchema),
    defaultValues: {
      truckNumber: "",
      driverName: "",
      driverMobile: "",
      plannedArrival: "",
    },
  });

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // Handle Date Selection
  const handleDateConfirm = (event, date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      setValue("plannedArrival", date);
    }
  };

  // Handle Time Selection
  const handleTimeConfirm = (event, time) => {
    setShowTimePicker(false);
    if (time) {
      setSelectedTime(time);
    }
  };

  const onSubmit = (data) => {
    console.log("Shipment Assigned:", {
      ...data,
      plannedArrivalDate: selectedDate.toLocaleDateString(),
      plannedArrivalTime: selectedTime.toLocaleTimeString(),
    });
    router.push("/munshi/viewShipment");
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.title}>Assign Shipment</Text>

        {/* Truck Number */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Truck Number</Text>
          <Controller
            control={control}
            name="truckNumber"
            render={({ field: { value, onChange } }) => (
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChange}
                placeholder="Enter truck number"
              />
            )}
          />
          {errors.truckNumber && (
            <Text style={styles.error}>{errors.truckNumber.message}</Text>
          )}
        </View>

        {/* Driver Name */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Driver Name</Text>
          <Controller
            control={control}
            name="driverName"
            render={({ field: { value, onChange } }) => (
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChange}
                placeholder="Enter driver name"
              />
            )}
          />
          {errors.driverName && (
            <Text style={styles.error}>{errors.driverName.message}</Text>
          )}
        </View>

        {/* Driver Mobile Number */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Driver Mobile Number</Text>
          <Controller
            control={control}
            name="driverMobile"
            render={({ field: { value, onChange } }) => (
              <TextInput
                style={styles.input}
                value={value}
                onChangeText={onChange}
                placeholder="Enter mobile number"
                keyboardType="phone-pad"
              />
            )}
          />
          {errors.driverMobile && (
            <Text style={styles.error}>{errors.driverMobile.message}</Text>
          )}
        </View>

        {/* Planned Arrival Date */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Planned Arrival Date</Text>
          <TouchableOpacity
            onPress={() => setShowDatePicker(true)}
            style={styles.datePickerButton}
          >
            <Text style={styles.datePickerText}>
              {selectedDate ? selectedDate.toLocaleDateString() : "Select Date"}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date" // ✅ Only date
              display={Platform.OS === "android" ? "calendar" : "spinner"}
              onChange={handleDateConfirm}
            />
          )}
        </View>

        {/* Planned Arrival Time */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Planned Arrival Time</Text>
          <TouchableOpacity
            onPress={() => setShowTimePicker(true)}
            style={styles.datePickerButton}
          >
            <Text style={styles.datePickerText}>
              {selectedTime ? selectedTime.toLocaleTimeString() : "Select Time"}
            </Text>
          </TouchableOpacity>

          {showTimePicker && (
            <DateTimePicker
              value={selectedTime}
              mode="time" 
              display={Platform.OS === "android" ? "clock" : "spinner"}
              onChange={handleTimeConfirm}
            />
          )}
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

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20 },
  inputContainer: { marginBottom: 15 },
  label: { fontSize: 14, fontWeight: "500", marginBottom: 5 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: "#f8f8f8",
  },
  error: { color: "red", fontSize: 12, marginTop: 5 },
  datePickerButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
    backgroundColor: "#f8f8f8",

  },
  datePickerText: { fontSize: 16, color: "#000" },
  submitButton: {
    backgroundColor: "#E53935",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20,
  },
});

export default AssignShipmentScreen;
