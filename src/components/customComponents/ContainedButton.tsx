import React from 'react';
import {Button, ButtonProps} from 'react-native-paper';
import {colors} from '../../theme/colors';

interface ContainedButtonProps extends ButtonProps {
  label: string;
  onPress: any;
}

const ContainedButton: React.FC<ContainedButtonProps> = ({
  label,
  onPress,
  style,
  buttonColor,
  ...rest
}) => {
  return (
    <Button
      mode="contained"
      onPress={onPress}
      style={{
        height: 50,
        borderRadius: 40,
        backgroundColor: buttonColor ?? colors.primaryGreen,
        justifyContent: 'center',
      }}
      {...rest}>
      {label}
    </Button>
  );
};

export default ContainedButton;
