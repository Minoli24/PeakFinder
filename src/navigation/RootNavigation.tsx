import React, {useEffect, useState} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {stackNames} from './config/stackNames';
import OnBoardingStack from './stacks/onboarding/OnBoardingStack';
import {screenOptions} from './config/navigationConstants';
import AuthStack from './stacks/auth/AuthStack';
import TabStack from './stacks/tabs/tabStack';
import {routeNames} from './config/routeNames';
import PathMapView from '../screens/home/PathMapView';
import PathCreateScreen from '../screens/home/PathCreateScreen';

import BootSplash from 'react-native-bootsplash';
import useNavigationStateStore from '../store/navigationStore';
import {ActivityIndicator} from 'react-native-paper';
const RootStackNavigator = createNativeStackNavigator();

const RootNavigation = () => {
  const {
    isAuthenticated,

    isNavigationReady,
  } = useNavigationStateStore();
  const [isFullyReady, setIsFullyReady] = useState(false);
  useEffect(() => {
    if (isNavigationReady) {
      BootSplash.hide({fade: true}).then(() => {
        setIsFullyReady(true); // Set isFullyReady to true once navigation is fully ready
      });
    }
  }, [isNavigationReady]);
  if (!isFullyReady) {
    <ActivityIndicator />;
  }
  // show hide stacks based on your prefrence(use zustand or mmkv to store prefrence)
  return (
    <RootStackNavigator.Navigator>
      <RootStackNavigator.Group>
        {!isAuthenticated ? (
          <>
            <RootStackNavigator.Screen
              name={'onboard'}
              component={OnBoardingStack}
              //@ts-ignore
              options={screenOptions}
            />
            <RootStackNavigator.Screen
              name={stackNames.authStack}
              component={AuthStack}
              //@ts-ignore
              options={screenOptions}
            />
          </>
        ) : (
          <>
            <RootStackNavigator.Screen
              name={stackNames.tabStack}
              component={TabStack}
              //@ts-ignore
              options={screenOptions}
            />

            <RootStackNavigator.Screen
              name={routeNames.PathMapView}
              component={PathMapView}
              //@ts-ignore
              options={screenOptions}
            />
            <RootStackNavigator.Screen
              name={routeNames.PathCreateScreen}
              component={PathCreateScreen}
              //@ts-ignore
              options={screenOptions}
            />
          </>
        )}
      </RootStackNavigator.Group>
    </RootStackNavigator.Navigator>
  );
};

export default RootNavigation;
