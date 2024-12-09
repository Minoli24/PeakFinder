import React from 'react';
import {View, StyleSheet} from 'react-native';
import {IconButton} from 'react-native-paper';
import {Text} from '../Text';
import {useCustomNavigation} from '../../../hooks/useCustomNavigation';

interface NavigationHeaderProps {
  title: string;
  onBackPress?: () => void;
}

const NavigationHeader: React.FC<NavigationHeaderProps> = ({
  title,
  onBackPress,
}) => {
  const navigation = useCustomNavigation();

  // Default back press behavior (navigation.goBack), but it can be overridden with onBackPress
  const handleBackPress = onBackPress || (() => navigation.goBack());

  return (
    <View style={styles.container}>
      <IconButton icon="arrow-left" size={25} onPress={handleBackPress} />
      <View style={styles.titleContainer}>
        <Text variant="bold" fontSize={17} numberOfLines={2}>
          {title}
        </Text>
      </View>
      <View
        style={{
          width: 25,
          height: 25,
        }}
      />
    </View>
  );
};

export default NavigationHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // paddingHorizontal: 16,
    // paddingVertical: 8,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
});
