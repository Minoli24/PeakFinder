import React from 'react';
import OnboardingLayout from '../../layouts/onBoardingLayout';
import {useCustomNavigation} from '../../hooks/useCustomNavigation';
import {routeNames} from '../../navigation/config/routeNames';
import {stackNames} from '../../navigation/config/stackNames';

const OnBoardingScreenThree = () => {
  const navigation = useCustomNavigation();

  return (
    <OnboardingLayout
      buttonText="Let's Hike"
      imageSource={require('../../assets/images/onboardingBg3.png')}
      description="If you like to stay connected!  Here, you can seamlessly link your device to your PC"
      title="Stay Safe"
      subtitle="Stay Connected"
      onButtonPress={() => {
        navigation.navigate(stackNames.authStack);
      }}
      activePage={3}
    />
  );
};

export default OnBoardingScreenThree;
