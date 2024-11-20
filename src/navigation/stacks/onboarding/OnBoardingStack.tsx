import {createNativeStackNavigator} from '@react-navigation/native-stack';
import OnBoardingScreenOne from '../../../screens/onboarding/OnBoardingScreenOne';
import {screenOptions} from '../../config/navigationConstants';
import OnBoardingScreenTwo from '../../../screens/onboarding/OnBoardingScreenTwo';
import OnBoardingScreenThree from '../../../screens/onboarding/OnBoardingScreenThree';

const OnBoardingStackNav = createNativeStackNavigator();

export default function OnBoardingStack() {
  return (
    <OnBoardingStackNav.Navigator>
      <OnBoardingStackNav.Screen
        component={OnBoardingScreenOne}
        name="OnboardingOne"
        //@ts-ignore
        options={{...screenOptions, animation: 'slide_from_right'}}
      />
      <OnBoardingStackNav.Screen
        component={OnBoardingScreenTwo}
        name="OnboardingTwo"
        //@ts-ignore
        options={{...screenOptions, animation: 'slide_from_right'}}
      />
      <OnBoardingStackNav.Screen
        component={OnBoardingScreenThree}
        name="OnboardingThree"
        //@ts-ignore
        options={{...screenOptions, animation: 'slide_from_right'}}
      />
    </OnBoardingStackNav.Navigator>
  );
}
