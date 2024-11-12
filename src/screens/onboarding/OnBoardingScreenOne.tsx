import {StyleSheet} from 'react-native';
import React from 'react';

import {colors} from '../../theme/colors';

import OnboardingLayout from '../../layouts/onBoardingLayout';
import {useCustomNavigation} from '../../hooks/useCustomNavigation';

const OnBoardingScreenOne = () => {
  const navigation = useCustomNavigation();
  return (
    <OnboardingLayout
      buttonText="Next"
      imageSource={require('../../assets/images/onboardingBg1.png')}
      description="If you like to stay connected!  Here, you can seamlessly link your device to your PC"
      title="Get ready for"
      subtitle="New Adventures"
      onButtonPress={() => {
        navigation.navigate('OnboardingTwo');
      }}
      colorBlack={colors.grey}
      activePage={1}
    />
  );
};

const style = StyleSheet.create({
  fontStyle: {
    color: colors.white,
  },
});

export default OnBoardingScreenOne;
