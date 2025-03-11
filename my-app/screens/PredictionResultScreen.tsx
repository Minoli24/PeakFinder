import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../App"; // Adjust the path to where your RootStackParamList is defined

// Define props for this screen
type PredictionResultScreenProps = {
  route: RouteProp<RootStackParamList, "PredictionResult">;
  navigation: StackNavigationProp<RootStackParamList, "PredictionResult">;
};

const PredictionResultScreen: React.FC<PredictionResultScreenProps> = ({ route }) => {
  const { mountain, restStops, travelMode } = route.params;
  const [distance, setDistance] = useState<number | null>(null);
  const [hikingTime, setHikingTime] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    fetchPredictions();
  }, [mountain, restStops]); // Added dependencies to ensure re-fetching when values change

  // Fetch Distance & Time Predictions
  const fetchPredictions = async () => {
    try {
      const payload = {
        elevation: mountain.elevation,
        weatherEncoded: mountain.weatherEncoded, 
        difficulty: mountain.difficulty,
        restStops: restStops
      };
  
      console.log("Sending Payload:", JSON.stringify(payload, null, 2));
  
      const response = await fetch("http://192.168.1.18:5000/predict/travel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),  //  Send named keys instead of an array
      });
  
      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }
  
      const data = await response.json();
      setDistance(data.distance);
      setHikingTime(data.time);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching predictions:", error);
      Alert.alert("Prediction Error", "Failed to fetch prediction results.");
      setLoading(false);
    }
  };
  
  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <Text style={styles.header}>{mountain.name}</Text>
          <Text style={styles.label}>Distance for the peak</Text>
          <Text style={styles.value}>{distance ? `${distance} km` : "N/A"}</Text>
          <Text style={styles.label}>Average time to complete hike</Text>
          <Text style={styles.time}>{hikingTime ? `${hikingTime} HOURS` : "N/A"}</Text>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f2f2f2" },
  header: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  label: { fontSize: 18, marginTop: 10 },
  value: { fontSize: 22, fontWeight: "bold", color: "green" },
  time: { fontSize: 30, fontWeight: "bold", color: "black" },
});

export default PredictionResultScreen;