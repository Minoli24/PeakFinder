import React, {PropsWithChildren} from 'react';
import {ScrollView, ScrollViewProps, ViewStyle, StyleProp} from 'react-native';

interface ScrollViewWrapperProps extends PropsWithChildren<ScrollViewProps> {
  contentContainerStyle?: StyleProp<ViewStyle>;
}

const ScrollViewWrapper: React.FC<ScrollViewWrapperProps> = ({
  children,
  contentContainerStyle,
  ...scrollViewProps
}) => {
  return (
    <ScrollView
      {...scrollViewProps}
      contentContainerStyle={[{flexGrow: 1}, contentContainerStyle]}>
      {children}
    </ScrollView>
  );
};

export default ScrollViewWrapper;
