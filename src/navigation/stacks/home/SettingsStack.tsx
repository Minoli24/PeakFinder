import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HistoryScreen from '../../../screens/history/HistoryScreen';
import {routeNames} from '../../config/routeNames';
import {screenOptions} from '../../config/navigationConstants';
import Settings from '../../../screens/settings/Settings';

const SettingStackNav = createNativeStackNavigator();

export default function SettingStack() {
  return (
    <SettingStackNav.Navigator>
      <SettingStackNav.Screen
        component={Settings}
        name={routeNames.SettingScreen}
        //@ts-ignore
        options={{...screenOptions, animation: 'slide_from_right'}}
      />
    </SettingStackNav.Navigator>
  );
}
