import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {screenOptions} from '../../config/navigationConstants';
import {routeNames} from '../../config/routeNames';
import LoginScreen from '../../../screens/auth/LoginScreen';
import RegisterScreen from '../../../screens/auth/RegisterScreen';
import HomeScreen from '../../../screens/home/HomeScreen';
import MountainDetails from '../../../screens/home/MountainDetails';
import PathDetails from '../../../screens/home/PathDetails';
import PathDetailsAddScreen from '../../../screens/home/PathDetailsAddScreen';

const HomeStackNav = createNativeStackNavigator();

export default function HomeStack() {
  return (
    <HomeStackNav.Navigator>
      <HomeStackNav.Screen
        component={HomeScreen}
        name={routeNames.Home}
        //@ts-ignore
        options={{...screenOptions, animation: 'slide_from_right'}}
      />
      <HomeStackNav.Screen
        component={MountainDetails}
        name={routeNames.MountainDetails}
        //@ts-ignore
        options={{...screenOptions, animation: 'simple_push'}}
      />
      <HomeStackNav.Screen
        component={PathDetails}
        name={routeNames.PathDetails}
        //@ts-ignore
        options={{...screenOptions, animation: 'simple_push'}}
      />
      <HomeStackNav.Screen
        component={PathDetailsAddScreen}
        name={routeNames.PathDetailsAdd}
        //@ts-ignore
        options={{...screenOptions, animation: 'simple_push'}}
      />
    </HomeStackNav.Navigator>
  );
}
