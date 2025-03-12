
// import React from "react";
// import { NavigationContainer } from "@react-navigation/native";
// import { createStackNavigator } from "@react-navigation/stack";
// import HomeScreen from "./screens/HomeScreen";
// import MountainSelectionScreen from "./screens/MountainSelectionScreen";
// import PredictionResultScreen from "./screens/PredictionResultScreen";



// export type RootStackParamList = {
//   Home: undefined;
//   MountainSelection: undefined;
//   PredictionResult: {
//     mountain: {
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

import 'react-native-gesture-handler';  // ✅ Required for Navigation
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { enableScreens } from 'react-native-screens';  // ✅ Optimize navigation performance

import HomeScreen from "./screens/HomeScreen";
import MountainSelectionScreen from "./screens/MountainSelectionScreen";
import PredictionResultScreen from "./screens/PredictionResultScreen";

// Enable native screen optimization
enableScreens();

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
          component={PredictionResultScreen as React.ComponentType<any>} 
          options={{ headerShown: false }} // ✅ Hide header for web compatibility
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
