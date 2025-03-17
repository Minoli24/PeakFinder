import React from 'react';
import OnboardingLayout from '../../layouts/onBoardingLayout';
import {useCustomNavigation} from '../../hooks/useCustomNavigation';

const OnBoardingScreenTwo = () => {
  const navigation = useCustomNavigation();

  return (
    <OnboardingLayout
      imageWidth={356}
      imageHeight={230}
      buttonText="Next"
      imageSource={require('../../assets/images/multiDevice.png')}
      description="The main device is been setting up with other devices in your reserve."
      title="Almost there"
      subtitle="Setting up devices"
      onButtonPress={() => {
        navigation.navigate('OnboardingThree');
      }}
      activePage={2}
    />
  );
};

export default OnBoardingScreenTwo;
