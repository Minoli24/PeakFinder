import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HistoryScreen from '../../../screens/history/HistoryScreen';
import {routeNames} from '../../config/routeNames';
import {screenOptions} from '../../config/navigationConstants';
import ProfileScreen from '../../../screens/profile/ProfileScreen';

const ProfileStackNav = createNativeStackNavigator();

export default function ProfileStack() {
  return (
    <ProfileStackNav.Navigator>
      <ProfileStackNav.Screen
        component={ProfileScreen}
        name={routeNames.ProfileScreen}
        //@ts-ignore
        options={{...screenOptions, animation: 'slide_from_right'}}
      />
    </ProfileStackNav.Navigator>
  );
}
