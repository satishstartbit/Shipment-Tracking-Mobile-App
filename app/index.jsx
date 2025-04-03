import { useRouter } from "expo-router";
import React, { useEffect, useRef } from "react";
import { Animated, Dimensions, Image, StyleSheet, View } from "react-native";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";



const { width, height } = Dimensions.get("window");

const SplashScreen = () => {
  const router = useRouter();

  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      }),
    ]).start();
  
    const checkAuth = async () => {
      await new Promise((resolve) => setTimeout(resolve, 4000)); // Delay to ensure splash screen shows
  
      const token = await SecureStore.getItemAsync("authToken");
      const role = await SecureStore.getItemAsync("uRole");
      const uid = await SecureStore.getItemAsync("uid");
  
      if (token && role && uid) {
        const decoded = jwtDecode(token);
        const currentTime = Math.floor(Date.now() / 1000);
  
        if (decoded.exp < currentTime) {
          await SecureStore.deleteItemAsync("authToken");
          await SecureStore.deleteItemAsync("uRole");
          await SecureStore.deleteItemAsync("uid");
          router.replace("/(auth)/login");
        } else {
          router.replace("/(drawer)");
        }
      } else {
        router.replace("/(auth)/login");
      }
    };
  
    checkAuth();
  }, [opacity, scale, router]);
  

  return (
    <View style={styles.container}>
      <Animated.View
        style={{
          opacity: opacity,
          transform: [{ scale: scale }],
        }}
      >
        <Image
          source={require("../assets/images/Campa_Logo.png")}
          style={styles.image}
        />
        <Image
          source={require("../assets/images/splashCampa1.png")}
          style={styles.image1}
        />
        <Image
          source={require("../assets/images/splashCampa2.png")}
          style={styles.image2}
        />
      </Animated.View>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6430B9CC", // Updated background color
  },
  image: {
    position: "absolute",
    top: width * 0.6,
    left: "100",
    width: 200,
    height: 100,
  },
  image1: {
    width: 195,
    height: 430,
    position: "absolute",
    top: width * 1,
    left: 20,
    zIndex: 4,
  },
  image2: {
    width: 170,
    height: 300,
    position: "absolute",
    top: width * 1.2,
    zIndex: 4,
    right: "8%",
  },
});
