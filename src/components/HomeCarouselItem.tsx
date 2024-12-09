// HomeCarouselItem.tsx

import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  ImageStyle,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {colors} from '../theme/colors';

interface Mountain {
  mountainName: string;
  mainImage: string;
}

interface HomeCarouselItemProps {
  item: Mountain;
}

const HomeCarouselItem: React.FC<HomeCarouselItemProps> = ({item}) => {
  return (
    <ImageBackground
      source={{
        uri: item.mainImage,
      }}
      style={styles.imageBackground}
      imageStyle={styles.imageStyle}>
      <View style={styles.textContainer}>
        <Text style={[styles.text, {color: colors.white}]}>
          {item.mountainName}
        </Text>
      </View>
    </ImageBackground>
  );
};

// Styles for the ImageBackground and text
const styles = {
  imageBackground: {
    height: 190,
    marginHorizontal: 20,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    borderRadius: 10,
    overflow: 'hidden',
  } as ViewStyle,

  imageStyle: {
    borderRadius: 10,
    resizeMode: 'cover',
  } as ImageStyle,

  textContainer: {
    gap: 40,
  } as ViewStyle,

  text: {
    fontSize: 32,
    fontWeight: '600', // SemiBold
  } as TextStyle,
};

export default HomeCarouselItem;
