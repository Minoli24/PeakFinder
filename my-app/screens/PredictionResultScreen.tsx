
// // import React, { useEffect, useState } from "react";
// // import { View, Text, StyleSheet, ActivityIndicator, Alert } from "react-native";
// // import { RouteProp } from "@react-navigation/native";
// // import { StackNavigationProp } from "@react-navigation/stack";

// // import { RootStackParamList } from "../App"; // Adjust path accordingly

// // // Define screen props
// // type PredictionResultScreenProps = {
// //   route: RouteProp<RootStackParamList, "PredictionResult">;
// //   navigation: StackNavigationProp<RootStackParamList, "PredictionResult">;
// // };

// // const PredictionResultScreen: React.FC<PredictionResultScreenProps> = ({ route }) => {
// //   const { mountain, restStops, travelMode } = route.params;
// //   const [distance, setDistance] = useState<number | null>(null);
// //   const [hikingTime, setHikingTime] = useState<number | null>(null);
// //   const [loading, setLoading] = useState<boolean>(true);

// //   // useEffect(() => {
// //   //   if (mountain) {
// //   //     console.log("✅ Selected Mountain:", mountain);
// //   //     fetchPredictions();
// //   //   } else {
// //   //     console.error("🚨 No mountain data available!");
// //   //   }
// //   // }, [mountain, restStops]); // Fetch again when mountain or restStops changes
// //   useEffect(() => {
// //     console.log("✅ Received Mountain Data:", mountain);
// //     console.log("📍 Elevation Received:", mountain.elevation);
// //     fetchPredictions();
// //   }, [mountain, restStops]);
  

// //   // Fetch Distance & Time Predictions
// //   const fetchPredictions = async () => {
// //     try {
// //       // Ensure mountain object has valid data
// //       const payload = {
// //         elevation: mountain.elevation || 0,
// //         weatherEncoded: mountain.weatherEncoded || 0,
// //         difficulty: mountain.difficulty || 0,
// //         restStops: restStops || 0,
        
// //       };

// //       console.log("📡 Sending Payload:", JSON.stringify(payload, null, 2));

// //       const response = await fetch("https://sehara.el.r.appspot.com/predict/travel", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify(payload),
// //       });

// //       if (!response.ok) {
// //         throw new Error(`HTTP Error! Status: ${response.status}`);
// //       }

// //       const data = await response.json();
// //       console.log("✅ API Response:", data);

// //       setDistance(data.distance);
// //       setHikingTime(data.time);
// //       setLoading(false);
// //     } catch (error) {
// //       console.error("🚨 Error fetching predictions:", error);
// //       Alert.alert("Prediction Error", "Failed to fetch prediction results.");
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <View style={styles.container}>
// //       {loading ? (
// //         <ActivityIndicator size="large" color="#0000ff" />
// //       ) : (
// //         <>
// //           <Text style={styles.header}>{mountain.name || "Unknown Mountain"}</Text>
// //           <Text style={styles.label}>Distance for the peak</Text>
// //           <Text style={styles.value}>{distance ? `${distance} km` : "N/A"}</Text>
// //           <Text style={styles.label}>Average time to complete hike</Text>
// //           <Text style={styles.time}>{hikingTime ? `${hikingTime} HOURS` : "N/A"}</Text>
// //         </>
// //       )}
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

// import React, { useEffect, useState } from "react";
// import { View, Text, StyleSheet, ActivityIndicator, Alert, ScrollView } from "react-native";
// import { RouteProp } from "@react-navigation/native";
// import { StackNavigationProp } from "@react-navigation/stack";

// import { RootStackParamList } from "../App"; // Adjust path accordingly

// // Define screen props
// type PredictionResultScreenProps = {
//   route: RouteProp<RootStackParamList, "PredictionResult">;
//   navigation: StackNavigationProp<RootStackParamList, "PredictionResult">;
// };

// const PredictionResultScreen: React.FC<PredictionResultScreenProps> = ({ route }) => {
//   const { mountain, restStops, travelMode } = route.params;

//   const [mountainName, setMountainName] = useState<string>("Loading...");
//   const [distance, setDistance] = useState<number | null>(null);
//   const [timeNow, setTimeNow] = useState<number | null>(null);
//   const [time3h, setTime3h] = useState<number | null>(null);
//   const [time6h, setTime6h] = useState<number | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);

//   useEffect(() => {
//     if (!mountain) {
//       Alert.alert("Error", "No mountain data available!");
//       return;
//     }

//     console.log("✅ Received Mountain Data:", mountain);
//     setMountainName(mountain.name || "Unknown Mountain");
    
//     fetchPredictions();
//   }, [mountain]);

//   // Fetch Distance & Time Predictions
//   const fetchPredictions = async () => {
//     try {
//       if (!mountain) {
//         throw new Error("No mountain data provided!");
//       }

//       const payload = {
//         elevation: mountain.elevation || 0,
//         weatherEncoded: mountain.weatherEncoded || 0,
//         difficulty: mountain.difficulty || 0,
//         restStops: restStops || 0,
//       };

//       console.log("📡 Sending Payload:", JSON.stringify(payload, null, 2));

//       const response = await fetch("https://sehara.el.r.appspot.com/predict/travel", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(payload),
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP Error! Status: ${response.status}`);
//       }

//       const data = await response.json();
//       console.log("✅ API Response:", data);

//       setDistance(data.distance);
//       setTimeNow(data.time);
//       setTime3h(data.time + 1.2); // Assume time increases slightly over 3h
//       setTime6h(data.time + 2.5); // Assume more increase for 6h
//     } catch (error) {
//       console.error("🚨 Error fetching predictions:", error);
//       Alert.alert("Prediction Error", "Failed to fetch prediction results.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       {loading ? (
//         <ActivityIndicator size="large" color="#007AFF" />
//       ) : (
//         <ScrollView contentContainerStyle={styles.scrollContainer}>
//           <Text style={styles.header}>{mountainName}</Text>
//   {/* Description */}
//   <Text style={styles.description}>
//             The estimated hiking time is predicted based on distance, weather conditions, and mountain difficulty.
//           </Text>


//           {/* Distance Card */}
//           <View style={styles.card}>
//             <Text style={styles.cardTitle}>Distance to Peak</Text>
//             <Text style={styles.value}>{distance !== null ? `${distance} km` : "N/A"}</Text>
//           </View>

//           {/* Time Estimates Section */}
//           <View style={styles.timeContainer}>
//             <Text style={styles.sectionTitle}>Estimated Hiking Time</Text>

//             <View style={styles.timeCard}>
//               <Text style={styles.timeLabel}>Now</Text>
//               <Text style={styles.timeValue}>{timeNow ? `${timeNow.toFixed(1)} hours` : "N/A"}</Text>
//             </View>

//             <View style={styles.timeCard}>
//               <Text style={styles.timeLabel}>In 3 Hours</Text>
//               <Text style={styles.timeValue}>{time3h ? `${time3h.toFixed(1)} hours` : "N/A"}</Text>
//             </View>

//             <View style={styles.timeCard}>
//               <Text style={styles.timeLabel}>In 6 Hours</Text>
//               <Text style={styles.timeValue}>{time6h ? `${time6h.toFixed(1)} hours` : "N/A"}</Text>
//             </View>
//           </View>
//         </ScrollView>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f7f7f7",
//   },
//   scrollContainer: {
//     alignItems: "center",
//     paddingVertical: 20,
//   },
//   header: {
//     fontSize: 26,
//     fontWeight: "bold",
//     color: "#2E3A59",
//     marginBottom: 15,
//   },
//   card: {
//     width: "90%",
//     backgroundColor: "#ffffff",
//     padding: 20,
//     borderRadius: 12,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 3,
//     marginBottom: 15,
//     alignItems: "center",
//   },
//   cardTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#007AFF",
//     marginBottom: 5,
//   },
//   value: {
//     fontSize: 22,
//     fontWeight: "bold",
//     color: "#34C759",
//   },
//   sectionTitle: {
//     fontSize: 22,
//     fontWeight: "bold",
//     color: "#555",
//     marginBottom: 10,
//     textAlign: "center",
//   },
//   timeContainer: {
//     width: "90%",
//     backgroundColor: "#fff",
//     borderRadius: 12,
//     padding: 15,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 6,
//     elevation: 3,
//     marginBottom: 20,
//     alignItems: "center",
//   },
//   timeCard: {
//     backgroundColor: "#F0F5FF",
//     width: "100%",
//     paddingVertical: 10,
//     paddingHorizontal: 15,
//     borderRadius: 10,
//     marginBottom: 8,
//     alignItems: "center",
//   },
//   timeLabel: {
//     fontSize: 18,
//     fontWeight: "600",
//     color: "#007AFF",
//   },
//   timeValue: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#1C1C1E",
//   },
//   description: {
//     fontSize: 16,
//     color: "#555",
//     textAlign: "center",
//     marginHorizontal: 20,
//     marginBottom: 15,
//     fontStyle: "italic",
//   },
// });

// export default PredictionResultScreen;

import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, Alert, ScrollView, TouchableOpacity } from "react-native";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons"; // Import Icon for Back Button

import { RootStackParamList } from "../App"; // Adjust path accordingly

// Define screen props
type PredictionResultScreenProps = {
  route: RouteProp<RootStackParamList, "PredictionResult">;
  navigation: StackNavigationProp<RootStackParamList, "PredictionResult">;
};

const PredictionResultScreen: React.FC<PredictionResultScreenProps> = ({ route, navigation }) => {
  const { mountain, restStops, travelMode } = route.params;

  const [mountainName, setMountainName] = useState<string>("Loading...");
  const [distance, setDistance] = useState<number | null>(null);
  const [timeNow, setTimeNow] = useState<number | null>(null);
  const [time3h, setTime3h] = useState<number | null>(null);
  const [time6h, setTime6h] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (!mountain) {
      Alert.alert("Error", "No mountain data available!");
      return;
    }

    console.log("✅ Received Mountain Data:", mountain);
    setMountainName(mountain.name || "Unknown Mountain");

    fetchPredictions();
  }, [mountain]);

  // Fetch Distance & Time Predictions
  const fetchPredictions = async () => {
    try {
      if (!mountain) {
        throw new Error("No mountain data provided!");
      }

      const payload = {
        elevation: mountain.elevation || 0,
        weatherEncoded: mountain.weatherEncoded || 0,
        difficulty: mountain.difficulty || 0,
        restStops: restStops || 0,
      };

      console.log("📡 Sending Payload:", JSON.stringify(payload, null, 2));

      const response = await fetch("https://sehara.el.r.appspot.com/predict/travel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ API Response:", data);

      setDistance(data.distance);
      setTimeNow(data.time);
      setTime3h(data.time + 1.2); // Assume time increases slightly over 3h
      setTime6h(data.time + 2.5); // Assume more increase for 6h
    } catch (error) {
      console.error("🚨 Error fetching predictions:", error);
      Alert.alert("Prediction Error", "Failed to fetch prediction results.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#007AFF" />
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Back Button */}
          <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={30} color="#007AFF" />
          </TouchableOpacity>

          {/* Mountain Name */}
          <Text style={styles.header}>{mountainName}</Text>

          {/* Description */}
          <Text style={styles.description}>
            The estimated hiking time is predicted based on distance, weather conditions, and mountain difficulty.
          </Text>

          {/* Distance Card */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>Distance to Peak</Text>
            <Text style={styles.value}>{distance !== null ? `${distance} km` : "N/A"}</Text>
          </View>

          {/* Time Estimates Section */}
          <View style={styles.timeContainer}>
            <Text style={styles.sectionTitle}>Estimated Hiking Time</Text>

            <View style={styles.timeCard}>
              <Text style={styles.timeLabel}>Now</Text>
              <Text style={styles.timeValue}>{timeNow ? `${timeNow.toFixed(1)} hours` : "N/A"}</Text>
            </View>

            <View style={styles.timeCard}>
              <Text style={styles.timeLabel}>In 3 Hours</Text>
              <Text style={styles.timeValue}>{time3h ? `${time3h.toFixed(1)} hours` : "N/A"}</Text>
            </View>

            <View style={styles.timeCard}>
              <Text style={styles.timeLabel}>In 6 Hours</Text>
              <Text style={styles.timeValue}>{time6h ? `${time6h.toFixed(1)} hours` : "N/A"}</Text>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  scrollContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  backButton: {
    position: "absolute",
    top: 40, // Adjust for header space
    left: 20,
    zIndex: 10,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#2E3A59",
    marginBottom: 10,
    marginTop: 40, // Extra space below back button
    textAlign: "center",
  },
  description: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginHorizontal: 20,
    marginBottom: 15,
    fontStyle: "italic",
  },
  card: {
    width: "90%",
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 15,
    alignItems: "center",
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 5,
  },
  value: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#34C759",
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 10,
    textAlign: "center",
  },
  timeContainer: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    marginBottom: 20,
    alignItems: "center",
  },
  timeCard: {
    backgroundColor: "#F0F5FF",
    width: "100%",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 10,
    marginBottom: 8,
    alignItems: "center",
  },
  timeLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#007AFF",
  },
  timeValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1C1C1E",
  },
});

export default PredictionResultScreen;

