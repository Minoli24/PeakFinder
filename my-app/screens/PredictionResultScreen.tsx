// // import React from "react";
// // import { View, Text, StyleSheet } from "react-native";
// // import { StackScreenProps } from "@react-navigation/stack";
// // import { RootStackParamList } from "../App";

// // type PredictionResultProps = StackScreenProps<RootStackParamList, "PredictionResult">;

// // const PredictionResultScreen: React.FC<PredictionResultProps> = ({ route }) => {
// //   const { mountain, restStops, travelMode } = route.params;

// //   return (
// //     <View style={styles.container}>
// //       <Text style={styles.header}>{mountain.name}</Text>
// //       <Text style={styles.label}>Distance for the peak</Text>
// //       <Text style={styles.value}>5.5 km</Text>
// //       <Text style={styles.label}>Average time to complete hike</Text>
// //       <Text style={styles.time}>03 HOURS</Text>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f2f2f2" },
// //   header: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
// //   label: { fontSize: 18, marginTop: 10 },
// //   value: { fontSize: 22, fontWeight: "bold", color: "green" },
// //   time: { fontSize: 30, fontWeight: "bold", color: "black" },
// // });

// // export default PredictionResultScreen;

// ///////////////////////////////////////////////
// import React, { useEffect, useState } from "react";
// import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
// import { StackScreenProps } from "@react-navigation/stack"; // Import StackScreenProps

// // Define Type for Navigation Params
// type RootStackParamList = {
//   PredictionResult: {
//     mountain: {
//       name: string;
//       latitude: number;
//       longitude: number;
//       elevation: string;
//       difficulty: string;
//       restStops: number;
//     };
//     restStops: string;
//     travelMode: string;
//   };
// };

// // Define the Props Type for Screen
// type PredictionResultProps = StackScreenProps<RootStackParamList, "PredictionResult">;

// const FLASK_API_URL = "http://192.168.1.6:5000/predict/travel"; // Update with your Flask API

// const PredictionResultScreen: React.FC<PredictionResultProps> = ({ route }) => {
//   const { mountain, restStops, travelMode } = route.params;

//   const [loading, setLoading] = useState(true);
//   const [predictions, setPredictions] = useState({ distance: null, time: null });

//   useEffect(() => {
//     fetchPredictions();
//   }, []);

//   const fetchPredictions = async () => {
//     try {
//       const response = await fetch(FLASK_API_URL, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           latitude: mountain.latitude,
//           longitude: mountain.longitude,
//           difficulty: mountain.difficulty === "Hard" ? 2 : mountain.difficulty === "Moderate" ? 1 : 0,
//           restStops: parseInt(restStops),
//           travelMode: travelMode === "Bike" ? 0 : travelMode === "Car" ? 1 : 2,
//         }),
//       });

//       const data = await response.json();
//       setPredictions({ distance: data.distance, time: data.time });
//       setLoading(false);
//     } catch (error) {
//       console.error("Prediction Error:", error);
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>{mountain.name}</Text>

//       {loading ? (
//         <ActivityIndicator size="large" color="#0000ff" />
//       ) : (
//         <>
//           <Text style={styles.label}>Distance for the peak</Text>
//           <Text style={styles.value}>{predictions.distance} km</Text>

//           <Text style={styles.label}>Average time to complete hike</Text>
//           <Text style={styles.time}>{predictions.time} HOURS</Text>
//         </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#f8f8f8",
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   label: {
//     fontSize: 18,
//     fontWeight: "600",
//     marginTop: 10,
//   },
//   value: {
//     fontSize: 22,
//     fontWeight: "bold",
//     color: "#28a745",
//   },
//   time: {
//     fontSize: 28,
//     fontWeight: "bold",
//     color: "#ff5733",
//   },
// });

// export default PredictionResultScreen;

/////////////////////////////////////////////

// import React, { useEffect, useState } from "react";
// import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
// import { RouteProp } from "@react-navigation/native";
// import { StackNavigationProp } from "@react-navigation/stack";

// // ✅ Define type for route parameters
// type RootStackParamList = {
//   PredictionResult: {
//     mountain: {
//       name: string;
//       elevation: number;
//       difficulty: string;
//       restStops: number;
//     };
//     restStops: number;
//     travelMode: string;
//   };
// };

// // ✅ Define props for this screen
// type PredictionResultScreenProps = {
//   route: RouteProp<RootStackParamList, "PredictionResult">;
//   navigation: StackNavigationProp<RootStackParamList, "PredictionResult">;
// };

// const PredictionResultScreen: React.FC<PredictionResultScreenProps> = ({ route }) => {
//   const { mountain, restStops, travelMode } = route.params;
//   const [distance, setDistance] = useState<number | null>(null);
//   const [hikingTime, setHikingTime] = useState<number | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     fetchPredictions();
//   }, []);

//   const fetchPredictions = async () => {
//     try {
//       const features = [mountain.elevation, 2, 1, restStops]; // Example encoding

//       // Fetch Distance Prediction
//       const distanceRes = await fetch("http://192.168.1.12:5000/predict/distance", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ features }),
//       });
//       const distanceData = await distanceRes.json();
//       setDistance(distanceData.prediction[0]);

//       // Fetch Time Prediction
//       const timeRes = await fetch("http://192.168.1.12:5000/predict/time", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ features }),
//       });
//       const timeData = await timeRes.json();
//       setHikingTime(timeData.prediction[0]);

//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching predictions:", error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {loading ? (
//         <ActivityIndicator size="large" color="#0000ff" />
//       ) : (
//         <>
//           <Text style={styles.header}>{mountain.name}</Text>
//           <Text style={styles.label}>Distance for the peak</Text>
//           <Text style={styles.value}>{distance} km</Text>
//           <Text style={styles.label}>Average time to complete hike</Text>
//           <Text style={styles.time}>{hikingTime} HOURS</Text>
//         </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f2f2f2" },
//   header: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
//   label: { fontSize: 18, marginTop: 10 },
//   value: { fontSize: 22, fontWeight: "bold", color: "green" },
//   time: { fontSize: 30, fontWeight: "bold", color: "black" },
// });

// export default PredictionResultScreen;


// import React, { useEffect, useState } from "react";
// import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
// import { RouteProp } from "@react-navigation/native";
// import { StackNavigationProp } from "@react-navigation/stack";

// // ✅ Define type for route parameters
// type RootStackParamList = {
//   PredictionResult: {
//     mountain: {
//       name: string;
//       elevation: number;
//       difficulty: string;
//       restStops: number;
//     };
//     restStops: number;
//     travelMode: string;
//   };
// };

// // ✅ Define props for this screen
// type PredictionResultScreenProps = {
//   route: RouteProp<RootStackParamList, "PredictionResult">;
//   navigation: StackNavigationProp<RootStackParamList, "PredictionResult">;
// };

// const PredictionResultScreen: React.FC<PredictionResultScreenProps> = ({ route }) => {
//   const { mountain, restStops, travelMode } = route.params;
//   const [distance, setDistance] = useState<number | null>(null);
//   const [hikingTime, setHikingTime] = useState<number | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     fetchPredictions();
//   }, [mountain, restStops]); // ✅ Added dependencies to ensure re-fetching when values change

//   // ✅ Fetch Distance & Time Predictions
//   const fetchPredictions = async () => {
//     try {
//       const features = [mountain.elevation, 2, 1, restStops]; // Example encoding

//       // ✅ Fetch Distance Prediction
//       const distanceRes = await fetch("http://192.168.1.6:5000/predict/distance", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ features }),
//       });

//       if (!distanceRes.ok) {
//         throw new Error(`HTTP Error! Status: ${distanceRes.status}`);
//       }

//       const distanceData = await distanceRes.json();
//       setDistance(distanceData.prediction[0]);

//       // ✅ Fetch Time Prediction
//       const timeRes = await fetch("http://192.168.1.6:5000/predict/time", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ features }),
//       });

//       if (!timeRes.ok) {
//         throw new Error(`HTTP Error! Status: ${timeRes.status}`);
//       }

//       const timeData = await timeRes.json();
//       setHikingTime(timeData.prediction[0]);

//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching predictions:", error);
//       Alert.alert("Prediction Error", "Failed to fetch prediction results. Please try again.");
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {loading ? (
//         <ActivityIndicator size="large" color="#0000ff" />
//       ) : (
//         <>
//           <Text style={styles.header}>{mountain.name}</Text>
//           <Text style={styles.label}>Distance for the peak</Text>
//           <Text style={styles.value}>{distance ? `${distance} km` : "N/A"}</Text>
//           <Text style={styles.label}>Average time to complete hike</Text>
//           <Text style={styles.time}>{hikingTime ? `${hikingTime} HOURS` : "N/A"}</Text>
//         </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f2f2f2" },
//   header: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
//   label: { fontSize: 18, marginTop: 10 },
//   value: { fontSize: 22, fontWeight: "bold", color: "green" },
//   time: { fontSize: 30, fontWeight: "bold", color: "black" },
// });


// export default PredictionResultScreen;
// import React, { useEffect, useState } from "react";
// import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
// import { RouteProp } from "@react-navigation/native";
// import { StackNavigationProp } from "@react-navigation/stack";

// // Define type for route parameters
// type RootStackParamList = {
//   PredictionResult: {
//     mountain: {
//       name: string;
//       elevation: number;
//       difficulty: string;
//       restStops: number;
//     };
//     restStops: number;
//     travelMode: string;
//   };
// };

// // Define props for this screen
// type PredictionResultScreenProps = {
//   route: RouteProp<RootStackParamList, "PredictionResult">;
//   navigation: StackNavigationProp<RootStackParamList, "PredictionResult">;
// };

// const PredictionResultScreen: React.FC<PredictionResultScreenProps> = ({ route }) => {
//   const { mountain, restStops, travelMode } = route.params;
//   const [distance, setDistance] = useState<number | null>(null);
//   const [hikingTime, setHikingTime] = useState<number | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     fetchPredictions();
//   }, [mountain, restStops]); // Added dependencies to ensure re-fetching when values change

//   // Fetch Distance & Time Predictions
//   const fetchPredictions = async () => {
//     try {
//       const features = [mountain.elevation, 2, 1, restStops]; // Example encoding

//       // Fetch Distance Prediction
//       const distanceRes = await fetch("http://192.168.1.6:5000/predict/distance", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ features }),
//       });

//       if (!distanceRes.ok) {
//         throw new Error(`HTTP Error! Status: ${distanceRes.status}`);
//       }

//       const distanceData = await distanceRes.json();
//       setDistance(distanceData.prediction[0]);

//       // Fetch Time Prediction
//       const timeRes = await fetch("http://192.168.1.6:5000/predict/time", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ features }),
//       });

//       if (!timeRes.ok) {
//         throw new Error(`HTTP Error! Status: ${timeRes.status}`);
//       }

//       const timeData = await timeRes.json();
//       setHikingTime(timeData.prediction[0]);

//       setLoading(false);
//     } catch (error) {
//       console.error("Error fetching predictions:", error);
//       Alert.alert("Prediction Error", "Failed to fetch prediction results. Please try again.");
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {loading ? (
//         <ActivityIndicator size="large" color="#0000ff" />
//       ) : (
//         <>
//           <Text style={styles.header}>{mountain.name}</Text>
//           <Text style={styles.label}>Distance for the peak</Text>
//           <Text style={styles.value}>{distance ? `${distance} km` : "N/A"}</Text>
//           <Text style={styles.label}>Average time to complete hike</Text>
//           <Text style={styles.time}>{hikingTime ? `${hikingTime} HOURS` : "N/A"}</Text>
//         </>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f2f2f2" },
//   header: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
//   label: { fontSize: 18, marginTop: 10 },
//   value: { fontSize: 22, fontWeight: "bold", color: "green" },
//   time: { fontSize: 30, fontWeight: "bold", color: "black" },
// });

// export default PredictionResultScreen;

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
  
      const response = await fetch("http://172.28.17.65:5000/predict/travel", {
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