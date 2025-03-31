import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { PaperProvider } from "react-native-paper";
import { useRouter } from "expo-router";
import { ButtonComponent } from "../../../../components/ButtonComponent"; // Assuming you have the ButtonComponent

// Validation Schema for Doc Number
const docNumberSchema = yup.object().shape({
  docNumber: yup
    .string()
    .matches(/^[A-Za-z0-9-]+$/, "Doc number can only contain letters, numbers, and dashes")
    .required("Doc number is required"),
});

const AssignDocNumberScreen = () => {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(docNumberSchema),
    defaultValues: {
      docNumber: "",
    },
  });

  const onSubmit = (data) => {
    console.log("Doc Number Data:", data);
    // Handle submission of doc number and any logic related to assigning shipment
    router.push('/docNumber/viewDocShipment'); // Adjust the route if needed
  };

  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text style={styles.title}>Create Doc Number</Text>

        {/* Doc Number Field */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Document Number</Text>
          <Controller
            control={control}
            name="docNumber"
            render={({ field: { value, onChange } }) => (
              <>
                <TextInput
                  style={styles.input}
                  value={value || ""}
                  onChangeText={onChange}
                  placeholder="Enter Document Number"
                />
                {errors.docNumber && (
                  <Text style={styles.error}>{errors.docNumber.message}</Text>
                )}
              </>
            )}
          />
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
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 15 },
  submitButton: {
    backgroundColor: "#E53935",
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 20,
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
  error: {
    color: "red",
    fontSize: 12,
    marginTop: 5,
  },
});

export default AssignDocNumberScreen;
