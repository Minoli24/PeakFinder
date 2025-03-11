
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