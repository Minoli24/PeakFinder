import React from 'react';
import OnboardingLayout from '../../layouts/onBoardingLayout';
import {useCustomNavigation} from '../../hooks/useCustomNavigation';

const OnBoardingScreenTwo = () => {
  const navigation = useCustomNavigation();

  return (
    <OnboardingLayout
      buttonText="Next"
      imageSource={require('../../assets/images/onboardingBg2.png')}
      description="If you like to stay connected!  Here, you can seamlessly link your device to your PC"
      title="Get Set for"
      subtitle="Campfire Nights"
      onButtonPress={() => {
        navigation.navigate('OnboardingThree');
      }}
      activePage={2}
    />
  );
};

export default OnBoardingScreenTwo;
