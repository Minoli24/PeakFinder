import React from 'react';
import {View, ImageBackground, StyleSheet} from 'react-native';
import {Button} from 'react-native-paper';
import {Text} from '../components/customComponents';
import {colors} from '../theme/colors';
import Animated from 'react-native-reanimated';
interface OnboardingScreenProps {
  imageSource: any;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  onButtonPress: () => void;
  colorBlack?: string;
  activePage: number;
}

const OnboardingLayout: React.FC<OnboardingScreenProps> = ({
  imageSource,
  title,
  subtitle,
  description,
  buttonText,
  onButtonPress,
  colorBlack,
  activePage,
}) => {
  return (
    <ImageBackground style={styles.background} source={imageSource}>
      <View style={styles.container}>
        <Text
          fontSize={24}
          variant="regular"
          style={{...styles.title, color: colorBlack ?? colors.white}}>
          {title}
        </Text>
        <Text variant="semiBold" fontSize={27} style={styles.subtitle}>
          {subtitle}
        </Text>
        <Text variant="regular" fontSize={12} style={styles.description}>
          {description}
        </Text>

        <Animated.View
          style={styles.indicatorContainer}
          sharedTransitionTag="indicator">
          {[1, 2, 3].map(item => (
            <View
              key={item}
              style={[
                styles.indicator,
                {width: activePage == item ? 12 : 6, borderRadius: 100},
              ]}
            />
          ))}
        </Animated.View>

        <Button mode="contained" onPress={onButtonPress} style={styles.button}>
          <Text variant="medium" fontSize={18} style={styles.buttonText}>
            {buttonText}
          </Text>
        </Button>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    flex: 1,
    marginBottom: 30,
    marginLeft: 49,
    marginRight: 49,
  },
  title: {
    color: 'white',
  },
  subtitle: {
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
  },
  description: {
    color: 'white',
    textAlign: 'center',
  },
  indicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 10,
  },
  indicator: {
    height: 6,
    backgroundColor: 'white',
  },
  button: {
    width: 188,
    height: 47,
    borderRadius: 45,
    backgroundColor: 'white',
    marginTop: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#333',
  },
});

export default OnboardingLayout;
