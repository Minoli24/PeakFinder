import React from 'react';
import {Text as RnText, StyleSheet, TextStyle, TextProps} from 'react-native';
import {colors} from '../../theme/colors';

type FontVariant = 'regular' | 'semiBold' | 'bold' | 'light' | 'medium';

interface CustomTextProps extends TextProps {
  variant?: FontVariant;
  fontSize?: number;
  style?: TextStyle;
}

const fontVariants: {[key in FontVariant]: string} = {
  regular: 'Poppins-Regular',
  semiBold: 'Poppins-SemiBold',
  bold: 'Poppins-Bold',
  light: 'Poppins-Light',
  medium: 'Poppins-Medium',
};

export const Text: React.FC<CustomTextProps> = ({
  variant = 'regular',
  fontSize = 14,
  children,
  style,
  ...props
}) => {
  const fontFamily = fontVariants[variant] || fontVariants.regular;

  return (
    <RnText {...props} style={[styles.text, {fontFamily, fontSize}, style]}>
      {children}
    </RnText>
  );
};

const styles = StyleSheet.create({
  text: {
    color: colors.primaryBlack,
  },
});
