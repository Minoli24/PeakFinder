import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {stackNames} from '../../config/stackNames';
import HomeStack from '../home/HomeStack';
import {screenOptions} from '../../config/navigationConstants';
import {
  AccountIcon,
  ClockIcon,
  HistoryIcon,
  HomeIcon,
} from '../../../components/customComponents/BottomTabIcons';
import {colors} from '../../../theme/colors';
import HistoryStack from '../home/HistoryStack';
import SettingStack from '../home/SettingsStack';
import ProfileStack from '../home/ProfileStack';

const Tab = createBottomTabNavigator();

const TabStack = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarHideOnKeyboard: true,
        tabBarStyle: {
          marginLeft: 15,
          marginRight: 15,
          backgroundColor: 'white',
          borderColor: 'transparent',
          borderRadius: 12,
          marginBottom: 15,
          paddingBottom: 10,
          height: 64,
        },
      }}>
      <Tab.Screen
        name={stackNames.homeStack}
        component={HomeStack}
        options={{
          ...screenOptions,
          tabBarIcon: HomeIcon,
          tabBarInactiveTintColor: colors.grey,
          tabBarActiveTintColor: colors.primaryGreen,
        }}
      />
      <Tab.Screen
        name={stackNames.historyStack}
        component={HistoryStack}
        options={{
          ...screenOptions,
          tabBarIcon: HistoryIcon,
          tabBarInactiveTintColor: colors.grey,
          tabBarActiveTintColor: colors.primaryGreen,
        }}
      />
      <Tab.Screen
        name={stackNames.settingStack}
        component={SettingStack}
        options={{
          ...screenOptions,
          tabBarIcon: ClockIcon,
          tabBarInactiveTintColor: colors.grey,
          tabBarActiveTintColor: colors.primaryGreen,
        }}
      />
      <Tab.Screen
        name={stackNames.profileStack}
        component={ProfileStack}
        options={{
          ...screenOptions,
          tabBarIcon: AccountIcon,
          tabBarInactiveTintColor: colors.grey,
          tabBarActiveTintColor: colors.primaryGreen,
        }}
      />
      {/* <Tab.Screen
        name={stackNames.HistoryStack}
        component={HistoryStack}
        options={{
          ...tabOptions,
          tabBarIcon: HistoryIcon,
        }}
      />
      <Tab.Screen
        name={stackNames.SettingStack}
        component={SettingsStack}
        options={{
          ...tabOptions,
          tabBarIcon: SettingsIcon,
        }}
      /> */}
    </Tab.Navigator>
  );
};

export default TabStack;
