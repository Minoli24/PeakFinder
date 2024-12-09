import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HistoryScreen from '../../../screens/history/HistoryScreen';
import {routeNames} from '../../config/routeNames';
import {screenOptions} from '../../config/navigationConstants';

const HistoryStackNav = createNativeStackNavigator();

export default function HistoryStack() {
  return (
    <HistoryStackNav.Navigator>
      <HistoryStackNav.Screen
        component={HistoryScreen}
        name={routeNames.HistoryScreen}
        //@ts-ignore
        options={{...screenOptions, animation: 'slide_from_right'}}
      />
    </HistoryStackNav.Navigator>
  );
}
