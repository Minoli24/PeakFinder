import React from 'react';
import OnboardingLayout from '../../layouts/onBoardingLayout';
import {useCustomNavigation} from '../../hooks/useCustomNavigation';

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
        navigation.navigate('OnboardingTwo');
      }}
      activePage={3}
    />
  );
};

export default OnBoardingScreenThree;
