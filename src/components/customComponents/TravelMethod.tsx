// TravelMethod.tsx
import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Icon} from 'react-native-paper';
import {Text} from './Text';

interface TravelMethodProps {
  iconName: string;
  travelTime: number;
}

const TravelMethod: React.FC<TravelMethodProps> = ({iconName, travelTime}) => {
  return (
    <View style={styles.container}>
      <Icon source={iconName} size={30} />
      <Text style={styles.travelTime}>{travelTime} mins</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  travelTime: {
    fontSize: 12,
  },
});

export default TravelMethod;
