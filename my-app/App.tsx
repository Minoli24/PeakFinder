// 

// import React, { useState, useEffect } from 'react';
// import { View, Text, Button, StyleSheet, Alert } from 'react-native';
// import axios from 'axios';

// export default function App() {
//   const [latitude, setLatitude] = useState<number | null>(null);
//   const [longitude, setLongitude] = useState<number | null>(null);
//   const [weather, setWeather] = useState<string | null>(null); // Store actual weather condition
//   const [temperature, setTemperature] = useState<number | null>(null); // Store actual temperature
//   const [humidity, setHumidity] = useState<number | null>(null); // Store actual humidity
//   const [prediction, setPrediction] = useState<string | null>(null);

//   useEffect(() => {
//     getLocationPermission();
//   }, []);

//   const getLocationPermission = async () => {
//     try {
//       if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(
//           (position) => {
//             const { latitude, longitude } = position.coords;
//             setLatitude(latitude);
//             setLongitude(longitude);
//             fetchWeatherData(latitude, longitude);
//           },
//           (error) => {
//             if (error.code === 1) {
//               alert("Location permission denied. Please enable it in your browser settings.");
//             } else if (error.code === 2) {
//               alert("Location information is unavailable. Please check your device.");
//             } else if (error.code === 3) {
//               alert("Location request timed out. Please try again.");
//             } else {
//               alert("An unknown error occurred. Please try again.");
//             }
//             console.error("Error fetching location:", error);
//           }
//         );
//       } else {
//         alert("Geolocation is not supported by this browser.");
//       }
//     } catch (error) {
//       console.error("Error requesting location permission:", error);
//     }
//   };

//   const fetchWeatherData = async (lat: number, lon: number) => {
//     try {
//       const API_KEY = 'a304e8aa816e13c751f54d94f56d8a8a';
//       const response = await axios.get(
//         `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
//       );

//       const { weather, main } = response.data;

//       // Set actual weather data
//       setWeather(weather[0].main); // e.g., "Clear", "Rain"
//       setTemperature(main.temp); // Temperature in Celsius
//       setHumidity(main.humidity); // Humidity in percentage
//     } catch (error) {
//       console.error('Error fetching weather data:', error);
//     }
//   };

//   const handlePredict = async () => {
//     // Example encoding for the prediction model
//     const encodedWeather = weather === 'Clear' ? 2 : weather === 'Rain' ? 1 : 0;
//     const encodedTempRange = temperature !== null ? (temperature < 15 ? 0 : temperature <= 30 ? 1 : 2) : null;
//     const encodedHumidityRange = humidity !== null ? (humidity < 40 ? 0 : humidity <= 70 ? 1 : 2) : null;

//     if (encodedWeather === null || encodedTempRange === null || encodedHumidityRange === null) {
//       alert('Weather data not available. Please try again.');
//       return;
//     }

//     try {
//       const response = await axios.post('http://192.168.1.8:5000/predict/classifier', {
//         features: [encodedWeather, encodedTempRange, encodedHumidityRange],
//       });
//       setPrediction(response.data.prediction[0]);
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.result}>
//         {latitude && longitude
//           ? `Location: ${latitude.toFixed(2)}, ${longitude.toFixed(2)}`
//           : 'Fetching location...'}
//       </Text>

//       {temperature !== null && humidity !== null && weather !== null && (
//         <View>
//           <Text style={styles.result}>Weather: {weather}</Text>
//           <Text style={styles.result}>Temperature: {temperature} °C</Text>
//           <Text style={styles.result}>Humidity: {humidity}%</Text>
//         </View>
//       )}

//       <Button title="Get Prediction" onPress={handlePredict} />
//       {prediction && <Text style={styles.result}>Prediction: {prediction}</Text>}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#fff',
//   },
//   result: {
//     marginTop: 20,
//     fontSize: 18,
//     fontWeight: 'bold',
//   },
// });

///////////////////////////////////////////////////////////////////////////////////////////

// import React, { useState, useEffect } from "react";
// import { View, Text, Button, StyleSheet, Alert } from "react-native";
// import axios from "axios";

// export default function App() {
//   const [latitude, setLatitude] = useState<number | null>(null);
//   const [longitude, setLongitude] = useState<number | null>(null);
//   const [weather, setWeather] = useState<string | null>(null);
//   const [temperature, setTemperature] = useState<number | null>(null);
//   const [humidity, setHumidity] = useState<number | null>(null);
//   const [prediction, setPrediction] = useState<string | null>(null);
//   const [hourlyForecast, setHourlyForecast] = useState<any[]>([]);

//   useEffect(() => {
//     getLocationPermission();
//   }, []);

//   // Get Location
//   const getLocationPermission = async () => {
//     try {
//       if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(
//           (position) => {
//             const { latitude, longitude } = position.coords;
//             setLatitude(latitude);
//             setLongitude(longitude);
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

//   // Fetch Weather Data
//   const fetchWeatherData = async (lat: number, lon: number) => {
//     try {
//       const API_KEY = "a304e8aa816e13c751f54d94f56d8a8a"; // Replace with your OpenWeather API Key
//       const response = await axios.get(
//         `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
//       );

//       const { list } = response.data;

//       // Get current weather
//       const currentWeather = list[0];

//       // Get next hourly weather data (3-hour intervals)
//       const nextHourWeather = list[1];
//       const nextTwoHourWeather = list[2];

//       // Set current weather data
//       setWeather(currentWeather.weather[0].main);
//       setTemperature(currentWeather.main.temp);
//       setHumidity(currentWeather.main.humidity);

//       // Store hourly forecast
//       setHourlyForecast([
//         {
//           time: "Now",
//           temp: currentWeather.main.temp,
//           humidity: currentWeather.main.humidity,
//           weather: currentWeather.weather[0].main,
//         },
//         {
//           time: "In 3 Hours",
//           temp: nextHourWeather.main.temp,
//           humidity: nextHourWeather.main.humidity,
//           weather: nextHourWeather.weather[0].main,
//         },
//         {
//           time: "In 6 Hours",
//           temp: nextTwoHourWeather.main.temp,
//           humidity: nextTwoHourWeather.main.humidity,
//           weather: nextTwoHourWeather.weather[0].main,
//         },
//       ]);
//     } catch (error) {
//       console.error("Failed to fetch weather data:", error);
//       alert("Failed to fetch weather data. Check your API key and network connection.");
//     }
//   };

//   // Encode Weather
//   const encodeWeather = (weatherCondition: string) => {
//     if (weatherCondition === "Clear") return 2;
//     if (weatherCondition === "Rain") return 1;
//     return 0; // Default for Clouds or other conditions
//   };

//   // Send Data for Prediction
//   const handlePredict = async (forecast: any) => {
//     if (!forecast.weather || !forecast.temp || !forecast.humidity) {
//       alert("Weather data not available. Please try again.");
//       return;
//     }

//     // Encode weather condition
//     const encodedWeather = encodeWeather(forecast.weather);

//     try {
//       const response = await axios.post(
//         "http://192.168.1.8:5000/predict/classifier",
//         { features: [encodedWeather, forecast.temp, forecast.humidity] },
//         {
//           headers: {
//             "Content-Type": "application/json",
//             "Access-Control-Allow-Origin": "*",
//           },
//         }
//       );

//       setPrediction(`Prediction for ${forecast.time}: ${response.data.prediction[0]}`);
//     } catch (error) {
//       console.error("Prediction Error:", error);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.result}>
//         {latitude && longitude
//           ? `Location: ${latitude.toFixed(2)}, ${longitude.toFixed(2)}`
//           : "Fetching location..."}
//       </Text>

//       {temperature !== null && humidity !== null && weather !== null && (
//         <View>
//           <Text style={styles.result}>Weather: {weather}</Text>
//           <Text style={styles.result}>Temperature: {temperature} °C</Text>
//           <Text style={styles.result}>Humidity: {humidity}%</Text>
//         </View>
//       )}

//       {/* Hourly Forecast Predictions */}
//       <View>
//         {hourlyForecast.map((forecast, index) => (
//           <View key={index} style={styles.forecastContainer}>
//             <Text style={styles.result}>
//               {forecast.time}: {forecast.temp}°C, {forecast.humidity}% Humidity, {forecast.weather}
//             </Text>
//             <Button title={`Predict ${forecast.time}`} onPress={() => handlePredict(forecast)} />
//           </View>
//         ))}
//       </View>

//       {prediction && <Text style={styles.result}>{prediction}</Text>}
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#fff",
//   },
//   result: {
//     marginTop: 20,
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   forecastContainer: {
//     marginVertical: 10,
//   },
// });



///////////////////////////////////////////////////////////////////////////////////////////////////

// import React, { useState, useEffect } from "react";
// import { View, Text, StyleSheet, ImageBackground, ActivityIndicator } from "react-native";
// import axios from "axios";

// export default function App() {
//   const [city, setCity] = useState<string | null>(null);
//   const [weather, setWeather] = useState<string | null>(null);
//   const [temperature, setTemperature] = useState<number | null>(null);
//   const [humidity, setHumidity] = useState<number | null>(null);
//   const [trailConditions, setTrailConditions] = useState<{ time: string; condition: string }[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   const API_KEY = "a304e8aa816e13c751f54d94f56d8a8a"; // Replace with your OpenWeather API Key
//   const FLASK_API_URL = "http://192.168.1.8:5000/predict/classifier"; // Replace with Flask API URL

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

//       setWeather(forecasts[0].data.weather[0].main);
//       setTemperature(forecasts[0].data.main.temp);
//       setHumidity(forecasts[0].data.main.humidity);

//       // Predict Trail Conditions for all three times
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

//           return { time: forecast.time, condition: response.data.prediction[0] };
//         })
//       );

//       setTrailConditions(predictions);
//       setLoading(false);
//     } catch (error) {
//       console.error("Prediction Error:", error);
//       setTrailConditions([
//         { time: "Now", condition: "Error fetching prediction" },
//         { time: "In 3 Hours", condition: "Error fetching prediction" },
//         { time: "In 6 Hours", condition: "Error fetching prediction" },
//       ]);
//       setLoading(false);
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <ImageBackground source={require("./assets/trail_background.jpg")} style={styles.backgroundImage}>
//         {loading ? (
//           <ActivityIndicator size="large" color="#ffffff" />
//         ) : (
//           <View style={styles.card}>
//             <Text style={styles.header}>Weather Conditions</Text>
//             <View style={styles.weatherRow}>
//               <Text style={styles.temp}>{temperature}°</Text>
//               <View style={styles.weatherInfo}>
//                 <Text style={styles.city}>{city || "Fetching location..."}</Text>
//                 <Text style={styles.weather}>{weather}</Text>
//               </View>
//             </View>
//             <Text style={styles.details}>Humidity: {humidity}%</Text>

//             {/* Render all trail conditions */}
//             {trailConditions.map((forecast, index) => (
//               <View key={index} style={styles.trailCondition}>
//                 <Text style={styles.time}>{forecast.time}</Text>
//                 <Text style={styles.trailText}>{forecast.condition}</Text>
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
//   header: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   weatherRow: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     width: "100%",
//     marginBottom: 10,
//   },
//   temp: {
//     fontSize: 50,
//     fontWeight: "bold",
//     color: "#ff9f1c",
//   },
//   weatherInfo: {
//     alignItems: "flex-end",
//   },
//   city: {
//     fontSize: 20,
//     fontWeight: "bold",
//   },
//   weather: {
//     fontSize: 16,
//     color: "gray",
//   },
//   details: {
//     fontSize: 16,
//     marginTop: 5,
//     color: "#444",
//   },
//   trailCondition: {
//     marginTop: 10,
//     alignItems: "center",
//   },
//   time: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   trailText: {
//     fontSize: 14,
//     color: "#666",
//     fontStyle: "italic",
//     textAlign: "center",
//   },
// });

////////////////////////////////////////////////////////////////////////////////////////////////////////

// /
// import React, { useState, useEffect } from "react";
// import { View, Text, StyleSheet, ImageBackground, ActivityIndicator } from "react-native";
// import axios from "axios";

// export default function App() {
//   const [city, setCity] = useState<string | null>(null);
//   const [weather, setWeather] = useState<string | null>(null);
//   const [temperature, setTemperature] = useState<number | null>(null);
//   const [humidity, setHumidity] = useState<number | null>(null);
//   const [trailConditions, setTrailConditions] = useState<{ time: string; condition: string }[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   const API_KEY = "a304e8aa816e13c751f54d94f56d8a8a"; // Replace with your OpenWeather API Key
//   const FLASK_API_URL = "http://192.168.1.32:5000/predict/classifier"; // Replace with Flask API URL

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

//       setWeather(forecasts[0].data.weather[0].main);
//       setTemperature(forecasts[0].data.main.temp);
//       setHumidity(forecasts[0].data.main.humidity);

//       // Predict Trail Conditions for all three times
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

//           return { time: forecast.time, condition: response.data.prediction[0] };
//         })
//       );

//       setTrailConditions(predictions);
//       setLoading(false);
//     } catch (error) {
//       console.error("Prediction Error:", error);
//       setTrailConditions([
//         { time: "Now", condition: "Error fetching prediction" },
//         { time: "In 3 Hours", condition: "Error fetching prediction" },
//         { time: "In 6 Hours", condition: "Error fetching prediction" },
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
//             <Text style={styles.weather}>{weather}</Text>
//             <Text style={styles.temp}>{temperature}°C</Text>
//             <Text style={styles.details}>Humidity: {humidity}%</Text>

//             {/* Render all trail conditions */}
//             {trailConditions.map((forecast, index) => (
//               <View key={index} style={styles.trailBox}>
//                 <Text style={styles.time}>{forecast.time}</Text>
//                 <Text style={styles.trailText}>{forecast.condition}</Text>
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
//   header: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 10,
//   },
//   city: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   weather: {
//     fontSize: 16,
//     color: "gray",
//   },
//   temp: {
//     fontSize: 50,
//     fontWeight: "bold",
//     color: "#ff9f1c",
//   },
//   details: {
//     fontSize: 16,
//     color: "#444",
//   },
//   trailBox: {
//     marginTop: 10,
//     padding: 10,
//     backgroundColor: "#eee",
//     borderRadius: 10,
//     alignItems: "center",
//   },
//   time: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   trailText: {
//     fontSize: 14,
//     fontWeight: "bold",
//   },
//   trailMessage: {
//     fontSize: 14,
//     color: "#666",
//     textAlign: "center",
//   },
// });

// import React, { useState, useEffect } from "react";
// import { View, Text, StyleSheet, ImageBackground, ActivityIndicator } from "react-native";
// import axios from "axios";

// export default function App() {
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
//////////////////////////////////////////////////////////////////////////

// 

// import React from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import { createStackNavigator, StackScreenProps } from "@react-navigation/stack";
// import HomeScreen from "./screens/HomeScreen";
// import MountainSelectionScreen from "./screens/MountainSelectionScreen";
// import PredictionResultScreen from "./screens/PredictionResultScreen";

// // Define types for navigation
// export type RootStackParamList = {
//   Home: undefined;
//   MountainSelection: undefined;
//   PredictionResult: {
//     mountain: {
//       name: string;
//       elevation: number;
//       difficulty: number;
//       weatherEncoded: number;
//     };
//     restStops: number;
//     travelMode: string;
//   };
// };

// const Stack = createStackNavigator<RootStackParamList>();
// export default function AppNavigator() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="Home">
//         <Stack.Screen name="Home" component={HomeScreen} />
//         <Stack.Screen name="MountainSelection" component={MountainSelectionScreen} />
//         <Stack.Screen 
//           name="PredictionResult" 
//           component={PredictionResultScreen as React.ComponentType<any>} // ✅ Explicitly cast component
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";
import MountainSelectionScreen from "./screens/MountainSelectionScreen";
import PredictionResultScreen from "./screens/PredictionResultScreen";

// Define types for navigation
// export type RootStackParamList = {
//   Home: undefined;
//   MountainSelection: undefined;
//   PredictionResult: {
//     mountain: {
//       name: string;
//       elevation: number;
//       difficulty: number;
//       weatherEncoded: number;
//     };
//     restStops: number;
//     travelMode: string;
//   };
// };

export type RootStackParamList = {
  Home: undefined;
  MountainSelection: undefined;
  PredictionResult: {
    mountain: {
      name: string;
      elevation: number;
      difficulty: number;
      weatherEncoded: number | null;
      temperature: number | null;
      humidity: number | null;
      trailConditions: any[];
    };
    restStops: number;
    travelMode: string;
  };
};


const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="MountainSelection" component={MountainSelectionScreen} />
        <Stack.Screen 
          name="PredictionResult" 
          component={PredictionResultScreen as React.ComponentType<any>} // ✅ Explicitly cast component
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}