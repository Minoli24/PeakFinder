import {StyleSheet} from 'react-native';
import React from 'react';

import {colors} from '../../theme/colors';

import OnboardingLayout from '../../layouts/onBoardingLayout';
import {useCustomNavigation} from '../../hooks/useCustomNavigation';

const OnBoardingScreenOne = () => {
  const navigation = useCustomNavigation();
  return (
    <OnboardingLayout
      imageWidth={211}
      imageHeight={349}
      buttonText="Next"
      imageSource={require('../../assets/images/singleDevice.png')}
      description="The main device serves data to cloud using your PC."
      title="Connect your"
      subtitle="Main Device to PC"
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
