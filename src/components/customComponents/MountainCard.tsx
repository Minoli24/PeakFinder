import React from 'react';
import {
  View,
  Image,
  StyleSheet,
  ViewStyle,
  TextStyle,
  StyleProp,
  ImageStyle,
} from 'react-native';
import {Card, Icon} from 'react-native-paper';
import {Text} from './Text';
import {colors} from '../../theme/colors';

interface MountainCardProps {
  imageUri?: string;
  mountainName: string;
  description: string;
  containerStyle?: ViewStyle;
  imageStyle?: StyleProp<ImageStyle>;
  textContainerStyle?: ViewStyle;
  textStyle?: TextStyle;
  descriptionStyle?: TextStyle;
  onPress: any;
  showImage?: boolean;
  isPath?: boolean;
  shortestPaths?: [];
  hasAnimals?: boolean;
  hasWater?: boolean;
  pathId?: string;
}

const MountainCard: React.FC<MountainCardProps> = ({
  imageUri,
  mountainName,
  description,
  containerStyle,
  imageStyle,
  textContainerStyle,
  textStyle,
  descriptionStyle,
  onPress,
  showImage = true,
  isPath = false,
  shortestPaths = [],
  hasAnimals,
  hasWater,
  pathId,
}) => {
  return (
    <View style={[styles.cardContainer, containerStyle]}>
      <Card onPress={onPress}>
        {isPath && (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginLeft: 10,
              marginBottom: 10,
              marginTop: 10,
              marginRight: 10,
            }}>
            {shortestPaths.includes(pathId) && (
              <View
                style={{
                  backgroundColor: 'green',
                  flexDirection: 'row',
                  padding: 3,
                  borderRadius: 10,
                  paddingRight: 10,
                }}>
                <Icon size={15} source={'map'} />
                <Text
                  style={{
                    fontSize: 10,
                  }}>
                  Shoretest Path
                </Text>
              </View>
            )}
            {hasWater && (
              <View
                style={{
                  backgroundColor: 'blue',
                  flexDirection: 'row',
                  padding: 3,
                  borderRadius: 10,
                  paddingRight: 10,
                }}>
                <Icon size={15} source={'water'} />
                <Text
                  style={{
                    fontSize: 10,
                  }}>
                  Has Water
                </Text>
              </View>
            )}
            {hasAnimals && (
              <View
                style={{
                  backgroundColor: 'red',
                  flexDirection: 'row',
                  padding: 3,
                  borderRadius: 10,
                  paddingRight: 10,
                }}>
                <Icon size={15} source={'skull-crossbones'} />
                <Text
                  style={{
                    fontSize: 10,
                  }}>
                  Has Animals
                </Text>
              </View>
            )}
          </View>
        )}

        <Card.Content style={[styles.cardContent, textContainerStyle]}>
          {showImage && (
            <View>
              <Image
                source={{uri: imageUri}}
                style={[styles.image, imageStyle]}
              />
            </View>
          )}

          <View style={styles.textContainer}>
            <Text variant="medium" fontSize={13} style={textStyle}>
              {mountainName}
            </Text>
            <Text
              numberOfLines={showImage ? 2 : undefined}
              variant="regular"
              fontSize={12}
              style={[{color: colors.grey}, descriptionStyle]}>
              {description}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </View>
  );
};

// Default styles for the component
const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 10,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 18,
    paddingRight: 10, // Optional, for spacing between text and card edge
  },
  image: {
    width: 90,
    height: 80,
    borderRadius: 10,
  },
  textContainer: {
    flex: 1,
  },
  mountainName: {
    fontSize: 13,
    fontWeight: '500',
  },
  description: {
    fontSize: 12,
    fontWeight: '400',
    color: '#555',
  },
});

export default MountainCard;
