import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {screenOptions} from '../../config/navigationConstants';
import {routeNames} from '../../config/routeNames';
import LoginScreen from '../../../screens/auth/LoginScreen';
import RegisterScreen from '../../../screens/auth/RegisterScreen';

const AuthStackNav = createNativeStackNavigator();

export default function AuthStack() {
  return (
    <AuthStackNav.Navigator>
      <AuthStackNav.Screen
        component={RegisterScreen}
        name={routeNames.Register}
        //@ts-ignore
        options={{...screenOptions, animation: 'slide_from_right'}}
      />
      <AuthStackNav.Screen
        component={LoginScreen}
        name={routeNames.Login}
        //@ts-ignore
        options={{...screenOptions, animation: 'slide_from_right'}}
      />
    </AuthStackNav.Navigator>
  );
}
