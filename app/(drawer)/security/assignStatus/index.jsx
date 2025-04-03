import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Switch } from 'react-native';
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
const StatusToggle = () => {
  const [isGateIn, setIsGateIn] = useState(true);
  const [status, setStatus] = useState('Gate In');

  const toggleStatus = () => {
    const newStatus = isGateIn ? 'Gate Out' : 'Gate In';
    setIsGateIn(!isGateIn);
    setStatus(newStatus);

    
    // Add your status change logic here:
    // - API calls
    // - State updates
    // - Other business logic
  };


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
  const changeStatusManually = () => {
    const newStatus = isGateIn ? 'Gate Out' : 'Gate In';
    setStatus(newStatus);
    setIsGateIn(!isGateIn);

    router.navigate('security/viewSecurityShipment')
  };

  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>Confirmed The Status</Text>
        
        <View style={styles.switchContainer}>
        <Text style={{fontSize:16}}>Gate In</Text>
          <Switch
            value={isGateIn}
            onValueChange={toggleStatus}
            trackColor={{ false: '#D32F2F', true: '#6430B9CC' }}
            thumbColor={isGateIn ? '#6430B9CC' : '#D32F2F'}
          />
              
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.changeButton}
          onPress={changeStatusManually}
          activeOpacity={0.7}
        >
          <Text style={styles.buttonText}>Update status</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor:"#fff"
  },
  statusContainer: {
    marginBottom: 30,
  },
  statusText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  buttonContainer: {
    width: '100%',
  },
  changeButton: {
    backgroundColor: '#6430B9CC',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default StatusToggle;