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
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons"; // Import icons
import { RootStackParamList } from "../App"; // Import navigation types
import * as Location from 'expo-location';
import { ScrollView } from "react-native";

// Define TypeScript type for navigation props
type HomeScreenProps = StackScreenProps<RootStackParamList, "Home">;


export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenProps["navigation"]>();

  const [city, setCity] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [originalWeatherDescription, setOriginalWeatherDescription] = useState<string | null>(null);


  //const API_KEY = "5b1d50dc4c9d25a46417835c506a0644"; // OpenWeather API Key
  const API_KEY = "2028b5735eb1f94e8433857df6411728";
  //const FLASK_API_URL = "http://192.168.1.18:5000/predict/classifier"; // Flask API
  const FLASK_API_URL = "https://sehara.el.r.appspot.com/predict/classifier";

  useEffect(() => {
    
    getLocationPermission();
  }, []);

  

  const getLocationPermission = async () => {
    try {
      // Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        alert("Permission Denied: Enable location services in settings.");
        return;
      }
  
      // Get current location
      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;
      
      console.log("📍 Location:", latitude, longitude);
      
      fetchCityName(latitude, longitude);
      fetchWeatherData(latitude, longitude);
    } catch (error) {
      console.error("Location Permission Error:", error);
      alert("Error fetching location.");
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
    "LightRain": 2,
    Unknown: 0,
  };

 const normalizeWeather = (weatherDesc: string): string => {
    const lowerCaseWeather = weatherDesc.toLowerCase();
  
    if (lowerCaseWeather.includes("clear") || lowerCaseWeather.includes("sun")) {
      return "Clear";
    }
    if (lowerCaseWeather.includes("light rain")) {
      return "LightRain";  // NEW: Differentiating rain intensity
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

          const trailCondition = response.data.prediction[0];

        // Define safety messages based on trail condition
        let safetyMessage = "";
        switch (trailCondition) {
          case "Dry":
            safetyMessage = "The trail is dry and safe for hiking. Carry enough water and sunscreen.";
            break;
          case "Wet":
            safetyMessage = "The trail is wet and might be slippery. Wear shoes with good grip.";
            break;
          case "Muddy":
            safetyMessage = "The trail is muddy and can be challenging. Avoid steep slopes and use trekking poles.";
            break;
          // case "Snowy":
          //   safetyMessage = "The trail is covered in snow. Use winter gear and be cautious of icy patches.";
          //   break;
          // case "Stormy":
          //   safetyMessage = "Stormy conditions detected. It's advised to avoid hiking until weather improves.";
          //   break;
          default:
            safetyMessage = "Trail conditions unknown. Check with local authorities before proceeding.";
        }


          return {
            time: forecast.time,
            weather: weatherMain,
            temp: main.temp,
            humidity: main.humidity,
            condition: response.data.prediction[0],
            safetyMessage: safetyMessage,
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
    // <View style={styles.container}>
     
    //   <ImageBackground source={require("../assets/trail_background.jpg")} style={styles.backgroundImage}>
    //     {loading ? (
    //       <ActivityIndicator size="large" color="#ffffff" />
    //     ) : (
    //       <View style={styles.card}>
    //         <Text style={styles.city}><Ionicons name="location-sharp" size={22} color="#ff9f1c" /> {city || "Fetching location..."}
    //        </Text>
    //         {weatherData.map((forecast, index) => (
    //           <View key={index} style={styles.trailBox}>
    //             <Text style={styles.time}>{forecast.time}</Text>
    //             <Text style={styles.weather}><Ionicons name="cloud-outline" size={20} color="#666" /> {forecast.weather}</Text>
    //             <Text style={styles.temp}>{forecast.temp}°C</Text>
    //             <Text style={styles.details}> <Ionicons name="water-outline" size={18} color="#666" /> {forecast.humidity}%</Text>
    //             <Text style={styles.trailText}>Trail Condition: {forecast.condition}</Text>
    //             <Text style={styles.safetyMessage}>{forecast.safetyMessage}</Text>
    //           </View>
    //         ))}
    //         <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("MountainSelection")}>
    //           <Text style={styles.buttonText}>Go to Mountain Selection</Text>
    //         </TouchableOpacity>
    //       </View>
    //     )}
    //   </ImageBackground>
    // </View>
    


  <ScrollView contentContainerStyle={styles.scrollContainer}>
    <ImageBackground source={require("../assets/trail_background.jpg")} style={styles.backgroundImage}>
      <View style={styles.overlay} />
      <View style={styles.card}>
        <Text style={styles.city}><Ionicons name="location-sharp" size={22} color="#ff9f1c" /> {city || "Fetching location..."}</Text>
        {weatherData.map((forecast, index) => (
          <View key={index} style={styles.trailBox}>
            <Text style={styles.time}>{forecast.time}</Text>
            <Text style={styles.weather}><Ionicons name="cloud-outline" size={20} color="#666" /> {forecast.weather}</Text>
            <Text style={styles.temp}>{forecast.temp}°C</Text>
            <Text style={styles.details}> <Ionicons name="water-outline" size={18} color="#666" /> {forecast.humidity}%</Text>
            <Text style={styles.trailText}>Trail Condition: {forecast.condition}</Text>
            <Text style={styles.safetyMessage}>{forecast.safetyMessage}</Text>
          </View>
        ))}
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("MountainSelection")}>
          <Text style={styles.buttonText}>Go to Mountain Selection</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  </ScrollView>
);

    
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,  // ✅ Fixes height issue
    backgroundColor: "#f2f2f2",
    alignItems: "center", 
  },
  scrollContainer: {
    flexGrow: 1, // ✅ Allows scrolling if content overflows
    justifyContent: "center",
    alignItems: "center",
   // paddingVertical: 20, 
  },
  backgroundImage: {
    flex: 1,
    width: "100%",
    resizeMode: "cover",
  },

  card: {
    //backgroundColor: "rgba(255, 255, 255, 0.9)", // ✅ Transparent white for a clean look
    width: "90%",
    borderRadius: 20,
    padding: 20,
    marginBottom: 20, // ✅ Prevent overlap
   // shadowColor: "#000",
    //shadowOffset: { width: 0, height: 4 },
   // shadowOpacity: 0.2,
   // shadowRadius: 5,
    //elevation: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  city: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#222",
  },
  time: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
  },
  weather: {
    fontSize: 14,
    color: "gray",
  },
  temp: {
    fontSize: 28, // ✅ Adjusted for better alignment
    fontWeight: "bold",
    color: "#ff9f1c",
  },

  details: {
    fontSize: 16,
    color: "#444",
    fontWeight: "bold",
  },
  trailBox: {
    marginTop: 15,
    padding: 12,
    backgroundColor: "#fff", // ✅ More contrast for readability
    borderRadius: 12,
    alignItems: "center",
    width: "90%",
    alignSelf: "center",
    elevation: 2, // Soft shadow effect
  },
  trailText: {
    fontSize: 20,  // ✅ Increase size for readability
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

  safetyMessage: {
    fontSize: 14,
    color: "#d9534f", // ✅ Red for warnings
    fontWeight: "bold",
    marginTop: 5,
    textAlign: "center",
  },
  
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)", // ✅ Dim the background for better readability
  },

});



