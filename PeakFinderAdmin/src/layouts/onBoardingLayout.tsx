import React from 'react';
import {View, ImageBackground, StyleSheet, Image} from 'react-native';
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
  imageWidth: number;
  imageHeight: number;
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
  imageHeight,
  imageWidth,
}) => {
  return (
    <>
      <View
        style={{
          flex: 1,
          backgroundColor: 'grey',
        }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Image
            source={imageSource}
            style={{
              height: imageHeight,
              width: imageWidth,
            }}
          />
        </View>
        <View
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.7)', // Black with 70% opacity
            height: 335,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text
            style={{
              fontSize: 20,
              color: 'white',
            }}>
            {title}
          </Text>
          <Text
            style={{
              fontSize: 30,
              color: 'white',
              fontWeight: '700',
            }}>
            {subtitle}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: 'white',
              textAlign: 'center',
              width: '70%',
              // fontWeight: '700',
            }}>
            {description}
          </Text>
          <Animated.View
            style={styles.indicatorContainer}
            sharedTransitionTag="indicator">
            {[1, 2].map(item => (
              <View
                key={item}
                style={[
                  styles.indicator,
                  {
                    width: activePage == item ? 12 : 6,
                    borderRadius: 100,
                    backgroundColor:
                      activePage == item ? colors.primary : colors.grey,
                  },
                ]}
              />
            ))}
          </Animated.View>
          <Button
            mode="contained"
            onPress={onButtonPress}
            style={styles.button}>
            <Text variant="medium" fontSize={15} style={styles.buttonText}>
              {buttonText}
            </Text>
          </Button>
        </View>
      </View>
    </>
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
    backgroundColor: colors.primary,
    marginTop: 40,
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  buttonText: {
    color: '#333',
  },
});

export default OnboardingLayout;
