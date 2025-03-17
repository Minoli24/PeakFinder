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
  ImageBackground,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { useNavigation, NavigationProp } from "@react-navigation/native";
import axios from "axios";
import { useEffect, useState } from "react";
import { RootStackParamList } from "../App";
import { Ionicons, Feather, MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons"; 
import { LinearGradient } from 'expo-linear-gradient'; // For gradient background

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
  //const [elevation, setElevation] = useState(mountains[0].elevation);
  const elevation = selectedMountain.elevation;

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
const [isDayModalVisible, setDayModalVisible] = useState(false);
const [selectedForecastDetails, setSelectedForecastDetails] = useState<{ day: string; temp: number; humidity: number; weather: string; trailPrediction: string } | null>(null);

const mountainImages: { [key: string]: any } = {
  "Adam's Peak": require("../assets/images/adamspeak.jpg"),
  "Ella Rock": require("../assets/images/ella_rock.jpg"),
  "Bible Rock": require("../assets/images/Bible_Rock.jpg"),
  "Hanthana": require("../assets/images/hanthana.jpg"),
  "Lakegala": require("../assets/images/lakegala.jpg"),
  "Narangala Mountain": require("../assets/images/narangala.jpg"),
  "Sigiriya": require("../assets/images/sigiriya.jpg"),
  "Yahangala": require("../assets/images/yahangala.jpg"),
 // "Sigiriya": require("../assets/sigiriya.jpg"),
};


////////////////////////////////////////////////////////////////////

  // API keys & URLs
  const WEATHER_API_KEY = "5b1d50dc4c9d25a46417835c506a0644";
  const FLASK_API_URL = "https://sehara.el.r.appspot.com/predict/classifier";

    // Function to handle search
    const handleSearch = (text: string) => {
      setSearchText(text);
      const filtered = mountains.filter((mountain) =>
        mountain.name.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredMountains(filtered);
    };

    const fetchWeatherEncoding = async (mountain = selectedMountain) => {
        
    try {
      const { latitude, longitude } = mountain;
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&appid=${WEATHER_API_KEY}`
      );

      //console.log("🌍 API Weather for", selectedMountain.name, ":", response.data.weather[0].main);



      const forecasts = response.data.list.slice(0, 3).map((entry: any, index: number) => ({
        time: index === 0 ? "Now" : index === 1 ? "In 3 Hours" : "In 6 Hours",
        weather: entry.weather[0].main,
        temp: entry.main.temp,
        humidity: entry.main.humidity,
      }));

      console.log("✅ Extracted Weather Data:", forecasts);

      setTemperature(forecasts[0].temp);
      setHumidity(forecasts[0].humidity);
      //setWeatherCondition(forecasts[0].weather);
      

      const normalizedWeather = normalizeWeather(forecasts[0].weather);
      const encodedWeather = weatherEncoding[normalizedWeather] ?? 0;
      console.log("🚀 Weather Encoded Value:", encodedWeather);
      setWeatherEncoded(encodedWeather);
//setWeatherCondition(normalizedWeather);
      //console.log("✅ FINAL Weather Condition in UI:", normalizedWeather);

     
      setWeatherCondition(() => {
        console.log("✅ Setting Final Weather Condition:", normalizedWeather);
        return normalizedWeather;
    });
    
    console.log("🔎 Before Updating Weather Condition: Extracted from API:", forecasts[0].weather);
console.log("🌍 Normalized Weather (Final Value to Set):", normalizedWeather);




      if (encodedWeather !== null) {
        predictTrailConditions(forecasts, encodedWeather);
      }

      // 🔹 Extract 7-day forecast (every 24h entry from OpenWeather)
      const dailyForecasts = response.data.list.filter((_: any, index: number) => index % 8 === 0).slice(0, 7);

      // Process forecasts and predict trail conditions
      const updatedForecasts = await Promise.all(
        dailyForecasts.map(async (entry: any) => {
          const normalizedWeather = normalizeWeather(entry.weather[0].main);
          const encodedWeather = weatherEncoding[normalizedWeather] ?? 0;
          const tempEncoded = encodeTemperature(entry.main.temp);
          const humidityEncoded = encodeHumidity(entry.main.humidity);
  
          // Send data to Flask API for trail prediction
          const response = await axios.post(
            FLASK_API_URL,
            { features: [encodedWeather, tempEncoded, humidityEncoded] },
            { headers: { "Content-Type": "application/json" } }
          );
  
          return {
            day: new Date(entry.dt_txt).toLocaleDateString("en-US", { weekday: "short" }),
            temp: entry.main.temp,
            humidity: entry.main.humidity,
            weather: entry.weather[0].main,
            trailPrediction: response.data.prediction[0], // Store predicted trail condition
          };
        })
      );
  
      setWeeklyForecast(updatedForecasts);
    } catch (error) {
      console.error("❌ Weather API Error:", error);
      Alert.alert("Error", "Failed to fetch weather data.");
    }
  };

  const normalizeWeather = (weatherDesc: string): string => {
    const lowerCaseWeather = weatherDesc.toLowerCase();
    console.log("🔍 Raw Weather from API:", weatherDesc); // Add Debugging Log
    
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
  const weatherMapping: { [key: number]: string } = {
    0: "Cloudy",
    1: "Windy",
    2: "Rainy",
    3: "Clear",
  };
  
  const weatherIcons: { [key: number]: any } = {
    0: "cloud-outline",   // Cloudy ☁️
    1: "wind",            // Windy 🌬
    2: "rainy-outline",   // Rainy 🌧
    3: "sunny-outline",   // Sunny ☀️
  };
  
  const trailIcons: { [key: string]: any } = {
    "Muddy": "weather-rainy",   // Muddy 🌧 (Slippery)
    "Wet": "waves",             // Wet 💦 (Water on the trail)
    "Dry": "weather-sunny",      // Dry ☀️ (Clear trail)
  };
  

  useEffect(() => {
    fetchWeatherEncoding();
  }, [selectedMountain]);

  useEffect(() => {
    console.log("✅ UI Updated Weather Condition:", weatherCondition);
}, [weatherCondition]);




//   
return (
  <ScrollView contentContainerStyle={styles.scrollView}>
  <View style={styles.container}>
    <Text style={styles.header}>Select a Mountain</Text>

   
    {/* Searchable Text Input */}
    <TouchableOpacity
      style={styles.searchInputContainer}
      onPress={() => setModalVisible(true)}
    >
      <Text style={styles.searchInputText}>{selectedMountain.name}</Text>
      <Ionicons name="chevron-down" size={22} color="#000" />
    </TouchableOpacity>
    
    {/* Modal for Searchable List */}
    <Modal visible={isModalVisible} animationType="fade" transparent>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search Mountain..."
            placeholderTextColor="#888"
            value={searchText}
    
            onChangeText={(text) => {
              setSearchText(text);
              setFilteredMountains(mountains.filter(m => m.name.toLowerCase().includes(text.toLowerCase())));
            }}
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
                  setWeatherCondition(null);  // Reset previous weather data
                  setTemperature(null);
                  setHumidity(null);
                  setWeatherEncoded(null);
                  setTrailConditions([]);
                  setWeeklyForecast([]);
                  
                  setModalVisible(false);
                  fetchWeatherEncoding(item); // Fetch new weather immediately
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
    <View style={styles.imageContainer}>
    <ImageBackground
        source={mountainImages[selectedMountain.name]}
        style={styles.imageBackground}
      >
        <View style={styles.overlay} />
        <View style={styles.headerContent}>
          
          <Text style={styles.mountainName}>{selectedMountain.name}</Text>
          <View style={styles.row}>
          <MaterialIcons name="landscape" size={22} color="#aaa" />
          <Text style={styles.mountainElevation}>{selectedMountain.elevation}m</Text>
        </View>
        <View style={styles.row}>
          <MaterialIcons name="landscape" size={22} color="#aaa" />
          <Text style={styles.mountainDifficulty}>{selectedMountain.difficulty}</Text>
          </View>
        </View>
      </ImageBackground>
      </View>
 
    <View style={styles.weatherCard}>
  <LinearGradient colors={["#1E2A47", "#000"]} style={styles.gradientBackground}>
    <View style={styles.weatherHeader}>
      <MaterialCommunityIcons name="weather-partly-rainy" size={28} color="#fff" />
      <Text style={styles.weatherTitle}>Weather</Text>
    </View>

    {/* Temperature & Condition */}
    <View style={styles.weatherMain}>
      <Text style={styles.tempText}>{temperature}°</Text>
      <MaterialCommunityIcons name={weatherEncoded !== null ? weatherIcons[weatherEncoded] : "weather-cloudy"} size={40} color="#fff" />
    </View>
    <Text style={styles.weatherCondition}>{weatherEncoded !== null ? weatherMapping[weatherEncoded] : "Unknown"}</Text>

    {/* Extra Weather Info */}
    <View style={styles.weatherInfo}>
      {/* <View style={styles.infoItem}>
        <Feather name="sunrise" size={22} color="#fff" />
        <Text style={styles.infoText}>06:14</Text>
      </View> */}
      {/* <View style={styles.infoItem}>
        <Feather name="sunset" size={22} color="#fff" />
        <Text style={styles.infoText}>18:19</Text>
      </View> */}
      <View style={styles.infoItem}>
        <Ionicons name="water-outline" size={22} color="#fff" />
        <Text style={styles.infoText}>{humidity}%</Text>
      </View>
    </View>

    {/* Trail Condition */}
    <Text style={styles.trailHeading}>Trail Condition</Text>
    {trailConditions.map((forecast, index) => (
      <View key={index} style={styles.trailRow}>
        <MaterialCommunityIcons name={trailIcons[forecast.condition] || "terrain"} size={22} color="#fff" />
        <Text style={styles.trailText}>{forecast.time}: {forecast.condition}</Text>
      </View>
    ))}
  </LinearGradient>
</View>

    
    <TouchableOpacity 
  style={styles.button} 
  onPress={() => {
    console.log("🚀 Navigating with:", selectedMountain); // Ensure correct mountain is logged
    navigation.navigate("PredictionResult", {
      mountain: {
        name: selectedMountain.name,
        elevation: selectedMountain.elevation,  // ✅ Fix: Ensure correct elevation is passed
        difficulty: selectedMountain.difficultyEncoded,
        weatherEncoded,
        temperature,
        humidity,
        trailConditions,
      },
      restStops: Number(restStops),
      travelMode: selectedTravelMode,
    });
  }}
>
  <Text style={styles.buttonText}>Show Distance and Time</Text>
</TouchableOpacity>

{/* Weekly Forecast */}
<Text style={styles.subHeader}>Weekly Forecast</Text>

<ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.dateSelector}>
  {weeklyForecast.map((dayData, index) => {
    const currentDate = new Date(); // Get today's date
    const forecastDate = new Date();
    forecastDate.setDate(currentDate.getDate() + index); // Set correct forecast date

    return (
      <TouchableOpacity
        key={index}
        style={[styles.dateButton, selectedDay === index ? styles.selectedDateButton : {}]}
        onPress={() => {
          setSelectedDay(index);
          setSelectedForecastDetails(weeklyForecast[index]);
          setDayModalVisible(true);
        }}
      >
        <Text style={styles.dateText}>
          {dayData.day} {forecastDate.getDate()} {/* Example: "Sun 16" */}
        </Text>
      </TouchableOpacity>
    );
  })}
</ScrollView>

{weeklyForecast.length > 0 && (
  <Modal visible={isDayModalVisible} animationType="fade" transparent>
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        {selectedForecastDetails && (
          <>
            <Text style={styles.modalTitle}>{selectedForecastDetails.day} Forecast</Text>

            {/* Weather */}
            <View style={styles.modalRow}>
              <MaterialCommunityIcons name={weatherIcons[weatherEncoding[selectedForecastDetails.weather]] || "weather-cloudy"} size={24} color="#ff9800" />
              <Text style={styles.modalLabel}>
                Weather: {weatherMapping[weatherEncoding[selectedForecastDetails.weather]] ?? selectedForecastDetails.weather}
              </Text>
            </View>

            {/* Temperature */}
            <View style={styles.modalRow}>
              <MaterialCommunityIcons name="thermometer" size={24} color="#d32f2f" />
              <Text style={styles.modalLabel}>Temperature: {selectedForecastDetails.temp}°C</Text>
            </View>

            {/* Humidity */}
            <View style={styles.modalRow}>
              <Ionicons name="water-outline" size={24} color="#2196F3" />
              <Text style={styles.modalLabel}>Humidity: {selectedForecastDetails.humidity}%</Text>
            </View>

            {/* Trail Condition */}
            <View style={styles.modalRow}>
              <MaterialCommunityIcons name={trailIcons[selectedForecastDetails.trailPrediction] || "terrain"} size={24} color="#4CAF50" />
              <Text style={styles.modalLabel}>Trail Condition: {selectedForecastDetails.trailPrediction}</Text>
            </View>

            {/* Close Button */}
            <TouchableOpacity onPress={() => setDayModalVisible(false)} style={styles.forecastCloseButton}>
              <Text style={styles.forecastCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  </Modal>
)}

  </View>
  </ScrollView>
);
};


// Styles
const styles = StyleSheet.create({
  listItemText: {
    fontSize: 16,
    color: "#000",  // Ensure black text for visibility
    textAlign: "left",
    paddingVertical: 8,
  },
  
  // container: {
  //   flex: 1,
  //   justifyContent: "center",
  //   alignItems: "center",
  //   backgroundColor: "#f2f2f2",
  // },
  scrollView: {
    //alignItems: "center",
    paddingVertical: 30,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    paddingTop: 20,
  },
  scrollContainer: {
   
    flexGrow: 1,
    paddingBottom: 20,
    alignItems: "center",
  },
  header: { 
    fontSize: 20, 
    fontWeight: "bold", 
    marginBottom: 15 
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


  searchInput: {
    width: "100%",
    padding: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 10,
    backgroundColor: "#333",
  },

  listItem: {
    padding: 15,
    width: "100%",
    borderBottomWidth: 1,
    borderBottomColor: "#555",
  },

  

  closeButton: {
    marginTop: 10,
    color: "#007BFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  
  
 
  
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
   // ✅ Close Button for Weekly Forecast Modal
  
  

  imageBackground: {
    width: "100%", // Ensure full width within parent
    height: 220,
    resizeMode: "cover", // Make sure the image fully covers the container
    borderRadius: 10, 
    overflow: "hidden", // Prevent overflow issues
    marginBottom: 10,
    justifyContent: "flex-end",
  },
  imageContainer: {
    width: "90%", // Keep within screen bounds
    alignSelf: "center", // Center it properly
   // backgroundColor: "#fff", // Ensure it blends well
    borderRadius: 10,
    overflow: "hidden", // Prevent unwanted expansion
  },
  
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  mountainInfo: {
    padding: 15,
  },
  mountainName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  mountainElevation: {
    fontSize: 18,
    color: "#fff",
  },
  mountainDifficulty: {
    fontSize: 18,
    color: "#fff",
  },
  mountainDetails: {
    fontSize: 14,
    color: "#fff",
    marginTop: 5,
  },
  detailsContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  detailText: {
    fontSize: 16,
    color: "#aaa",
    marginLeft: 10,
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  downloadButton: {
    backgroundColor: "#34A853",
    padding: 15,
    borderRadius: 10,
  },
  mapButton: {
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 10,
  },
 
  weatherContainer: {
    backgroundColor: "#d3d3d3",  // Dark theme background
    padding: 15,
    borderRadius: 15,
    width: "90%",
    alignSelf: "center",
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },

  weatherCard: {
    width: "90%",
    alignSelf: "center",
    borderRadius: 15,
    overflow: "hidden",
    marginTop: 20,
  },

  gradientBackground: {
    padding: 20,
    borderRadius: 15,
  },

  weatherHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  weatherTitle: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 10,
  },

  weatherMain: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10,
  },

  tempText: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#fff",
  },

  weatherCondition: {
    fontSize: 18,
    color: "#bbb",
    marginTop: 5,
  },

  weatherInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },

  infoItem: {
    flexDirection: "row",
    alignItems: "center",
  },

  infoText: {
    color: "#fff",
    fontSize: 14,
    marginLeft: 5,
  },

  trailHeading: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "bold",
    marginTop: 15,
  },

  trailRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },

  trailText: {
    fontSize: 14,
    color: "#ccc",
    marginLeft: 10,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 20,
    textAlign: "center",
    color: "#333",
  },

  dateSelector: {
    flexDirection: "row",
    marginTop: 10,
    paddingHorizontal: 10,
  },

  dateButton: {
    padding: 12,
    marginHorizontal: 5,
    borderRadius: 8,
    backgroundColor: "#ddd",
  },

  selectedDateButton: {
    backgroundColor: "#4CAF50",
  },

  dateText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "bold",
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

  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#333",
  },

  modalRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 8,
  },

  modalLabel: {
    fontSize: 18,
    marginLeft: 10,
    color: "#555",
  },

  forecastCloseButton: {
    marginTop: 20,
    padding: 12,
    backgroundColor: "#ff5722",
    borderRadius: 8,
    width: "60%",
    alignItems: "center",
  },

  forecastCloseButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default MountainSelectionScreen;
