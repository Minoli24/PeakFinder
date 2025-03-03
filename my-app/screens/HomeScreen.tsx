// import React, { useState, useEffect } from "react";
// import { View, Text, StyleSheet, ImageBackground, ActivityIndicator } from "react-native";
// import axios from "axios";
// import { useNavigation } from "@react-navigation/native";

// export default function  HomeScreen() {
//   const navigation = useNavigation();
//   const [city, setCity] = useState<string | null>(null);
//   const [weatherData, setWeatherData] = useState<any[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   const API_KEY = "a304e8aa816e13c751f54d94f56d8a8a"; // Replace with your OpenWeather API Key
//   //const FLASK_API_URL = "http://192.168.1.6:5000/predict/classifier"; // Replace with Flask API URL
//   const FLASK_API_URL = "http://192.168.1.6:5000/predict/classifier";

//   useEffect(() => {
//     getLocationPermission();
//   }, []);

//   // ✅ Get User's Location
//   const getLocationPermission = async () => {
//     try {
//       if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(
//           (position) => {
//             const { latitude, longitude } = position.coords;
//             fetchCityName(latitude, longitude);
//             fetchWeatherData(latitude, longitude);
//           },
//           (error) => {
//             alert("Error fetching location. Enable location services.");
//             console.error("Location Error:", error);
//           }
//         );
//       } else {
//         alert("Geolocation is not supported by this browser.");
//       }
//     } catch (error) {
//       console.error("Location Permission Error:", error);
//     }
//   };

//   // ✅ Reverse Geocoding: Convert Lat/Lon to City Name
//   const fetchCityName = async (lat: number, lon: number) => {
//     try {
//       const response = await axios.get(
//         `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
//       );
//       if (response.data.length > 0) {
//         setCity(response.data[0].name);
//       } else {
//         setCity("Unknown Location");
//       }
//     } catch (error) {
//       console.error("Failed to fetch city name:", error);
//     }
//   };

//   // ✅ Fetch Weather Data & Predict Automatically
//   const fetchWeatherData = async (lat: number, lon: number) => {
//     try {
//       const response = await axios.get(
//         `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
//       );

//       const { list } = response.data;

//       // Get weather for Now, In 3 Hours, In 6 Hours
//       const forecasts = [
//         { time: "Now", data: list[0] },
//         { time: "In 3 Hours", data: list[1] },
//         { time: "In 6 Hours", data: list[2] },
//       ];

//       // Predict Trail Conditions
//       predictTrailConditions(forecasts);
//     } catch (error) {
//       console.error("Failed to fetch weather data:", error);
//       alert("Failed to fetch weather data. Check your API key and network connection.");
//     }
//   };

//   // ✅ Predict Trail Conditions for multiple forecasts
//   const predictTrailConditions = async (forecasts: any[]) => {
//     try {
//       const predictions = await Promise.all(
//         forecasts.map(async (forecast) => {
//           const { weather, main } = forecast.data;
//           const encodedWeather = weather[0].main === "Clear" ? 2 : weather[0].main === "Rain" ? 1 : 0;

//           const response = await axios.post(
//             FLASK_API_URL,
//             { features: [encodedWeather, main.temp, main.humidity] },
//             { headers: { "Content-Type": "application/json" } }
//           );

//           return {
//             time: forecast.time,
//             weather: weather[0].main,
//             temp: main.temp,
//             humidity: main.humidity,
//             condition: response.data.prediction[0],
//           };
//         })
//       );

//       setWeatherData(predictions);
//       setLoading(false);
//     } catch (error) {
//       console.error("Prediction Error:", error);
//       setWeatherData([
//         { time: "Now", weather: "Error", temp: "N/A", humidity: "N/A", condition: "Error fetching prediction" },
//         { time: "In 3 Hours", weather: "Error", temp: "N/A", humidity: "N/A", condition: "Error fetching prediction" },
//         { time: "In 6 Hours", weather: "Error", temp: "N/A", humidity: "N/A", condition: "Error fetching prediction" },
//       ]);
//       setLoading(false);
//     }
//   };

//   // ✅ Dynamic Trail Safety Messages
//   const getTrailMessage = (condition: string) => {
//     if (condition === "Dry") {
//       return "You can have a safe hike! The trail is in excellent condition.";
//     } else if (condition === "Wet") {
//       return "The trail is wet, be careful! Slippery areas may be present.";
//     } else if (condition === "Muddy") {
//       return "The trail is muddy! Slippery and dangerous. Consider an alternative path.";
//     } else {
//       return "Fetching trail condition...";
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <ImageBackground source={require("./assets/trail_background.jpg")} style={styles.backgroundImage}>
//         {loading ? (
//           <ActivityIndicator size="large" color="#ffffff" />
//         ) : (
//           <View style={styles.card}>
//             {/* <Text style={styles.header}>Weather Conditions</Text> */}
//             <Text style={styles.city}>{city || "Fetching location..."}</Text>

//             {weatherData.map((forecast, index) => (
//               <View key={index} style={styles.trailBox}>
//                 <Text style={styles.time}>{forecast.time}</Text>
//                 <Text style={styles.weather}>Weather: {forecast.weather}</Text>
//                 <Text style={styles.temp}>{forecast.temp}°C</Text>
//                 <Text style={styles.details}>Humidity: {forecast.humidity}%</Text>
//                 <Text style={styles.trailText}>Trail Condition: {forecast.condition}</Text>
//                 <Text style={styles.trailMessage}>{getTrailMessage(forecast.condition)}</Text>
//               </View>
//             ))}
//           </View>
//         )}
//       </ImageBackground>
//     </View>
//   );
// }

// // ✅ UI Styling
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f2f2f2",
//   },
//   backgroundImage: {
//     flex: 1,
//     resizeMode: "cover",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   card: {
//     backgroundColor: "white",
//     width: "50%",
//     borderRadius: 20,
//     padding: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     elevation: 5,
//     alignItems: "flex-start",
//   },
//   header: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   city: {
//     fontSize: 25,
//     fontWeight: "bold",
//   },
//   time: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   weather: {
//     fontSize: 16,
//     color: "gray",
//   },
//   temp: {
//     fontSize: 40,
//     fontWeight: "bold",
//     color: "#ff9f1c",
//   },
//   details: {
//     fontSize: 16,
//     color: "#444",
//   },
//   trailBox: {
//     marginTop: 10,
//     padding: 15,
//     backgroundColor: "#eee",
//     borderRadius: 10,
//     alignItems: "flex-start",
//     width: "100%",
//   },
//   trailText: {
//     fontSize: 20,
//     fontWeight: "bold",
//   },
//   trailMessage: {
//     fontSize: 14,
//     color: "#666",
//     textAlign: "center",
//     fontStyle: "italic",
//   },
// });
// import React, { useState, useEffect } from "react";
// import {
//     View,
//     Text,
//     StyleSheet,
//     ImageBackground,
//     ActivityIndicator,
//     TouchableOpacity,
//   } from "react-native";
//   import axios from "axios";
//   import { useNavigation } from "@react-navigation/native";
//   import { StackScreenProps } from "@react-navigation/stack";
//   import { RootStackParamList } from "../App"; // Import navigation types
// import { useEffect, useState } from "react";
  
//   // Define TypeScript type for navigation props
//   type HomeScreenProps = StackScreenProps<RootStackParamList, "Home">;
  
//   export default function HomeScreen() {
//     const navigation = useNavigation<HomeScreenProps["navigation"]>();
  
//     const [city, setCity] = useState<string | null>(null);
//     const [weatherData, setWeatherData] = useState<any[]>([]);
//     const [loading, setLoading] = useState<boolean>(true);
//     const [weatherCondition, setWeatherCondition] = useState<string | null>(null);
//     const [weatherEncoded, setWeatherEncoded] = useState<number | null>(null);

  
//     const API_KEY = "a304e8aa816e13c751f54d94f56d8a8a"; // OpenWeather API Key
//     const FLASK_API_URL = "http://192.168.1.18:5000/predict/classifier"; // Flask API
  
//     useEffect(() => {
//       getLocationPermission();
//     }, []);
  
//     const getLocationPermission = async () => {
//       try {
//         if (navigator.geolocation) {
//           navigator.geolocation.getCurrentPosition(
//             (position) => {
//               const { latitude, longitude } = position.coords;
//               fetchCityName(latitude, longitude);
//               fetchWeatherData(latitude, longitude);
//             },
//             (error) => {
//               alert("Error fetching location. Enable location services.");
//               console.error("Location Error:", error);
//             }
//           );
//         } else {
//           alert("Geolocation is not supported by this browser.");
//         }
//       } catch (error) {
//         console.error("Location Permission Error:", error);
//       }
//     };
  
//     const fetchCityName = async (lat: number, lon: number) => {
//       try {
//         const response = await axios.get(
//           `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
//         );
//         setCity(response.data.length > 0 ? response.data[0].name : "Unknown Location");
//       } catch (error) {
//         console.error("Failed to fetch city name:", error);
//       }
//     };
  
//     const weatherEncoding: { [key: string]: number } = {
//       Sunny: 2,
//       Rain: 1,
//       Cloudy: 0,
//       Windy: 0,
//       Unknown: 0,
//     };
    
//     const fetchWeatherData = async (lat: number, lon: number) => {
//       try {
//         const response = await axios.get(
//           `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&_=${new Date().getTime()}`
//         );
        
//         const normalizeWeather = (weatherDesc: string) => {
//           const lowerCaseWeather = weatherDesc.toLowerCase();
        
//           if (lowerCaseWeather.includes("rain")) return "Rain";
//           if (lowerCaseWeather.includes("cloud")) return "Cloudy";
//           if (lowerCaseWeather.includes("sun") || lowerCaseWeather.includes("clear")) return "Sunny";
//           if (lowerCaseWeather.includes("wind")) return "Windy";
          
//           return "Unknown";  // Default if no match
//         };
        

//         const weatherMain = normalizeWeather(response.data.list[0].weather[0].description);
// console.log("API Weather Description:", response.data.list[0].weather[0].description);
// console.log("Normalized Weather:", weatherMain);
// setWeatherCondition(weatherMain);
// setWeatherEncoded(weatherEncoding[weatherMain] ?? 0);

//         const { list } = response.data;
//         const forecasts = [
//           { time: "Now", data: list[0] },
//           { time: "In 3 Hours", data: list[1] },
//           { time: "In 6 Hours", data: list[2] },
//         ];
  
//         predictTrailConditions(forecasts);
//       } catch (error) {
//         console.error("Failed to fetch weather data:", error);
//         alert("Failed to fetch weather data. Check your API key and network connection.");

        
//       }
//     };
  
//     const predictTrailConditions = async (forecasts: any[]) => {
//       try {
//         const predictions = await Promise.all(
//           forecasts.map(async (forecast) => {
//             const { weather, main } = forecast.data;
//             const encodedWeather = weather[0].main === "Clear" ? 2 : weather[0].main === "Rain" ? 1 : 0;
  
//             const response = await axios.post(
//               FLASK_API_URL,
//               { features: [encodedWeather, main.temp, main.humidity] },
//               { headers: { "Content-Type": "application/json" } }
//             );
  
//             return {
//               time: forecast.time,
//               weather: weather[0].main,
//               temp: main.temp,
//               humidity: main.humidity,
//               condition: response.data.prediction[0],
//             };
//           })
//         );
  
//         setWeatherData(predictions);
//         setLoading(false);
//       } catch (error) {
//         console.error("Prediction Error:", error);
//         setWeatherData([
//           { time: "Now", weather: "Error", temp: "N/A", humidity: "N/A", condition: "Error fetching prediction" },
//           { time: "In 3 Hours", weather: "Error", temp: "N/A", humidity: "N/A", condition: "Error fetching prediction" },
//           { time: "In 6 Hours", weather: "Error", temp: "N/A", humidity: "N/A", condition: "Error fetching prediction" },
//         ]);
//         setLoading(false);
//       }
//     };
  
//     const getTrailMessage = (condition: string) => {
//       if (condition === "Dry") return "You can have a safe hike! The trail is in excellent condition.";
//       if (condition === "Wet") return "The trail is wet, be careful! Slippery areas may be present.";
//       if (condition === "Muddy") return "The trail is muddy! Slippery and dangerous. Consider an alternative path.";
//       return "Fetching trail condition...";
//     };
  
//     return (
//       <View style={styles.container}>
//         <ImageBackground source={require("../assets/trail_background.jpg")} style={styles.backgroundImage}>
//           {loading ? (
//             <ActivityIndicator size="large" color="#ffffff" />
//           ) : (
//             <View style={styles.card}>
//               <Text style={styles.city}>{city || "Fetching location..."}</Text>
//               {weatherData.map((forecast, index) => (
//                 <View key={index} style={styles.trailBox}>
//                   <Text style={styles.time}>{forecast.time}</Text>
//                   <Text style={styles.weather}>Weather: {forecast.weather}</Text>
//                   <Text style={styles.temp}>{forecast.temp}°C</Text>
//                   <Text style={styles.details}>Humidity: {forecast.humidity}%</Text>
//                   <Text style={styles.trailText}>Trail Condition: {forecast.condition}</Text>
//                   <Text style={styles.trailMessage}>{getTrailMessage(forecast.condition)}</Text>
//                 </View>
//               ))}
//               <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("MountainSelection")}>
//                 <Text style={styles.buttonText}>Go to Mountain Selection</Text>
//               </TouchableOpacity>
//             </View>
//           )}
//         </ImageBackground>
//       </View>
//     );
//   }
  
//   const styles = StyleSheet.create({
//     container: {
//       flex: 1,
//       backgroundColor: "#f2f2f2",
//     },
//     backgroundImage: {
//       flex: 1,
//       resizeMode: "cover",
//       justifyContent: "center",
//       alignItems: "center",
//     },
//     card: {
//       backgroundColor: "white",
//       width: "90%",
//       borderRadius: 20,
//       padding: 20,
//       shadowColor: "#000",
//       shadowOffset: { width: 0, height: 4 },
//       shadowOpacity: 0.2,
//       shadowRadius: 5,
//       elevation: 5,
//       alignItems: "center",
//     },
//     city: {
//       fontSize: 25,
//       fontWeight: "bold",
//     },
//     time: {
//       fontSize: 16,
//       fontWeight: "bold",
//       color: "#333",
//     },
//     weather: {
//       fontSize: 16,
//       color: "gray",
//     },
//     temp: {
//       fontSize: 40,
//       fontWeight: "bold",
//       color: "#ff9f1c",
//     },
//     details: {
//       fontSize: 16,
//       color: "#444",
//       fontWeight: "bold",
//     },
//     trailBox: {
//       marginTop: 10,
//       padding: 15,
//       backgroundColor: "#eee",
//       borderRadius: 10,
//       alignItems: "center",
//       width: "100%",
//     },
//     trailText: {
//       fontSize: 20,
//       fontWeight: "bold",
//       color: "#222",
//     },
//     trailMessage: {
//       fontSize: 14,
//       color: "#666",
//       textAlign: "center",
//       fontStyle: "italic",
//     },
//     button: {
//       marginTop: 20,
//       backgroundColor: "#28a745",
//       paddingVertical: 12,
//       paddingHorizontal: 20,
//       borderRadius: 25,
//     },
//     buttonText: {
//       color: "#fff",
//       fontSize: 16,
//       fontWeight: "bold",
//     },
//   });
  

// function setWeatherCondition(weatherMain: string) {
//   throw new Error("Function not implemented.");
// }

// function setWeatherEncoded(arg0: any) {
//   throw new Error("Function not implemented.");
// }
  

// import {
//   View,
//   Text,
//   StyleSheet,
//   ImageBackground,
//   ActivityIndicator,
//   TouchableOpacity,
// } from "react-native";
// import axios from "axios";
// import { useNavigation } from "@react-navigation/native";
// import { StackScreenProps } from "@react-navigation/stack";
// import { RootStackParamList } from "../App"; // Import navigation types
// import { useEffect, useState } from "react";

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f2f2f2",
//   },
//   backgroundImage: {
//     flex: 1,
//     resizeMode: "cover",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   card: {
//     backgroundColor: "white",
//     width: "90%",
//     borderRadius: 20,
//     padding: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     elevation: 5,
//     alignItems: "center",
//   },
//   city: {
//     fontSize: 25,
//     fontWeight: "bold",
//   },
//   time: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   weather: {
//     fontSize: 16,
//     color: "gray",
//   },
//   temp: {
//     fontSize: 40,
//     fontWeight: "bold",
//     color: "#ff9f1c",
//   },
//   details: {
//     fontSize: 16,
//     color: "#444",
//     fontWeight: "bold",
//   },
//   trailBox: {
//     marginTop: 10,
//     padding: 15,
//     backgroundColor: "#eee",
//     borderRadius: 10,
//     alignItems: "center",
//     width: "100%",
//   },
//   trailText: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#222",
//   },
//   trailMessage: {
//     fontSize: 14,
//     color: "#666",
//     textAlign: "center",
//     fontStyle: "italic",
//   },
//   button: {
//     marginTop: 20,
//     backgroundColor: "#28a745",
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 25,
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });

// // Define TypeScript type for navigation props
// type HomeScreenProps = StackScreenProps<RootStackParamList, "Home">;

// export default function HomeScreen() {
//   const navigation = useNavigation<HomeScreenProps["navigation"]>();

//   const [city, setCity] = useState<string | null>(null);
//   const [weatherData, setWeatherData] = useState<any[]>([]);
//   const [weatherCondition, setWeatherCondition] = useState<string | null>(null);
//   const [weatherEncoded, setWeatherEncoded] = useState<number | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);

//   const API_KEY = "a304e8aa816e13c751f54d94f56d8a8a"; // OpenWeather API Key
//   const FLASK_API_URL = "http://192.168.1.18:5000/predict/classifier"; // Flask API

//   useEffect(() => {
//     getLocationPermission();
//   }, []);

//   // Get user location
//   const getLocationPermission = async () => {
//     try {
//       if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(
//           (position) => {
//             const { latitude, longitude } = position.coords;
//             fetchCityName(latitude, longitude);
//             fetchWeatherData(latitude, longitude);
//           },
//           (error) => {
//             alert("Error fetching location. Enable location services.");
//             console.error("Location Error:", error);
//           }
//         );
//       } else {
//         alert("Geolocation is not supported by this browser.");
//       }
//     } catch (error) {
//       console.error("Location Permission Error:", error);
//     }
//   };

//   // Get city name
//   const fetchCityName = async (lat: number, lon: number) => {
//     try {
//       const response = await axios.get(
//         `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
//       );
//       setCity(response.data.length > 0 ? response.data[0].name : "Unknown Location");
//     } catch (error) {
//       console.error("Failed to fetch city name:", error);
//     }
//   };

//   // Weather encoding mapping
//   const weatherEncoding: { [key: string]: number } = {
//     Clear: 3,
//     Rain: 2,
//     Cloudy: 0,
//     Windy: 1,
//     Unknown: 0,
//   };

//   // Fetch weather data
//   const fetchWeatherData = async (lat: number, lon: number) => {
//     try {
//       const response = await axios.get(
//         `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&_=${new Date().getTime()}`
//       );

//       // Normalize weather description
//       const normalizeWeather = (weatherDesc: string) => {
//         const lowerCaseWeather = weatherDesc.toLowerCase();
//         if (lowerCaseWeather.includes("rain")) return "Rain";
//         if (lowerCaseWeather.includes("cloud")) return "Cloudy";
//         if (lowerCaseWeather.includes("sun") || lowerCaseWeather.includes("clear")) return "Sunny";
//         if (lowerCaseWeather.includes("wind")) return "Windy";
//         return "Unknown"; // Default if no match
//       };

//       const weatherMain = normalizeWeather(response.data.list[0].weather[0].description);

//       console.log("API Weather Description:", response.data.list[0].weather[0].description);
//       console.log("Normalized Weather:", weatherMain);

//       setWeatherCondition(weatherMain);
//       setWeatherEncoded(weatherEncoding[weatherMain] ?? 0);

//       const { list } = response.data;
//       const forecasts = [
//         { time: "Now", data: list[0] },
//         { time: "In 3 Hours", data: list[1] },
//         { time: "In 6 Hours", data: list[2] },
//       ];

//       predictTrailConditions(forecasts);
//     } catch (error) {
//       console.error("Failed to fetch weather data:", error);
//       alert("Failed to fetch weather data. Check your API key and network connection.");
//     }
//   };

//   // Predict trail conditions
//   const predictTrailConditions = async (forecasts: any[]) => {
//     try {
//       const predictions = await Promise.all(
//         forecasts.map(async (forecast) => {
//           const { weather, main } = forecast.data;
//           const encodedWeather = weatherEncoding[weather[0].main] ?? 0;

//           const response = await axios.post(
//             FLASK_API_URL,
//             { features: [encodedWeather, main.temp, main.humidity] },
//             { headers: { "Content-Type": "application/json" } }
//           );

//           return {
//             time: forecast.time,
//             weather: weather[0].main,
//             temp: main.temp,
//             humidity: main.humidity,
//             condition: response.data.prediction[0],
//           };
//         })
//       );

//       setWeatherData(predictions);
//       setLoading(false);
//     } catch (error) {
//       console.error("Prediction Error:", error);
//       setWeatherData([
//         { time: "Now", weather: "Error", temp: "N/A", humidity: "N/A", condition: "Error fetching prediction" },
//         { time: "In 3 Hours", weather: "Error", temp: "N/A", humidity: "N/A", condition: "Error fetching prediction" },
//         { time: "In 6 Hours", weather: "Error", temp: "N/A", humidity: "N/A", condition: "Error fetching prediction" },
//       ]);
//       setLoading(false);
//     }
//   };

//   // Generate trail message
//   const getTrailMessage = (condition: string) => {
//     if (condition === "Dry") return "You can have a safe hike! The trail is in excellent condition.";
//     if (condition === "Wet") return "The trail is wet, be careful! Slippery areas may be present.";
//     if (condition === "Muddy") return "The trail is muddy! Slippery and dangerous. Consider an alternative path.";
//     return "Fetching trail condition...";
//   };

//   return (
//     <View style={styles.container}>
//       <ImageBackground source={require("../assets/trail_background.jpg")} style={styles.backgroundImage}>
//         {loading ? (
//           <ActivityIndicator size="large" color="#ffffff" />
//         ) : (
//           <View style={styles.card}>
//             <Text style={styles.city}>{city || "Fetching location..."}</Text>
//             {weatherData.map((forecast, index) => (
//               <View key={index} style={styles.trailBox}>
//                 <Text style={styles.time}>{forecast.time}</Text>
//                 <Text style={styles.weather}>Weather: {forecast.weather}</Text>
//                 <Text style={styles.temp}>{forecast.temp}°C</Text>
//                 <Text style={styles.details}>Humidity: {forecast.humidity}%</Text>
//                 <Text style={styles.trailText}>Trail Condition: {forecast.condition}</Text>
//                 <Text style={styles.trailMessage}>{getTrailMessage(forecast.condition)}</Text>
//               </View>
//             ))}
//             <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("MountainSelection")}>
//               <Text style={styles.buttonText}>Go to Mountain Selection</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </ImageBackground>
//     </View>
//   );
// }


// import {
//   View,
//   Text,
//   StyleSheet,
//   ImageBackground,
//   ActivityIndicator,
//   TouchableOpacity,
// } from "react-native";
// import axios from "axios";
// import { useNavigation } from "@react-navigation/native";
// import { StackScreenProps } from "@react-navigation/stack";
// import { RootStackParamList } from "../App"; // Import navigation types
// import { useEffect, useState } from "react";

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f2f2f2",
//   },
//   backgroundImage: {
//     flex: 1,
//     resizeMode: "cover",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   card: {
//     backgroundColor: "white",
//     width: "90%",
//     borderRadius: 20,
//     padding: 20,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.2,
//     shadowRadius: 5,
//     elevation: 5,
//     alignItems: "center",
//   },
//   city: {
//     fontSize: 25,
//     fontWeight: "bold",
//   },
//   time: {
//     fontSize: 16,
//     fontWeight: "bold",
//     color: "#333",
//   },
//   weather: {
//     fontSize: 16,
//     color: "gray",
//   },
//   temp: {
//     fontSize: 40,
//     fontWeight: "bold",
//     color: "#ff9f1c",
//   },
//   details: {
//     fontSize: 16,
//     color: "#444",
//     fontWeight: "bold",
//   },
//   trailBox: {
//     marginTop: 10,
//     padding: 15,
//     backgroundColor: "#eee",
//     borderRadius: 10,
//     alignItems: "center",
//     width: "100%",
//   },
//   trailText: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#222",
//   },
//   trailMessage: {
//     fontSize: 14,
//     color: "#666",
//     textAlign: "center",
//     fontStyle: "italic",
//   },
//   button: {
//     marginTop: 20,
//     backgroundColor: "#28a745",
//     paddingVertical: 12,
//     paddingHorizontal: 20,
//     borderRadius: 25,
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });

// // Define TypeScript type for navigation props
// type HomeScreenProps = StackScreenProps<RootStackParamList, "Home">;

// export default function HomeScreen() {
//   const navigation = useNavigation<HomeScreenProps["navigation"]>();

//   const [city, setCity] = useState<string | null>(null);
//   const [weatherData, setWeatherData] = useState<any[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   const API_KEY = "5b1d50dc4c9d25a46417835c506a0644"; // OpenWeather API Key
//   const FLASK_API_URL = "http://192.168.1.18:5000/predict/classifier"; // Flask API

//   useEffect(() => {
//     getLocationPermission();
//   }, []);

//   // Get user location
//   const getLocationPermission = async () => {
//     try {
//       if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(
//           (position) => {
//             const { latitude, longitude } = position.coords;
//             fetchCityName(latitude, longitude);
//             fetchWeatherData(latitude, longitude);
//           },
//           (error) => {
//             alert("Error fetching location. Enable location services.");
//             console.error("Location Error:", error);
//           }
//         );
//       } else {
//         alert("Geolocation is not supported by this browser.");
//       }
//     } catch (error) {
//       console.error("Location Permission Error:", error);
//     }
//   };

//   // Get city name
//   const fetchCityName = async (lat: number, lon: number) => {
//     try {
//       const response = await axios.get(
//         `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
//       );
//       setCity(response.data.length > 0 ? response.data[0].name : "Unknown Location");
//     } catch (error) {
//       console.error("Failed to fetch city name:", error);
//     }
//   };

//   // **Weather encoding mapping**
//   const weatherEncoding: { [key: string]: number } = {
//     Clear: 3,
//     Rain: 2,
//     Cloudy: 0,
//     Windy: 1,
//     Unknown: 0,
//   };

//   // **Temperature encoding function**
//   const encodeTemperature = (temp: number): number => {
//     if (temp >= 1 && temp < 10) return 1;
//     if (temp >= 10 && temp < 20) return 2;
//     if (temp >= 20 && temp < 30) return 3;
//     return 0; // Default case
//   };

//   // **Humidity encoding function**
//   const encodeHumidity = (humidity: number): number => {
//     if (humidity >= 75) return 0;
//     if (humidity >= 50) return 1;
//     return 2;
//   };

//   // **Normalize weather description**
//   const normalizeWeather = (weatherDesc: string): string => {
//     const lowerCaseWeather = weatherDesc.toLowerCase();
//     if (lowerCaseWeather.includes("rain")) return "Rain";
//     if (lowerCaseWeather.includes("cloud")) return "Cloudy";
//     if (lowerCaseWeather.includes("sun") || lowerCaseWeather.includes("clear")) return "Clear";
//     if (lowerCaseWeather.includes("wind")) return "Windy";
//     return "Unknown"; // Default if no match
//   };

//   // Fetch weather data
//   const fetchWeatherData = async (lat: number, lon: number) => {
//     try {
//       const response = await axios.get(
//         `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
//       );

//       const { list } = response.data;

//       // Extract data for "Now", "In 3 Hours", and "In 6 Hours"
//       const forecasts = [
//         { time: "Now", data: list[0] },
//         { time: "In 3 Hours", data: list[1] },
//         { time: "In 6 Hours", data: list[2] },
//       ];

//       predictTrailConditions(forecasts);
//     } catch (error) {
//       console.error("Failed to fetch weather data:", error);
//       alert("Failed to fetch weather data. Check your API key and network connection.");
//     }
//   };

//   // Predict trail conditions
//   const predictTrailConditions = async (forecasts: any[]) => {
//     try {
//       const predictions = await Promise.all(
//         forecasts.map(async (forecast) => {
//           const { weather, main } = forecast.data;
//           const weatherMain = normalizeWeather(weather[0].main);

//           const encodedWeather = weatherEncoding[weatherMain] ?? 0;
//           const encodedTemp = encodeTemperature(main.temp);
//           const encodedHumidity = encodeHumidity(main.humidity);

//           console.log("🚀 Sending to ML Model:", {
//             Weather: weatherMain,
//             EncodedWeather: encodedWeather,
//             Temperature: main.temp,
//             EncodedTemperature: encodedTemp,
//             Humidity: main.humidity,
//             EncodedHumidity: encodedHumidity,
//           });

//           const response = await axios.post(
//             FLASK_API_URL,
//             { features: [encodedWeather, encodedTemp, encodedHumidity] },
//             { headers: { "Content-Type": "application/json" } }
//           );

//           console.log("✅ ML Model Response:", response.data);

//           return {
//             time: forecast.time,
//             weather: weatherMain,
//             temp: main.temp,
//             humidity: main.humidity,
//             condition: response.data.prediction[0],
//           };
//         })
//       );

//       setWeatherData(predictions);
//       setLoading(false);
//     } catch (error) {
//       console.error("Prediction Error:", error);
//       setWeatherData([
//         { time: "Now", weather: "Error", temp: "N/A", humidity: "N/A", condition: "Error fetching prediction" },
//         { time: "In 3 Hours", weather: "Error", temp: "N/A", humidity: "N/A", condition: "Error fetching prediction" },
//         { time: "In 6 Hours", weather: "Error", temp: "N/A", humidity: "N/A", condition: "Error fetching prediction" },
//       ]);
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <ImageBackground source={require("../assets/trail_background.jpg")} style={styles.backgroundImage}>
//         {loading ? (
//           <ActivityIndicator size="large" color="#ffffff" />
//         ) : (
//           <View style={styles.card}>
//             <Text style={styles.city}>{city || "Fetching location..."}</Text>
//             {weatherData.map((forecast, index) => (
//               <View key={index} style={styles.trailBox}>
//                 <Text style={styles.time}>{forecast.time}</Text>
//                 <Text style={styles.weather}>Weather: {forecast.weather}</Text>
//                 <Text style={styles.temp}>{forecast.temp}°C</Text>
//                 <Text style={styles.details}>Humidity: {forecast.humidity}%</Text>
//                 <Text style={styles.trailText}>Trail Condition: {forecast.condition}</Text>
//               </View>
//             ))}
//             <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("MountainSelection")}>
//               <Text style={styles.buttonText}>Go to Mountain Selection</Text>
//             </TouchableOpacity>
//           </View>
//         )}
//       </ImageBackground>
//     </View>
//   );
// }


import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { StackScreenProps } from "@react-navigation/stack";
import { RootStackParamList } from "../App"; // Import navigation types

// Define TypeScript type for navigation props
type HomeScreenProps = StackScreenProps<RootStackParamList, "Home">;

export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenProps["navigation"]>();

  const [city, setCity] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [originalWeatherDescription, setOriginalWeatherDescription] = useState<string | null>(null);


  const API_KEY = "5b1d50dc4c9d25a46417835c506a0644"; // OpenWeather API Key
  //const FLASK_API_URL = "http://192.168.1.18:5000/predict/classifier"; // Flask API
  const FLASK_API_URL = "http://172.28.17.65:5000/predict/classifier";

  useEffect(() => {
    getLocationPermission();
  }, []);

  // Get user location
  const getLocationPermission = async () => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            fetchCityName(latitude, longitude);
            fetchWeatherData(latitude, longitude);
          },
          (error) => {
            alert("Error fetching location. Enable location services.");
            console.error("Location Error:", error);
          }
        );
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    } catch (error) {
      console.error("Location Permission Error:", error);
    }
  };

  // Get city name
  const fetchCityName = async (lat: number, lon: number) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${API_KEY}`
      );
      setCity(response.data.length > 0 ? response.data[0].name : "Unknown Location");
    } catch (error) {
      console.error("Failed to fetch city name:", error);
    }
  };

  // Weather encoding mapping
  const weatherEncoding: { [key: string]: number } = {
    Sunny: 3,
    Rainy: 2,
    Cloudy: 0,
    Windy: 1,
    Unknown: 0,
  };

  // Normalize weather description
  // const normalizeWeather = (weatherDesc: string): string => {
  //   const lowerCaseWeather = weatherDesc.toLowerCase();

  //   if (lowerCaseWeather.includes("clear") || lowerCaseWeather.includes("sun")) {
  //     return "Sunny";
  //   }
  //   if (lowerCaseWeather.includes("rain")) {
  //     return "Rainy";
  //   }
  //   if (lowerCaseWeather.includes("cloud")) {
  //     return "Cloudy";
  //   }
  //   if (lowerCaseWeather.includes("wind")) {
  //     return "Windy";
  //   }
  //   return "Unknown";
  // };

  const normalizeWeather = (weatherDesc: string): string => {
    const lowerCaseWeather = weatherDesc.toLowerCase();
  
    if (lowerCaseWeather.includes("clear") || lowerCaseWeather.includes("sun")) {
      return "Clear";
    }
    if (lowerCaseWeather.includes("light rain")) {
      return "Light Rain";  // NEW: Differentiating rain intensity
    }
    if (lowerCaseWeather.includes("moderate rain")) {
      return "Cloudy";
    }
    if (lowerCaseWeather.includes("heavy rain") || lowerCaseWeather.includes("intense rain")) {
      return "Heavy Rain";
    }
    if (lowerCaseWeather.includes("rain")) {
      return "Rainy";
    }
    if (lowerCaseWeather.includes("cloud")) {
      return "Cloudy";
    }
    if (lowerCaseWeather.includes("wind")) {
      return "Windy";
    }
    return "Unknown"; // Default case
  };
  

  // Fetch weather data
  const fetchWeatherData = async (lat: number, lon: number) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );

      const { list } = response.data;
      const forecast = response.data.list[0];
if (!forecast || !forecast.weather || forecast.weather.length === 0) {
  console.error("Invalid weather data:", response.data);
  return;
}

const weatherMain = normalizeWeather(forecast.weather[0].description);
console.log("Extracted Weather:", weatherMain);


      // Extract data for "Now", "In 3 Hours", and "In 6 Hours"
      const forecasts = [
        { time: "Now", data: list[0] },
        { time: "In 3 Hours", data: list[1] },
        { time: "In 6 Hours", data: list[2] },
      ];

      predictTrailConditions(forecasts);
    } catch (error) {
      console.error("Failed to fetch weather data:", error);
      alert("Failed to fetch weather data. Check your API key and network connection.");
    }
  };

  // Predict trail conditions
  const predictTrailConditions = async (forecasts: any[]) => {
    try {
      const predictions = await Promise.all(
        forecasts.map(async (forecast) => {
          const { weather, main } = forecast.data;
          const weatherDescription = weather && weather[0] ? weather[0].description : "Unknown";
          const weatherMain = normalizeWeather(weatherDescription);

          console.log("🌤️ Original Weather Description from API:", weatherDescription);
          console.log("🌤️ Normalized Weather:", weatherMain);

          const encodedWeather = weatherEncoding[weatherMain] ?? 0;
          const encodedTemp = encodeTemperature(main.temp);
          const encodedHumidity = encodeHumidity(main.humidity);

          console.log("🚀 Sending to ML Model:", {
            Weather: weatherMain,
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
            weather: weatherMain,
            temp: main.temp,
            humidity: main.humidity,
            condition: response.data.prediction[0],
          };
        })
      );

      setWeatherData(predictions);
      setLoading(false);
    } catch (error) {
      console.error("Prediction Error:", error);
      setWeatherData([
        { time: "Now", weather: "Error", temp: "N/A", humidity: "N/A", condition: "Error fetching prediction" },
        { time: "In 3 Hours", weather: "Error", temp: "N/A", humidity: "N/A", condition: "Error fetching prediction" },
        { time: "In 6 Hours", weather: "Error", temp: "N/A", humidity: "N/A", condition: "Error fetching prediction" },
      ]);
      setLoading(false);
    }
  };
  // Temperature encoding function
  const encodeTemperature = (temp: number): number => {
    if (temp >= 1 && temp < 10) return 1;
    if (temp >= 10 && temp < 20) return 2;
    if (temp >= 20 && temp < 30) return 3;
    return 0; // Default case
  };

  // Humidity encoding function
  const encodeHumidity = (humidity: number): number => {
    if (humidity >= 75) return 0;
    if (humidity >= 50) return 1;
    return 2;
  };

  return (
    <View style={styles.container}>
      <ImageBackground source={require("../assets/trail_background.jpg")} style={styles.backgroundImage}>
        {loading ? (
          <ActivityIndicator size="large" color="#ffffff" />
        ) : (
          <View style={styles.card}>
            <Text style={styles.city}>{city || "Fetching location..."}</Text>
            {weatherData.map((forecast, index) => (
              <View key={index} style={styles.trailBox}>
                <Text style={styles.time}>{forecast.time}</Text>
                <Text style={styles.weather}>Weather: {forecast.weather}</Text>
                <Text style={styles.temp}>{forecast.temp}°C</Text>
                <Text style={styles.details}>Humidity: {forecast.humidity}%</Text>
                <Text style={styles.trailText}>Trail Condition: {forecast.condition}</Text>
              </View>
            ))}
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("MountainSelection")}>
              <Text style={styles.buttonText}>Go to Mountain Selection</Text>
            </TouchableOpacity>
          </View>
        )}
      </ImageBackground>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f2f2f2",
  },
  backgroundImage: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "white",
    width: "90%",
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
    alignItems: "center",
  },
  city: {
    fontSize: 25,
    fontWeight: "bold",
  },
  time: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  weather: {
    fontSize: 16,
    color: "gray",
  },
  temp: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#ff9f1c",
  },
  details: {
    fontSize: 16,
    color: "#444",
    fontWeight: "bold",
  },
  trailBox: {
    marginTop: 10,
    padding: 15,
    backgroundColor: "#eee",
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
  },
  trailText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#222",
  },
  trailMessage: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    fontStyle: "italic",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#28a745",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 25,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});