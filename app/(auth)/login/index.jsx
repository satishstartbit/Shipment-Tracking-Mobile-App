import React, { useState } from "react";
import { View, Text, StyleSheet, Image, Alert } from "react-native";
import { InputComponent } from "../../../components/InputComponent";
import { ButtonComponent } from "../../../components/ButtonComponent";
import { Stack } from "expo-router";
import { useRouter } from "expo-router";
import { useAuth } from "../../../context/authContext";

const LoginScreen = () => {
  const router = useRouter(); // Used for navigation

  // State for storing form data
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  // State for tracking form validation errors
  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const { onLogin } = useAuth();

  // Function to handle input changes and update the state
  const handleInputChange = (field, value) => {
    console.log("ff", field, value);
    setFormData({
      ...formData,
      [field]: value,
    });

    // Clear validation error when the user starts typing
    if (errors[field]) {
      setErrors({
        ...errors,
        [field]: "",
      });
    }
  };

  // Function to validate form inputs before submission
  const validateForm = () => {
    let valid = true;
    const newErrors = { username: "", password: "" };

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
      valid = false;
    } else if (formData.username.length < 4) {
      newErrors.username = "Username must be at least 4 characters";
      valid = false;
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Function to handle form submission
  const handleSubmit = async () => {
    console.log("kk", formData);
    setLoading(true); // Start loading
    try {
      await onLogin(formData.username, formData.password);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <>
      <View style={styles.container}>
        {/* Decorative top-right design */}
        <View style={styles.topRightDesign} />

        {/* App logo */}
        <Image
          source={require("../../../assets/images/Campa_Logo.png")}
          style={styles.logo}
        />

        {/* Login title */}
        <Text style={styles.title}>Login</Text>
        <Text style={styles.subtitle}>
          Login to your desired job, create shipment, team up.
        </Text>

        {/* Username Input Field */}
        <InputComponent
          label={"Username"}
          placeholder="Enter Username"
          value={formData.username}
          onChangeText={(text) => handleInputChange("username", text)}
          containerStyle={styles.inputContainer}
          labelStyle={styles.label}
          inputStyle={styles.input}
        />

        {/* Display username error message */}
        {errors.username && (
          <Text style={styles.errorText}>User name is required</Text>
        )}

        {/* Password Input Field */}
        <InputComponent
          label={"Password"}
          placeholder="Enter Password"
          value={formData.password}
          onChangeText={(text) => handleInputChange("password", text)}
          containerStyle={styles.inputContainer}
          labelStyle={styles.label}
          inputStyle={styles.input}
          secureTextEntry={true} // Hides password text
        />

        {/* Display password error message */}
        {errors.password && (
          <Text style={styles.errorText}>Password is required</Text>
        )}

        {/* Login Button */}
        <ButtonComponent
          title="LOGIN"
          onPress={handleSubmit}
          button={styles.loginButton}
          buttonText={styles.loginButtonText}
          loading={loading}
        />

        {/* Terms and Conditions */}
        <Text style={styles.footerText}>
          By continuing, you agree to our{" "}
          <Text style={styles.link}>Terms and Conditions</Text> and have read
          our <Text style={styles.link}>Privacy Policy</Text>.
        </Text>

        {/* Decorative bottom-left design */}
        <View style={styles.bottomLeftDesign} />
      </View>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: "center",
    backgroundColor: "#F9F6F2",
    position: "relative",
  },
  topRightDesign: {
    position: "absolute",
    top: -40,
    right: -40,
    width: 150,
    height: 150,
    backgroundColor: "#6430B9CC",
    borderBottomLeftRadius: 100,
  },
  bottomLeftDesign: {
    position: "absolute",
    bottom: -40,
    left: -40,
    width: 150,
    height: 150,
    backgroundColor: "#6430B9CC",
    borderTopRightRadius: 100,
  },
  logo: {
    width: 120,
    height: 100,
    alignSelf: "center",
    marginBottom: 10,
    resizeMode: "contain",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    textAlign: "center",
    color: "#D32F2F",
    marginBottom: 10,
  },
  subtitle: {
    textAlign: "center",
    color: "#2C3E50",
    fontSize: 14,
    marginBottom: 30,
    fontWeight: "500",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontWeight: "bold",
    color: "#2C3E50",
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#6430B9CC",
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#FFF5E1",
  },
  loginButton: {
    backgroundColor: "#6430B9CC",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  loginButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 18,
  },
  footerText: {
    textAlign: "center",
    color: "#2C3E50",
    fontSize: 12,
    marginTop: 30,
  },
  link: {
    color: "#D32F2F",
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    fontSize: 12,
  },
});

export default LoginScreen;
