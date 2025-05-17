// import 'react-native-gesture-handler';  // ✅ Required for Navigation
// import React from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import { createStackNavigator } from "@react-navigation/stack";
// import { enableScreens } from 'react-native-screens';  // ✅ Optimize navigation performance

// import HomeScreen from "./screens/HomeScreen";
// import MountainSelectionScreen from "./screens/MountainSelectionScreen";
// import PredictionResultScreen from "./screens/PredictionResultScreen";

// // Enable native screen optimization
// enableScreens();

// export type RootStackParamList = {
//   Home: undefined;
//   MountainSelection: undefined;
//   PredictionResult: {
//     mountain: {
//       hikerExperienceEncoded: number;
//       genderEncoded: number;
//       backpackWeightRange: number;
//       ageRange: number;
//       name: string;
//       elevation: number;
//       difficulty: number;
//       weatherEncoded: number | null;
//       temperature: number | null;
//       humidity: number | null;
//       trailConditions: any[];
//     };
//     restStops: number;
//     travelMode: string;
//   };
// };

// const Stack = createStackNavigator<RootStackParamList>();

// export default function AppNavigator() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="MountainSelection">
//         <Stack.Screen name="Home" component={HomeScreen} />
//         <Stack.Screen name="MountainSelection" component={MountainSelectionScreen} />
//         <Stack.Screen 
//           name="PredictionResult" 
//           component={PredictionResultScreen as React.ComponentType<any>} 
//           options={{ headerShown: false }} // ✅ Hide header for web compatibility
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

// import 'react-native-gesture-handler';
// import React from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import { createStackNavigator } from "@react-navigation/stack";
// import { enableScreens } from 'react-native-screens';

// import HomeScreen from "./screens/HomeScreen";
// import MountainSelectionScreen from "./screens/MountainSelectionScreen";
// import PredictionResultScreen from "./screens/PredictionResultScreen";
// import UserInputScreen from "./screens/UserInputScreen";

// enableScreens();

// export type RootStackParamList = {
//   Home: undefined;
//   MountainSelection: undefined;
//   UserInput: {
//     mountain: any;
//   };
//   PredictionResult: {
//     mountain: {
//       forecast3h(forecast3h: any): unknown;
//       forecastNow: any;
//       name: string;
//       elevation: number;
//       difficulty: number;
//       weatherEncoded: number | null;
//       temperature: number | null;
//       humidity: number | null;
//       trailConditions: any[];
//       ageRange: number;
//       backpackWeightRange: number;
//       genderEncoded: number;
//       hikerExperienceEncoded: number;
//     };
//   };
// };

// const Stack = createStackNavigator<RootStackParamList>();

// export default function AppNavigator() {
//   return (
//     <NavigationContainer>
//       <Stack.Navigator initialRouteName="MountainSelection">
//         <Stack.Screen name="Home" component={HomeScreen} />
//         <Stack.Screen name="MountainSelection" component={MountainSelectionScreen} />
//         <Stack.Screen name="UserInput" component={UserInputScreen} />
//         <Stack.Screen 
//           name="PredictionResult" 
//           component={PredictionResultScreen as React.ComponentType<any>} 
//           options={{ headerShown: false }} 
//         />
//       </Stack.Navigator>
//     </NavigationContainer>
//   );
// }

import 'react-native-gesture-handler';
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { enableScreens } from 'react-native-screens';

import HomeScreen from "./screens/HomeScreen";
import MountainSelectionScreen from "./screens/MountainSelectionScreen";
import PredictionResultScreen from "./screens/PredictionResultScreen";
import UserInputScreen from "./screens/UserInputScreen";

enableScreens();

export type ForecastData = {
  time: string;
  weather: string;
  temp: number;
  humidity: number;
};

export type RootStackParamList = {
  Home: undefined;
  MountainSelection: undefined;
  UserInput: {
    mountain: {
      name: string;
      elevation: number;
      difficulty: number;
      weatherEncoded: number;
      temperature: number;
      humidity: number;
      trailConditions: { time: string; condition: string }[];
      forecastNow: ForecastData;
      forecast3h: ForecastData;
      forecast6h: ForecastData;
    };
  };
  PredictionResult: {
    mountain: {
      name: string;
      elevation: number;
      difficulty: number;
      weatherEncoded: number;
      temperature: number;
      humidity: number;
      trailConditions: { time: string; condition: string }[];
      forecastNow: ForecastData;
      forecast3h: ForecastData;
      forecast6h: ForecastData;
      ageRange: number;
      backpackWeightRange: number;
      genderEncoded: number;
      hikerExperienceEncoded: number;
    };
  };
};


const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MountainSelection">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="MountainSelection" component={MountainSelectionScreen} />
        <Stack.Screen name="UserInput" component={UserInputScreen} />
        <Stack.Screen
          name="PredictionResult"
          component={PredictionResultScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
