import {
  TextInput as RnInput,
  Text,
  TextInputProps as PaperInputProps,
} from 'react-native-paper';
import {colors} from '../../theme/colors';

interface TextInputProps {
  textInputProps?: PaperInputProps;
  onChangeText?: any;
  value?: string | undefined;
  bottomText?: string | false | undefined;
  label?: string;
  error?: boolean | undefined;
  bottomTextProps?: any;
  leftIcon?: any;
  rightIcon?: any;
  onBlur?: any;
}

const TextInput = (props: TextInputProps) => {
  return (
    <>
      <RnInput
        mode="outlined"
        error={props.error}
        onBlur={props.onBlur}
        outlineStyle={{
          borderRadius: 40,
        }}
        value={props.value}
        underlineStyle={{
          display: 'none',
        }}
        activeOutlineColor={colors.black}
        onChangeText={props.onChangeText}
        style={{
          height: 46,
          borderWidth: 0,
          color: 'transparent',
          borderRadius: 10,
          opacity: 0.7,
        }}
        left={props.leftIcon}
        right={props.rightIcon}
        label={props.label}
        {...props.textInputProps}
      />
      {props.bottomText && (
        <Text
          style={{
            ...props.bottomTextProps,
          }}>
          {props.bottomText}
        </Text>
      )}
    </>
  );
};

export default TextInput;
