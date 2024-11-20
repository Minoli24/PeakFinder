import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {stackNames} from './config/stackNames';
import OnBoardingStack from './stacks/onboarding/OnBoardingStack';
import {screenOptions} from './config/navigationConstants';
import AuthStack from './stacks/auth/AuthStack';

const RootStackNavigator = createNativeStackNavigator();

const RootNavigation = () => {
  // show hide stacks based on your prefrence(use zustand or mmkv to store prefrence)
  return (
    <RootStackNavigator.Navigator>
      <RootStackNavigator.Group>
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
      </RootStackNavigator.Group>
    </RootStackNavigator.Navigator>
  );
};

export default RootNavigation;
