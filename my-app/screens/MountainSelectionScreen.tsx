
// import {
//   View,
//   Text,
//   StyleSheet,
//   TouchableOpacity,
//   Alert,
//   ActivityIndicator,
// } from "react-native";
// import { Picker } from "@react-native-picker/picker";
// import { useNavigation, NavigationProp } from "@react-navigation/native";
// import axios from "axios";
// import { RootStackParamList } from "../App"; // Adjust if necessary
// import { useEffect, useState } from "react";

// // Define available mountains
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
//   Clear: 3,
//   Rain: 2,
//   "Moderate Rain": 0,
//   Cloudy: 0,
//   Windy: 1,
// };

// // Temperature encoding
// const encodeTemperature = (temp: number): number => {
//   if (temp >= 1 && temp < 10) return 1;
//   if (temp >= 10 && temp < 20) return 2;
//   if (temp >= 20 && temp < 30) return 3;
//   return 0; // Default case
// };

// // Humidity encoding
// const encodeHumidity = (humidity: number): number => {
//   if (humidity >= 75) return 0;
//   if (humidity >= 50) return 1;
//   return 2;
// };

// const MountainSelectionScreen = () => {
//   const navigation = useNavigation<NavigationProp<RootStackParamList, "MountainSelection">>();
//   const [selectedMountain, setSelectedMountain] = useState(mountains[0]);
//   const [restStops, setRestStops] = useState<string>("0");
//   const [selectedTravelMode, setSelectedTravelMode] = useState("Walking");

//   const [elevation, setElevation] = useState(mountains[0].elevation);
//   const [difficulty, setDifficulty] = useState(mountains[0].difficulty);
//   const [difficultyEncoded, setDifficultyEncoded] = useState(mountains[0].difficultyEncoded);
//   const [weatherEncoded, setWeatherEncoded] = useState<number | null>(null);
//   const [weatherCondition, setWeatherCondition] = useState<string | null>(null);
//   const [temperature, setTemperature] = useState<number | null>(null);
//   const [humidity, setHumidity] = useState<number | null>(null);
//   const [trailConditions, setTrailConditions] = useState<any[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);

//   // API keys & URLs
//   const WEATHER_API_KEY = "5b1d50dc4c9d25a46417835c506a0644"; // OpenWeather API Key
//   const FLASK_API_URL = "http://192.168.1.6:5000/predict/classifier"; // Flask API for Trail Condition

//   // Fetch weather encoding from OpenWeather API
//   const fetchWeatherEncoding = async () => {
//     try {
//       const { latitude, longitude } = selectedMountain;
//       const response = await axios.get(
//         `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${WEATHER_API_KEY}`
//       );
  
//       const forecasts = [
//         { time: "Now", data: response.data.list[0] },
//         { time: "In 3 Hours", data: response.data.list[1] },
//         { time: "In 6 Hours", data: response.data.list[2] },
//       ];
  
//       // Debug log to check what weather API is returning
//       console.log("🌤️ Raw API Response:", response.data);
  
//       const weatherMain = forecasts[0].data.weather[0].main;
//       console.log("✅ Extracted Weather Condition:", weatherMain);
  
//       setTemperature(forecasts[0].data.main.temp);
//       setHumidity(forecasts[0].data.main.humidity);
//       setWeatherCondition(weatherMain); // Ensure this updates the UI
  
//       // Fix: Normalize weather condition
//       const normalizedWeather = normalizeWeather(weatherMain);
//       console.log("📌 Normalized Weather Condition:", normalizedWeather);
  
//       const encodedWeather = weatherEncoding[normalizedWeather] ?? 0;
//       setWeatherEncoded(encodedWeather);
  
//       predictTrailConditions(forecasts);
//     } catch (error) {
//       console.error("❌ Weather API Error:", error);
//       Alert.alert("Error", "Failed to fetch weather data.");
//     }
//   };

//   const normalizeWeather = (weatherDesc: string): string => {
//     const lowerCaseWeather = weatherDesc.toLowerCase();
  
//     if (lowerCaseWeather.includes("clear") || lowerCaseWeather.includes("sun")) {
//       return "Clear";
//     }
//     if (lowerCaseWeather.includes("rain")) {
//       return "Rain";
//     }
//     if (lowerCaseWeather.includes("cloud")) {
//       return "Cloudy";
//     }
//     if (lowerCaseWeather.includes("wind")) {
//       return "Windy";
//     }
//     return "Unknown"; // Default case
//   };
  
  
//   // Predict Trail Conditions
//   const predictTrailConditions = async (forecasts: any[]) => {
//     try {
//         const predictions = await Promise.all(
//             forecasts.map(async (forecast) => {
//                 const { weather, main } = forecast.data;

//                 // Extract and log the original weather description
//                 const weatherDescription = weather && weather[0] ? weather[0].main : "Unknown";
//                 console.log("🌤️ Original Weather Description from API:", weatherDescription);

//                 // Normalize weather condition
//                 const weatherMain = normalizeWeather(weatherDescription);
//                 console.log("🌤️ Normalized Weather:", weatherMain);

//                 // Encode weather condition
//                 const encodedWeather = weatherEncoding[weatherMain] ?? 0;
//                 const encodedTemp = encodeTemperature(main.temp);
//                 const encodedHumidity = encodeHumidity(main.humidity);

//                 console.log("🚀 Sending to ML Model:", {
//                     OriginalWeather: weatherDescription,
//                     NormalizedWeather: weatherMain,
//                     EncodedWeather: encodedWeather,
//                     Temperature: main.temp,
//                     EncodedTemperature: encodedTemp,
//                     Humidity: main.humidity,
//                     EncodedHumidity: encodedHumidity,
//                 });

//                 const response = await axios.post(
//                     FLASK_API_URL,
//                     { features: [encodedWeather, encodedTemp, encodedHumidity] },
//                     { headers: { "Content-Type": "application/json" } }
//                 );

//                 console.log("✅ ML Model Response:", response.data);

//                 return {
//                     time: forecast.time,
//                     condition: response.data.prediction[0],
//                 };
//             })
//         );

//         setTrailConditions(predictions);
//     } catch (error) {
//         console.error("❌ Trail Condition Prediction Error:", error);
//     }
// };


//   const handlePredict = () => {
//     if (
//       elevation === null || 
//       difficultyEncoded === null || 
//       weatherEncoded === null || 
//       temperature === null || 
//       humidity === null
//     ) {
//       Alert.alert("Please wait for all data to load.");
//       return;
//     }
  
//     navigation.navigate("PredictionResult", {
//       mountain: {
//         name: selectedMountain.name,
//         elevation,
//         difficulty: difficultyEncoded,
//         weatherEncoded,
//         temperature,
//         humidity,
//         trailConditions,
//       },
//       restStops: Number(restStops),
//       travelMode: selectedTravelMode,
//     });
//   };
  

//   useEffect(() => {
//     setLoading(true);
//     fetchWeatherEncoding();
//   }, [selectedMountain]);

//   return (
//     <View style={styles.container}>
//       <Text style={styles.header}>Select a Mountain</Text>
//        {/* Mountain Selection Dropdown */}
//        <Picker
//         selectedValue={selectedMountain.name}
//         onValueChange={(itemValue) => {
//           const mountain = mountains.find((m) => m.name === itemValue);
//           if (mountain) {
//             setSelectedMountain(mountain);
//             setDifficulty(mountain.difficulty);
//             setDifficultyEncoded(mountain.difficultyEncoded);
//             setElevation(mountain.elevation);
//           }
//         }}
//         style={styles.picker}
//       >
//         {mountains.map((mountain, index) => (
//           <Picker.Item key={index} label={mountain.name} value={mountain.name} />
//         ))}
//       </Picker>

//       <Text style={styles.label}>Elevation: {elevation}m</Text>
//       <Text style={styles.label}>Difficulty: {difficulty} (Encoded: {difficultyEncoded})</Text>
//       <Text style={styles.label}>Weather: {weatherCondition} (Encoded: {weatherEncoded})</Text>
//       <Text style={styles.label}>Temperature: {temperature} °C</Text>
//       <Text style={styles.label}>Humidity: {humidity}%</Text>

//       {trailConditions.map((forecast, index) => (
//         <Text key={index} style={styles.label}>
//           Trail Condition {forecast.time}: {forecast.condition}
//         </Text>
//       ))}

// <TouchableOpacity style={styles.button} onPress={handlePredict}>
//   <Text style={styles.buttonText}>Show Distance and Time</Text>
// </TouchableOpacity>

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

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  Modal,
  TextInput,
  FlatList,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import axios from "axios";
import { useEffect, useState } from "react";
import { RootStackParamList } from "../App";
 // Adjust if necessary

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
  return 0;
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
  const [weeklyForecast, setWeeklyForecast] = useState<any[]>([]);
 const [selectedDay, setSelectedDay] = useState(0); // 0 = Today
////////////////////////////////////////////////////////////////////////
const [searchText, setSearchText] = useState("");
const [filteredMountains, setFilteredMountains] = useState(mountains);
const [isModalVisible, setModalVisible] = useState(false);
////////////////////////////////////////////////////////////////////

  // API keys & URLs
  const WEATHER_API_KEY = "5b1d50dc4c9d25a46417835c506a0644";
  const FLASK_API_URL = "http://192.168.1.6:5000/predict/classifier";

    // Function to handle search
    const handleSearch = (text: string) => {
      setSearchText(text);
      const filtered = mountains.filter((mountain) =>
        mountain.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredMountains(filtered);
    };

  const fetchWeatherEncoding = async () => {
    try {
      const { latitude, longitude } = selectedMountain;
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${WEATHER_API_KEY}`
      );

      const forecasts = response.data.list.slice(0, 3).map((entry: any, index: number) => ({
        time: index === 0 ? "Now" : index === 1 ? "In 3 Hours" : "In 6 Hours",
        weather: entry.weather[0].main,
        temp: entry.main.temp,
        humidity: entry.main.humidity,
      }));

      console.log("✅ Extracted Weather Data:", forecasts);

      setTemperature(forecasts[0].temp);
      setHumidity(forecasts[0].humidity);
      setWeatherCondition(forecasts[0].weather);

      const normalizedWeather = normalizeWeather(forecasts[0].weather);
      const encodedWeather = weatherEncoding[normalizedWeather] ?? 0;
      setWeatherEncoded(encodedWeather);

      if (encodedWeather !== null) {
        predictTrailConditions(forecasts, encodedWeather);
      }

      // 🔹 Extract 7-day forecast (every 24h entry from OpenWeather)
    const dailyForecasts = response.data.list.filter((_: any, index: number) => index % 8 === 0).slice(0, 7);
    setWeeklyForecast(dailyForecasts.map((entry: any) => ({
      day: new Date(entry.dt_txt).toLocaleDateString("en-US", { weekday: "short" }),
      temp: entry.main.temp,
      humidity: entry.main.humidity,
      weather: entry.weather[0].main
    })));
    } catch (error) {
      console.error("❌ Weather API Error:", error);
      Alert.alert("Error", "Failed to fetch weather data.");
    }
  };

  const normalizeWeather = (weatherDesc: string): string => {
    const lowerCaseWeather = weatherDesc.toLowerCase();
    if (lowerCaseWeather.includes("clear") || lowerCaseWeather.includes("sun")) return "Clear";
    if (lowerCaseWeather.includes("rain")) return "Rain";
    if (lowerCaseWeather.includes("cloud")) return "Cloudy";
    if (lowerCaseWeather.includes("wind")) return "Windy";
    return "Unknown";
  };

  const predictTrailConditions = async (forecasts: any[], encodedWeather: number) => {
    try {
      const predictions = await Promise.all(
        forecasts.map(async (forecast) => {
          const payload = {
            features: [encodedWeather, encodeTemperature(forecast.temp), encodeHumidity(forecast.humidity)],
          };

          console.log("🚀 Sending Payload to API:", payload);

          const response = await axios.post(
            FLASK_API_URL,
            payload,
            { headers: { "Content-Type": "application/json" } }
          );

          return { time: forecast.time, condition: response.data.prediction[0] };
        })
      );

      setTrailConditions(predictions);
    } catch (error) {
      console.error("❌ Trail Condition Prediction Error:", error);
    }
  };

  useEffect(() => {
    fetchWeatherEncoding();
  }, [selectedMountain]);

//   
return (
  <View style={styles.container}>
    <Text style={styles.header}>Select a Mountain</Text>

    {/* Searchable Text Input */}
    <TouchableOpacity
      style={styles.searchInputContainer}
      onPress={() => setModalVisible(true)}
    >
      <Text style={styles.searchInputText}>{selectedMountain.name}</Text>
    </TouchableOpacity>

    {/* Modal for Searchable List */}
    <Modal visible={isModalVisible} animationType="slide" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Mountain..."
            value={searchText}
            onChangeText={handleSearch}
          />

          {/* List of Mountains */}
          <FlatList
            data={filteredMountains}
            keyExtractor={(item) => item.name}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => {
                  setSelectedMountain(item);
                  setModalVisible(false);
                }}
              >
                <Text style={styles.listItemText}>{item.name}</Text>
              </TouchableOpacity>
            )}
          />

          {/* Close Button */}
          <TouchableOpacity onPress={() => setModalVisible(false)}>
            <Text style={styles.closeButton}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>

   {/* Mountain Details */}
   <Text style={styles.label}>Elevation: {selectedMountain.elevation}m</Text>
    <Text style={styles.label}>Difficulty: {selectedMountain.difficulty} (Encoded: {difficultyEncoded})</Text>
    <Text style={styles.label}>Weather: {weatherCondition} (Encoded: {weatherEncoded})</Text>
    <Text style={styles.label}>Temperature: {temperature} °C</Text>
    <Text style={styles.label}>Humidity: {humidity}%</Text>

    {trailConditions.map((forecast, index) => (
      <Text key={index} style={styles.label}>
        Trail Condition {forecast.time}: {forecast.condition}
      </Text>
    ))}

    {/* Navigation Button */}
    <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("PredictionResult", {
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
    })}>
      <Text style={styles.buttonText}>Show Distance and Time</Text>
    </TouchableOpacity>

    {/* Weekly Forecast */}
    <Text style={styles.subHeader}>Weekly Forecast</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateSelector}>
      {weeklyForecast.map((dayData, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.dateButton, selectedDay === index ? styles.selectedDateButton : {}]}
          onPress={() => setSelectedDay(index)}
        >
          <Text style={styles.dateText}>{dayData.day}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>

    {weeklyForecast.length > 0 && (
      <View>
        <Text style={styles.label}>Weather: {weeklyForecast[selectedDay].weather}</Text>
        <Text style={styles.label}>Temperature: {weeklyForecast[selectedDay].temp} °C</Text>
        <Text style={styles.label}>Humidity: {weeklyForecast[selectedDay].humidity}%</Text>
      </View>
    )}
  </View>
);
};


// Styles
const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   backgroundColor: "#f2f2f2",
  // },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    paddingTop: 50,
  },
  header: { 
    fontSize: 20, 
    fontWeight: "bold", 
    marginBottom: 10 
  },
  pickerContainer: {
    width: "90%", 
    backgroundColor: "#ffffff", // Ensures white clean background
    borderRadius: 8, 
    paddingHorizontal: 5, 
    marginBottom: 15, 
    borderWidth: 1, 
    borderColor: "#ccc",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2, // For Android shadow
  },
  picker: {
    height: 50, 
    width: "100%", 
    backgroundColor: "transparent", // Fixes extra gray background
    color: "#333", // Ensures text is visible
  },

  label: { 
    fontSize: 16, 
    marginTop: 10 
  },
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
  subHeader: { fontSize: 18, fontWeight: "bold", marginTop: 20 },
  dateSelector: { marginTop: 10, flexDirection: "row" },
  selectedDateButton: {
    backgroundColor: "#34A853",
  },
  dateButton: {
    padding: 10,
    margin: 5,
    borderRadius: 5,
    backgroundColor: "#ccc",
  },
  dateText: {
    fontSize: 16,
    color: "#fff",
  },

  // Search Input Button (Replaces Dropdown)
  searchInputContainer: {
    width: "90%",
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    marginBottom: 15,
  },

  searchInputText: {
    fontSize: 16,
    color: "#333",
  },

  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)", // Semi-transparent background
  },

  modalContent: {
    backgroundColor: "#fff",
    width: "80%",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },

  searchInput: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
  },

  listItem: {
    padding: 15,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },

  listItemText: {
    fontSize: 16,
  },

  closeButton: {
    marginTop: 10,
    color: "#007BFF",
    fontSize: 18,
    fontWeight: "bold",
  },
 
});

export default MountainSelectionScreen;
