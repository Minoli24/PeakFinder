// import React, { useState } from "react";
// import { View, Text, StyleSheet, TouchableOpacity, TextInput } from "react-native";
// import { Picker } from "@react-native-picker/picker"; // Correct import
// import { useNavigation } from "@react-navigation/native";
// import { StackScreenProps } from "@react-navigation/stack";
// import { RootStackParamList } from "../App";

// type MountainSelectionProps = StackScreenProps<RootStackParamList, "MountainSelection">;

// const MountainSelectionScreen: React.FC<MountainSelectionProps> = ({ navigation }) => {
//   const mountains = [
//     { name: "Adam's Peak", latitude: 6.8094, longitude: 80.4999, elevation: "2243m", difficulty: "Hard", restStops: 5 },
//     { name: "Ella Rock", latitude: 6.8667, longitude: 81.0386, elevation: "1041m", difficulty: "Moderate", restStops: 3 },
//     { name: "Sigiriya", latitude: 7.9566, longitude: 80.7595, elevation: "1500m", difficulty: "Moderate", restStops: 3 },
//   ];

//   const [selectedMountainName, setSelectedMountainName] = useState<string>(mountains[0].name);
//   const [restStops, setRestStops] = useState<string>("3");
//   const [travelMode, setTravelMode] = useState<string>("Hiking");

//   const handlePredict = () => {
//     const selectedMountain = mountains.find((m) => m.name === selectedMountainName);
//     if (selectedMountain) {
//       navigation.navigate("PredictionResult", {
//         mountain: selectedMountain,
//         restStops,
//         travelMode,
//       });
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Select a Mountain</Text>
//       <Picker selectedValue={selectedMountainName} onValueChange={(itemValue) => setSelectedMountainName(itemValue)} style={styles.picker}>
//         {mountains.map((mountain, index) => (
//           <Picker.Item key={index} label={mountain.name} value={mountain.name} />
//         ))}
//       </Picker>

//       <Text style={styles.label}>Number of Rest Stops</Text>
//       <TextInput style={styles.input} keyboardType="numeric" value={restStops} onChangeText={setRestStops} />

//       <TouchableOpacity style={styles.button} onPress={handlePredict}>
//         <Text style={styles.buttonText}>Show Distance and Time</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f2f2f2" },
//   header: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
//   picker: { height: 50, width: 250 },
//   label: { fontSize: 16, marginTop: 10 },
//   input: { borderWidth: 1, borderColor: "#ccc", padding: 8, marginTop: 5, width: "80%", borderRadius: 5 },
//   button: { backgroundColor: "#34A853", padding: 15, borderRadius: 10, marginTop: 20 },
//   buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
// });

// export default MountainSelectionScreen;
// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   TextInput,
//   Alert,
//   ActivityIndicator,
// } from "react-native";
// import { Picker } from "@react-native-picker/picker";
// import { useNavigation, NavigationProp } from "@react-navigation/native";
// import axios from "axios";
// import { RootStackParamList } from "../App"; // Adjust the path to where your RootStackParamList is defined

// // Define the available mountains
// const mountains = [
//   { name: "Adam's Peak", latitude: 6.8094, longitude: 80.4999 },
//   { name: "Ella Rock", latitude: 6.8667, longitude: 81.0386 },
//   { name: "Sigiriya", latitude: 7.9566, longitude: 80.7595 },
// ];

// // Weather encoding map
// const weatherEncoding: { [key: string]: number } = {
//   Sunny: 3,
//   Rainy: 2,
//   Cloudy: 0,
//   Windy: 1,
// };

// const MountainSelectionScreen = () => {
//   const navigation = useNavigation<NavigationProp<RootStackParamList, "MountainSelection">>();
//   const [selectedMountain, setSelectedMountain] = useState(mountains[0]);
//   const [restStops, setRestStops] = useState("3");
//   const [selectedTravelMode, setSelectedTravelMode] = useState("Hiking");

//   const [elevation, setElevation] = useState<number | null>(null);
//   const [difficulty, setDifficulty] = useState<number | null>(null);
//   const [weatherEncoded, setWeatherEncoded] = useState<number | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);

//   // API keys & URLs
//   const WEATHER_API_KEY = "a304e8aa816e13c751f54d94f56d8a8a"; // Replace with your OpenWeather API key
//   const FLASK_API_URL = "http://192.168.1.6:5000/predict/travel"; // Your ML model API

//   // Fetch weather encoding from OpenWeather API
//   const fetchWeatherEncoding = async () => {
//     try {
//       const { latitude, longitude } = selectedMountain;
//       const response = await axios.get(
//         `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}`
//       );

//       const weatherCondition = response.data.weather[0].main; // Get main weather type
//       const encodedWeather = weatherEncoding[weatherCondition] ?? 0; // Default to 0 if not found
//       setWeatherEncoded(encodedWeather);
//     } catch (error) {
//       console.error("Weather API Error:", error);
//       Alert.alert("Error", "Failed to fetch weather data.");
//       setWeatherEncoded(0);
//     }
//   };

//   // Fetch elevation & difficulty from Flask ML API
//   const fetchElevationAndDifficulty = async () => {
//     try {
//       const { latitude, longitude } = selectedMountain;
//       const payload = {
//         latitude,
//         longitude,
//         difficulty: 1, // Default value (adjust as needed)
//         restStops: Number(restStops),
//         travelMode: selectedTravelMode,
//       };
//       console.log("Request payload:", payload); // Log the request payload for debugging

//       const response = await axios.post(FLASK_API_URL, payload);

//       setElevation(response.data.distance);
//       setDifficulty(response.data.time);
//       setLoading(false);
//     } catch (error) {
//       console.error("ML API Error:", error);
//       if (axios.isAxiosError(error) && error.response) {
//         console.error("Response data:", error.response.data);
//       }
//       Alert.alert("Error", "Failed to fetch elevation and difficulty.");
//       setLoading(false);
//     }
//   };

//   // Fetch data when mountain selection changes
//   useEffect(() => {
//     setLoading(true);
//     fetchWeatherEncoding();
//     fetchElevationAndDifficulty();
//   }, [selectedMountain]);

//   // Handle navigation to PredictionResultScreen.tsx
//   const handlePredict = () => {
//     if (elevation === null || difficulty === null || weatherEncoded === null) {
//       Alert.alert("Please wait for all data to load.");
//       return;
//     }

//     navigation.navigate("PredictionResult", {
//       mountain: {
//         name: selectedMountain.name,
//         elevation: elevation as number,
//         difficulty: difficulty as number,
//         weatherEncoded: weatherEncoded as number,
//       },
//       restStops: Number(restStops),
//       travelMode: selectedTravelMode, // No encoding needed
//     });
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Select a Mountain</Text>

//       {/* Mountain Selection Dropdown */}
//       <Picker
//         selectedValue={selectedMountain.name}
//         onValueChange={(itemValue) => {
//           const mountain = mountains.find((m) => m.name === itemValue);
//           if (mountain) setSelectedMountain(mountain);
//         }}
//         style={styles.picker}
//       >
//         {mountains.map((mountain, index) => (
//           <Picker.Item key={index} label={mountain.name} value={mountain.name} />
//         ))}
//       </Picker>

//       {/* Number of Rest Stops Input */}
//       <Text style={styles.label}>Number of Rest Stops</Text>
//       <TextInput
//         style={styles.input}
//         keyboardType="numeric"
//         value={restStops}
//         onChangeText={setRestStops}
//       />

//       {/* Travel Mode Dropdown */}
//       <Text style={styles.label}>Select Travel Mode</Text>
//       <Picker
//         selectedValue={selectedTravelMode}
//         onValueChange={(itemValue) => setSelectedTravelMode(itemValue)}
//         style={styles.picker}
//       >
//         <Picker.Item label="Walking" value="Walking" />
//         <Picker.Item label="Biking" value="Biking" />
//         <Picker.Item label="Car" value="Car" />
//       </Picker>

//       {/* Show loading indicator */}
//       {loading ? (
//         <ActivityIndicator size="large" color="blue" />
//       ) : (
//         <TouchableOpacity style={styles.button} onPress={handlePredict}>
//           <Text style={styles.buttonText}>Show Distance and Time</Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// };

// // Styles
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#f2f2f2",
//   },
//   header: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
//   picker: { height: 50, width: 250 },
//   label: { fontSize: 16, marginTop: 10 },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     padding: 8,
//     marginTop: 5,
//     width: "80%",
//     borderRadius: 5,
//   },
//   button: {
//     backgroundColor: "#34A853",
//     padding: 15,
//     borderRadius: 10,
//     marginTop: 20,
//   },
//   buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
// });

// export default MountainSelectionScreen;

// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   TextInput,
//   Alert,
//   ActivityIndicator,
// } from "react-native";
// import { Picker } from "@react-native-picker/picker";
// import { useNavigation, NavigationProp } from "@react-navigation/native";
// import axios from "axios";
// import { RootStackParamList } from "../App"; // Adjust the path to where your RootStackParamList is defined

// // Define the available mountains
// const mountains = [
//   { name: "Adam's Peak", latitude: 6.8094, longitude: 80.4999 },
//   { name: "Ella Rock", latitude: 6.8667, longitude: 81.0386 },
//   { name: "Sigiriya", latitude: 7.9566, longitude: 80.7595 },
// ];

// // Weather encoding map
// const weatherEncoding: { [key: string]: number } = {
//   Sunny: 3,
//   Rainy: 2,
//   Cloudy: 0,
//   Windy: 1,
// };

// const MountainSelectionScreen = () => {
//   const navigation = useNavigation<NavigationProp<RootStackParamList, "MountainSelection">>();
//   const [selectedMountain, setSelectedMountain] = useState(mountains[0]);
//   const [restStops, setRestStops] = useState("3");
//   const [selectedTravelMode, setSelectedTravelMode] = useState("Hiking");

//   const [elevation, setElevation] = useState<number | null>(null);
//   const [difficulty, setDifficulty] = useState<number | null>(null);
//   const [weatherEncoded, setWeatherEncoded] = useState<number | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);

//   // API keys & URLs
//   const WEATHER_API_KEY = "a304e8aa816e13c751f54d94f56d8a8a"; // Replace with your OpenWeather API key
//   const FLASK_API_URL = "http://192.168.1.6:5000/predict/travel"; // Your ML model API

//   // Fetch weather encoding from OpenWeather API
//   const fetchWeatherEncoding = async () => {
//     try {
//       const { latitude, longitude } = selectedMountain;
//       const response = await axios.get(
//         `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${WEATHER_API_KEY}`
//       );

//       const weatherCondition = response.data.weather[0].main; // Get main weather type
//       const encodedWeather = weatherEncoding[weatherCondition] ?? 0; // Default to 0 if not found
//       setWeatherEncoded(encodedWeather);
//     } catch (error) {
//       console.error("Weather API Error:", error);
//       Alert.alert("Error", "Failed to fetch weather data.");
//       setWeatherEncoded(0);
//     }
//   };

//   // Fetch elevation & difficulty from Flask ML API
//   const fetchElevationAndDifficulty = async () => {
//     try {
//       const { latitude, longitude } = selectedMountain;
//       const payload = {
//         latitude,
//         longitude,
//         difficulty: 1, // Default value (adjust as needed)
//         restStops: Number(restStops),
//         travelMode: selectedTravelMode,
//         weatherEncoded: weatherEncoded, // Include weatherEncoded in the payload
//       };
//       console.log("Request payload:", payload); // Log the request payload for debugging

//       const response = await axios.post(FLASK_API_URL, payload);

//       setElevation(response.data.distance);
//       setDifficulty(response.data.time);
//       setLoading(false);
//     } catch (error) {
//       console.error("ML API Error:", error);
//       if (axios.isAxiosError(error) && error.response) {
//         console.error("Response data:", error.response.data);
//       }
//       Alert.alert("Error", "Failed to fetch elevation and difficulty.");
//       setLoading(false);
//     }
//   };

//   // Fetch data when mountain selection changes
//   useEffect(() => {
//     setLoading(true);
//     fetchWeatherEncoding();
//     fetchElevationAndDifficulty();
//   }, [selectedMountain]);

//   // Handle navigation to PredictionResultScreen.tsx
//   const handlePredict = () => {
//     if (elevation === null || difficulty === null || weatherEncoded === null) {
//       Alert.alert("Please wait for all data to load.");
//       return;
//     }

//     navigation.navigate("PredictionResult", {
//       mountain: {
//         name: selectedMountain.name,
//         elevation: elevation as number,
//         difficulty: difficulty as number,
//         weatherEncoded: weatherEncoded as number,
//       },
//       restStops: Number(restStops),
//       travelMode: selectedTravelMode, // No encoding needed
//     });
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Select a Mountain</Text>

//       {/* Mountain Selection Dropdown */}
//       <Picker
//         selectedValue={selectedMountain.name}
//         onValueChange={(itemValue) => {
//           const mountain = mountains.find((m) => m.name === itemValue);
//           if (mountain) setSelectedMountain(mountain);
//         }}
//         style={styles.picker}
//       >
//         {mountains.map((mountain, index) => (
//           <Picker.Item key={index} label={mountain.name} value={mountain.name} />
//         ))}
//       </Picker>

//       {/* Number of Rest Stops Input */}
//       <Text style={styles.label}>Number of Rest Stops</Text>
//       <TextInput
//         style={styles.input}
//         keyboardType="numeric"
//         value={restStops}
//         onChangeText={setRestStops}
//       />

//       {/* Travel Mode Dropdown */}
//       <Text style={styles.label}>Select Travel Mode</Text>
//       <Picker
//         selectedValue={selectedTravelMode}
//         onValueChange={(itemValue) => setSelectedTravelMode(itemValue)}
//         style={styles.picker}
//       >
//         <Picker.Item label="Waling" value="Walking" />
//         <Picker.Item label="Biking" value="Biking" />
//         <Picker.Item label="Car" value="Car" />
//       </Picker>

//       {/* Show loading indicator */}
//       {loading ? (
//         <ActivityIndicator size="large" color="blue" />
//       ) : (
//         <TouchableOpacity style={styles.button} onPress={handlePredict}>
//           <Text style={styles.buttonText}>Show Distance and Time</Text>
//         </TouchableOpacity>
//       )}
//     </View>
//   );
// };

// // Styles
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#f2f2f2",
//   },
//   header: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
//   picker: { height: 50, width: 250 },
//   label: { fontSize: 16, marginTop: 10 },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     padding: 8,
//     marginTop: 5,
//     width: "80%",
//     borderRadius: 5,
//   },
//   button: {
//     backgroundColor: "#34A853",
//     padding: 15,
//     borderRadius: 10,
//     marginTop: 20,
//   },
//   buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
// });

// export default MountainSelectionScreen;

// import React, { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   TextInput,
//   Alert,
//   ActivityIndicator,
// } from "react-native";
// import { Picker } from "@react-native-picker/picker";
// import { useNavigation, NavigationProp } from "@react-navigation/native";
// import axios from "axios";
// import { RootStackParamList } from "../App"; // Adjust if necessary

// // Define the available mountains with difficulty encoding
// const mountains = [
//   { name: "Adam's Peak", latitude: 6.8094, longitude: 80.4999, elevation: 2243, difficulty: "Hard", difficultyEncoded: 0 },
//   { name: "Bible Rock", latitude: 7.1000, longitude: 80.3333, elevation: 798, difficulty: "Hard", difficultyEncoded: 0 },
//   { name: "Ella Rock", latitude: 6.8667, longitude: 81.0386, elevation: 1141, difficulty: "Hard", difficultyEncoded: 0 },
//   { name: "Hanthana", latitude: 7.2500, longitude: 80.6333, elevation: 1200, difficulty: "Moderate", difficultyEncoded: 1 },
//   { name: "Lakegala", latitude: 7.5833, longitude: 80.9500, elevation: 1310, difficulty: "Hard", difficultyEncoded: 0 },
//   { name: "Narangala Mountain", latitude: 7.2167, longitude: 80.8833, elevation: 1527, difficulty: "Moderate", difficultyEncoded: 1 },
//   { name: "Sigiriya", latitude: 7.9566, longitude: 80.7595, elevation: 349, difficulty: "Moderate", difficultyEncoded: 1 },
//   { name: "Yahangala", latitude: 7.4000, longitude: 81.0000, elevation: 1220, difficulty: "Hard", difficultyEncoded: 0 },
// ];

// // Weather encoding map
// const weatherEncoding: { [key: string]: number } = {
//   Sunny: 3,
//   Rainy: 2,
//   Cloudy: 0,
//   Windy: 1,
// };

// const MountainSelectionScreen = () => {
//   const navigation = useNavigation<NavigationProp<RootStackParamList, "MountainSelection">>();
//   const [selectedMountain, setSelectedMountain] = useState(mountains[0]);
//   const [restStops, setRestStops] = useState<string>("");
//   const [selectedTravelMode, setSelectedTravelMode] = useState("Walking");

//   const [elevation, setElevation] = useState(mountains[0].elevation);
//   const [difficulty, setDifficulty] = useState(mountains[0].difficulty);
//   const [difficultyEncoded, setDifficultyEncoded] = useState(mountains[0].difficultyEncoded);
//   const [weatherEncoded, setWeatherEncoded] = useState<number | null>(null);
//   const [weatherCondition, setWeatherCondition] = useState<string | null>(null);
//   const [temperature, setTemperature] = useState<number | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//   const [trailCondition, setTrailCondition] = useState<number | null>(null);
//   const [humidity, setHumidity] = useState<number | null>(null);

//   // API keys & URLs
//   const WEATHER_API_KEY = "a304e8aa816e13c751f54d94f56d8a8a"; // Replace with your OpenWeather API key
//   const FLASK_API_URL = "http://192.168.1.18:5000/predict/travel"; // Your ML model API

//   // Fetch weather encoding from OpenWeather API
//   // const fetchWeatherEncoding = async () => {
//   //   try {
//   //     const { latitude, longitude } = selectedMountain;
//   //     const response = await axios.get(
//   //       `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${WEATHER_API_KEY}`
//   //     );

//   //     // Extract weather condition and temperature
//   //     const weatherMain = response.data.weather[0].main; // e.g., "Rainy", "Cloudy"
//   //     const temp = response.data.main.temp; // Temperature in Celsius

//   //     setWeatherCondition(weatherMain);
//   //     setTemperature(temp);

//   //     // Encode weather condition
//   //     const encodedWeather = weatherEncoding[weatherMain] ?? 0; // Default to 0 if not found
//   //     setWeatherEncoded(encodedWeather);

//   //   } catch (error) {
//   //     console.error("Weather API Error:", error);
//   //     Alert.alert("Error", "Failed to fetch weather data.");
//   //     setWeatherCondition(null);
//   //     setTemperature(null);
//   //     setWeatherEncoded(0);
//   //   }
//   // };

//   const fetchWeatherEncoding = async () => {
//     try {
//         const { latitude, longitude } = selectedMountain;
//         const response = await axios.get(
//             `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${WEATHER_API_KEY}`
//         );

//         // Extract weather condition, temperature, and humidity
//         const weatherMain = response.data.weather[0].main;
//         const temp = response.data.main.temp;
//         const hum = response.data.main.humidity;

//         setWeatherCondition(weatherMain);
//         setTemperature(temp);
//         setHumidity(hum);

//         // Encode weather condition
//         const encodedWeather = weatherEncoding[weatherMain] ?? 0; // Default to 0 if not found
//         setWeatherEncoded(encodedWeather);

//     } catch (error) {
//         console.error("Weather API Error:", error);
//         Alert.alert("Error", "Failed to fetch weather data.");
//         setWeatherCondition(null);
//         setTemperature(null);
//         setHumidity(null);
//         setWeatherEncoded(0);
//     }
// };


//   // Fetch elevation & difficulty from Flask ML API
//   // 
//   // const fetchElevationAndDifficulty = async () => {
//   //   try {
//   //     const { elevation, difficultyEncoded } = selectedMountain;
  
//   //     const payload = {
//   //       elevation,                // ✅ Feature 1
//   //       weatherEncoded: weatherEncoded ?? 0, // ✅ Feature 2
//   //       difficulty: difficultyEncoded,  // ✅ Feature 3
//   //       restStops: Number(restStops),  // ✅ Feature 4
//   //     };
  
//   //     console.log("📤 Sending Payload:", JSON.stringify(payload, null, 2)); // ✅ Debugging
  
//   //     const response = await axios.post("http://192.168.1.18:5000/predict/travel", payload);
  
//   //     setElevation(response.data.distance);
//   //     setDifficulty(response.data.time);
//   //     setLoading(false);
//   //   } catch (error) {
//   //     console.error("ML API Error:", error);
//   //     Alert.alert("Error", "Failed to fetch elevation and difficulty.");
//   //     setLoading(false);
//   //   }
//   // };
  

//   const fetchElevationAndDifficulty = async () => {
//     try {
//         const { latitude, longitude } = selectedMountain;

//         const payload = {
//             elevation,
//             weatherEncoded: weatherEncoded ?? 0,
//             difficulty: difficultyEncoded,
//             restStops: Number(restStops),
//         };

//         console.log("📤 Sending Payload:", JSON.stringify(payload, null, 2));

//         const response = await axios.post(FLASK_API_URL, payload);

//         setElevation(response.data.distance);
//         setDifficulty(response.data.time);
//         setTrailCondition(response.data.trail_condition); // Fetch trail condition
//         setLoading(false);
//     } catch (error) {
//         console.error("ML API Error:", error);
//         Alert.alert("Error", "Failed to fetch trail condition.");
//         setLoading(false);
//     }
// };

  
//   // Fetch data when mountain selection changes
//   useEffect(() => {
//     setLoading(true);
//     fetchWeatherEncoding();
//     fetchElevationAndDifficulty();
//   }, [selectedMountain]);

//   // Handle navigation to PredictionResultScreen.tsx
//   const handlePredict = () => {
//     if (elevation === null || difficulty === null || weatherEncoded === null) {
//       Alert.alert("Please wait for all data to load.");
//       return;
//     }

//     navigation.navigate("PredictionResult", {
//       mountain: {
//         name: selectedMountain.name,
//         elevation: elevation,
//         difficulty: difficultyEncoded,
//         weatherEncoded: weatherEncoded,
//         //temperature: temperature,
//         //weatherCondition: weatherCondition,
//       },
//       restStops: Number(restStops),
//         travelMode: selectedTravelMode,
//     });
//   };

//   return (
//     // <View style={styles.container}>
//     //   <Text style={styles.header}>Select a Mountain</Text>

//     //   {/* Mountain Selection Dropdown */}
//     //   <Picker
//     //     selectedValue={selectedMountain.name}
//     //     onValueChange={(itemValue) => {
//     //       const mountain = mountains.find((m) => m.name === itemValue);
//     //       if (mountain) {
//     //         setSelectedMountain(mountain);
//     //         setDifficulty(mountain.difficulty);
//     //         setDifficultyEncoded(mountain.difficultyEncoded);
//     //         setElevation(mountain.elevation);
//     //       }
//     //     }}
//     //     style={styles.picker}
//     //   >
//     //     {mountains.map((mountain, index) => (
//     //       <Picker.Item key={index} label={mountain.name} value={mountain.name} />
//     //     ))}
//     //   </Picker>

//     //   {/* Show selected details */}
//     //   <Text style={styles.label}>Elevation: {elevation}m</Text>
//     //   <Text style={styles.label}>Difficulty: {difficulty} (Encoded: {difficultyEncoded})</Text>
//     //   <Text style={styles.label}>Weather: {weatherCondition} (Encoded: {weatherEncoded})</Text>
//     //   <Text style={styles.label}>Temperature: {temperature} °C</Text>

//     //   {/* Number of Rest Stops Input */}
//     //   <Text style={styles.label}>Number of Rest Stops</Text>
//     //   <TextInput style={styles.input} keyboardType="numeric" value={restStops}  onChangeText={(text) => setRestStops(text)}  />

//     //   {/* Travel Mode Dropdown */}
//     //   <Text style={styles.label}>Select Travel Mode</Text>
//     //   <Picker selectedValue={selectedTravelMode} onValueChange={(itemValue) => setSelectedTravelMode(itemValue)} style={styles.picker}>
//     //     <Picker.Item label="Walking" value="Walking" />
//     //     <Picker.Item label="Biking" value="Biking" />
//     //     <Picker.Item label="Car" value="Car" />
//     //   </Picker>

//     //   {loading ? <ActivityIndicator size="large" color="blue" /> : (
//     //     <TouchableOpacity style={styles.button} onPress={handlePredict}>
//     //       <Text style={styles.buttonText}>Show Distance and Time</Text>
//     //     </TouchableOpacity>
//     //   )}
//     // </View>

//     <View style={styles.container}>
//     <Text style={styles.header}>Select a Mountain</Text>

//     {/* Mountain Selection Dropdown */}
//     <Picker
//         selectedValue={selectedMountain.name}
//         onValueChange={(itemValue) => {
//             const mountain = mountains.find((m) => m.name === itemValue);
//             if (mountain) {
//                 setSelectedMountain(mountain);
//                 setDifficulty(mountain.difficulty);
//                 setDifficultyEncoded(mountain.difficultyEncoded);
//                 setElevation(mountain.elevation);
//             }
//         }}
//         style={styles.picker}
//     >
//         {mountains.map((mountain, index) => (
//             <Picker.Item key={index} label={mountain.name} value={mountain.name} />
//         ))}
//     </Picker>

//     {/* Show selected details */}
//     <Text style={styles.label}>Elevation: {elevation}m</Text>
//     <Text style={styles.label}>Difficulty: {difficulty} (Encoded: {difficultyEncoded})</Text>
//     <Text style={styles.label}>Trail Condition: {trailCondition === 0 ? "Easy" : trailCondition === 1 ? "Moderate" : "Difficult"}</Text>
//     <Text style={styles.label}>Weather: {weatherCondition} (Encoded: {weatherEncoded})</Text>
//     <Text style={styles.label}>Temperature: {temperature} °C</Text>
//     <Text style={styles.label}>Humidity: {humidity}%</Text>

//     {/* Number of Rest Stops Input */}
//     <Text style={styles.label}>Number of Rest Stops</Text>
//     <TextInput
//         style={styles.input}
//         keyboardType="numeric"
//         value={restStops}
//         onChangeText={(text) => setRestStops(text.replace(/[^0-9]/g, ''))}
//     />

//     {/* Travel Mode Dropdown */}
//     <Text style={styles.label}>Select Travel Mode</Text>
//     <Picker selectedValue={selectedTravelMode} onValueChange={(itemValue) => setSelectedTravelMode(itemValue)} style={styles.picker}>
//         <Picker.Item label="Walking" value="Walking" />
//         <Picker.Item label="Biking" value="Biking" />
//         <Picker.Item label="Car" value="Car" />
//     </Picker>

//     {loading ? <ActivityIndicator size="large" color="blue" /> : (
//         <TouchableOpacity style={styles.button} onPress={handlePredict}>
//             <Text style={styles.buttonText}>Show Distance and Time</Text>
//         </TouchableOpacity>
//     )}
// </View>

//   );
// };

// // Styles
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#f2f2f2",
//   },
//   header: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
//   picker: { height: 50, width: 250 },
//   label: { fontSize: 16, marginTop: 10 },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     padding: 8,
//     marginTop: 5,
//     width: "80%",
//     borderRadius: 5,
//   },
//   button: {
//     backgroundColor: "#34A853",
//     padding: 15,
//     borderRadius: 10,
//     marginTop: 20,
//   },
//   buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
// });

// export default MountainSelectionScreen;


// import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import axios from "axios";
import { RootStackParamList } from "../App"; // Adjust if necessary
import { useEffect, useState } from "react";

// Define available mountains
const mountains = [
  { name: "Adam's Peak", latitude: 6.8094, longitude: 80.4999, elevation: 2243, difficulty: "Hard", difficultyEncoded: 0 },
  { name: "Bible Rock", latitude: 7.1000, longitude: 80.3333, elevation: 798, difficulty: "Hard", difficultyEncoded: 0 },
  { name: "Ella Rock", latitude: 6.8667, longitude: 81.0386, elevation: 1141, difficulty: "Hard", difficultyEncoded: 0 },
  { name: "Hanthana", latitude: 7.2500, longitude: 80.6333, elevation: 1200, difficulty: "Moderate", difficultyEncoded: 1 },
  { name: "Lakegala", latitude: 7.5833, longitude: 80.9500, elevation: 1310, difficulty: "Hard", difficultyEncoded: 0 },
  { name: "Narangala Mountain", latitude: 7.2167, longitude: 80.8833, elevation: 1527, difficulty: "Moderate", difficultyEncoded: 1 },
  { name: "Sigiriya", latitude: 7.9566, longitude: 80.7595, elevation: 349, difficulty: "Moderate", difficultyEncoded: 1 },
  { name: "Yahangala", latitude: 7.4000, longitude: 81.0000, elevation: 1220, difficulty: "Hard", difficultyEncoded: 0 },
];

// Weather encoding map
const weatherEncoding: { [key: string]: number } = {
  Clear: 3,
  Rain: 2,
  "Moderate Rain": 0,
  Cloudy: 0,
  Windy: 1,
};

// Temperature encoding
const encodeTemperature = (temp: number): number => {
  if (temp >= 1 && temp < 10) return 1;
  if (temp >= 10 && temp < 20) return 2;
  if (temp >= 20 && temp < 30) return 3;
  return 0; // Default case
};

// Humidity encoding
const encodeHumidity = (humidity: number): number => {
  if (humidity >= 75) return 0;
  if (humidity >= 50) return 1;
  return 2;
};

const MountainSelectionScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList, "MountainSelection">>();
  const [selectedMountain, setSelectedMountain] = useState(mountains[0]);
  const [restStops, setRestStops] = useState<string>("0");
  const [selectedTravelMode, setSelectedTravelMode] = useState("Walking");

  const [elevation, setElevation] = useState(mountains[0].elevation);
  const [difficulty, setDifficulty] = useState(mountains[0].difficulty);
  const [difficultyEncoded, setDifficultyEncoded] = useState(mountains[0].difficultyEncoded);
  const [weatherEncoded, setWeatherEncoded] = useState<number | null>(null);
  const [weatherCondition, setWeatherCondition] = useState<string | null>(null);
  const [temperature, setTemperature] = useState<number | null>(null);
  const [humidity, setHumidity] = useState<number | null>(null);
  const [trailConditions, setTrailConditions] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // API keys & URLs
  const WEATHER_API_KEY = "5b1d50dc4c9d25a46417835c506a0644"; // OpenWeather API Key
  const FLASK_API_URL = "http://172.28.17.65:5000/predict/classifier"; // Flask API for Trail Condition

  // Fetch weather encoding from OpenWeather API
  const fetchWeatherEncoding = async () => {
    try {
      const { latitude, longitude } = selectedMountain;
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${WEATHER_API_KEY}`
      );
  
      const forecasts = [
        { time: "Now", data: response.data.list[0] },
        { time: "In 3 Hours", data: response.data.list[1] },
        { time: "In 6 Hours", data: response.data.list[2] },
      ];
  
      // Debug log to check what weather API is returning
      console.log("🌤️ Raw API Response:", response.data);
  
      const weatherMain = forecasts[0].data.weather[0].main;
      console.log("✅ Extracted Weather Condition:", weatherMain);
  
      setTemperature(forecasts[0].data.main.temp);
      setHumidity(forecasts[0].data.main.humidity);
      setWeatherCondition(weatherMain); // Ensure this updates the UI
  
      // Fix: Normalize weather condition
      const normalizedWeather = normalizeWeather(weatherMain);
      console.log("📌 Normalized Weather Condition:", normalizedWeather);
  
      const encodedWeather = weatherEncoding[normalizedWeather] ?? 0;
      setWeatherEncoded(encodedWeather);
  
      predictTrailConditions(forecasts);
    } catch (error) {
      console.error("❌ Weather API Error:", error);
      Alert.alert("Error", "Failed to fetch weather data.");
    }
  };

  const normalizeWeather = (weatherDesc: string): string => {
    const lowerCaseWeather = weatherDesc.toLowerCase();
  
    if (lowerCaseWeather.includes("clear") || lowerCaseWeather.includes("sun")) {
      return "Clear";
    }
    if (lowerCaseWeather.includes("rain")) {
      return "Rain";
    }
    if (lowerCaseWeather.includes("cloud")) {
      return "Cloudy";
    }
    if (lowerCaseWeather.includes("wind")) {
      return "Windy";
    }
    return "Unknown"; // Default case
  };
  
  
  // Predict Trail Conditions
  const predictTrailConditions = async (forecasts: any[]) => {
    try {
        const predictions = await Promise.all(
            forecasts.map(async (forecast) => {
                const { weather, main } = forecast.data;

                // Extract and log the original weather description
                const weatherDescription = weather && weather[0] ? weather[0].main : "Unknown";
                console.log("🌤️ Original Weather Description from API:", weatherDescription);

                // Normalize weather condition
                const weatherMain = normalizeWeather(weatherDescription);
                console.log("🌤️ Normalized Weather:", weatherMain);

                // Encode weather condition
                const encodedWeather = weatherEncoding[weatherMain] ?? 0;
                const encodedTemp = encodeTemperature(main.temp);
                const encodedHumidity = encodeHumidity(main.humidity);

                console.log("🚀 Sending to ML Model:", {
                    OriginalWeather: weatherDescription,
                    NormalizedWeather: weatherMain,
                    EncodedWeather: encodedWeather,
                    Temperature: main.temp,
                    EncodedTemperature: encodedTemp,
                    Humidity: main.humidity,
                    EncodedHumidity: encodedHumidity,
                });

                const response = await axios.post(
                    FLASK_API_URL,
                    { features: [encodedWeather, encodedTemp, encodedHumidity] },
                    { headers: { "Content-Type": "application/json" } }
                );

                console.log("✅ ML Model Response:", response.data);

                return {
                    time: forecast.time,
                    condition: response.data.prediction[0],
                };
            })
        );

        setTrailConditions(predictions);
    } catch (error) {
        console.error("❌ Trail Condition Prediction Error:", error);
    }
};


  const handlePredict = () => {
    if (
      elevation === null || 
      difficultyEncoded === null || 
      weatherEncoded === null || 
      temperature === null || 
      humidity === null
    ) {
      Alert.alert("Please wait for all data to load.");
      return;
    }
  
    navigation.navigate("PredictionResult", {
      mountain: {
        name: selectedMountain.name,
        elevation,
        difficulty: difficultyEncoded,
        weatherEncoded,
        temperature,
        humidity,
        trailConditions,
      },
      restStops: Number(restStops),
      travelMode: selectedTravelMode,
    });
  };
  

  useEffect(() => {
    setLoading(true);
    fetchWeatherEncoding();
  }, [selectedMountain]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select a Mountain</Text>
       {/* Mountain Selection Dropdown */}
       <Picker
        selectedValue={selectedMountain.name}
        onValueChange={(itemValue) => {
          const mountain = mountains.find((m) => m.name === itemValue);
          if (mountain) {
            setSelectedMountain(mountain);
            setDifficulty(mountain.difficulty);
            setDifficultyEncoded(mountain.difficultyEncoded);
            setElevation(mountain.elevation);
          }
        }}
        style={styles.picker}
      >
        {mountains.map((mountain, index) => (
          <Picker.Item key={index} label={mountain.name} value={mountain.name} />
        ))}
      </Picker>

      <Text style={styles.label}>Elevation: {elevation}m</Text>
      <Text style={styles.label}>Difficulty: {difficulty} (Encoded: {difficultyEncoded})</Text>
      <Text style={styles.label}>Weather: {weatherCondition} (Encoded: {weatherEncoded})</Text>
      <Text style={styles.label}>Temperature: {temperature} °C</Text>
      <Text style={styles.label}>Humidity: {humidity}%</Text>

      {trailConditions.map((forecast, index) => (
        <Text key={index} style={styles.label}>
          Trail Condition {forecast.time}: {forecast.condition}
        </Text>
      ))}

<TouchableOpacity style={styles.button} onPress={handlePredict}>
  <Text style={styles.buttonText}>Show Distance and Time</Text>
</TouchableOpacity>

    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
  },
  header: { fontSize: 20, fontWeight: "bold", marginBottom: 10 },
  picker: { height: 50, width: 250 },
  label: { fontSize: 16, marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    marginTop: 5,
    width: "80%",
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#34A853",
    padding: 15,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

export default MountainSelectionScreen;
