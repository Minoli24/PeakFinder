import React, {PropsWithChildren} from 'react';
import {
  ScrollView,
  ScrollViewProps,
  View,
  ViewStyle,
  StyleProp,
} from 'react-native';

interface ScrollViewWrapperProps extends PropsWithChildren<ScrollViewProps> {
  contentContainerStyle?: StyleProp<ViewStyle>;
  isScrollable?: boolean;
}

const ScrollViewWrapper: React.FC<ScrollViewWrapperProps> = ({
  children,
  contentContainerStyle,
  isScrollable = true,
  ...scrollViewProps
}) => {
  if (isScrollable) {
    return (
      <ScrollView
        {...scrollViewProps}
        contentContainerStyle={[{flexGrow: 1}, contentContainerStyle]}>
        {children}
      </ScrollView>
    );
  }

  return <View style={[{flex: 1}, contentContainerStyle]}>{children}</View>;
};

export default ScrollViewWrapper;
