import React from 'react';
import {SafeAreaView, ViewStyle} from 'react-native';

interface SafeAreaWrapperProps {
  children: React.ReactNode; // To render any child components inside
  style?: ViewStyle; // Optional style prop to customize the container
}

const SafeAreaWrapper: React.FC<SafeAreaWrapperProps> = ({children, style}) => {
  return <SafeAreaView style={[{flex: 1}, style]}>{children}</SafeAreaView>;
};

export default SafeAreaWrapper;
