import React, {useState} from 'react';
import {
  Image,
  ImageBackground,
  StyleSheet,
  ToastAndroid,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Formik} from 'formik';
import * as Yup from 'yup';
import ScrollViewWrapper from '../../components/wrappers/ScrollViewWrapper';
import {Text} from '../../components/customComponents';
import {colors} from '../../theme/colors';
import TextInput from '../../components/customComponents/TextInput';
import {TextInput as PaperInput} from 'react-native-paper';
import ContainedButton from '../../components/customComponents/ContainedButton';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {useCustomNavigation} from '../../hooks/useCustomNavigation';
import {routeNames} from '../../navigation/config/routeNames';
import Animated from 'react-native-reanimated';
import {firebaseCollections} from '../../constants/firebaseCollections';
import {useMMKVString} from 'react-native-mmkv';
// Validation Schema using Yup
const validationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .matches(/^[^\s]*$/, 'Name cannot contain spaces')
    .required('Name is required'),

  email: Yup.string()
    .trim()
    .matches(/^[^\s]*$/, 'Email cannot contain spaces')
    .email('Invalid email format')
    .required('Email is required'),

  password: Yup.string()
    .trim()
    .matches(/^[^\s]*$/, 'Password cannot contain spaces')
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
});

const RegisterScreen = () => {
  const [loading, setLoading] = useState(false);
  const navigation = useCustomNavigation();
  const [secureText, setSecureText] = useState(false);
  const [userId, setUserid] = useMMKVString('userId');
  const [userName, setUsername] = useMMKVString('userName');

  // Register User function
  const handleRegister = async (values: any) => {
    setLoading(true);

    try {
      const userCredential = await auth().createUserWithEmailAndPassword(
        values.email,
        values.password,
      );

      const user = userCredential.user;

      await firestore()
        .collection(firebaseCollections.usersCollection)
        .doc(user.uid) // Use Firebase user ID as the document ID
        .set({
          id: user.uid,
          name: values.name,
          email: values.email,
          createdAt: firestore.FieldValue.serverTimestamp(),
        });
      setUserid(user.uid);
      setUsername(values.name);
      console.log('User registered successfully:', user);
      ToastAndroid.show('User Registered successfully', 2000);
    } catch (error: any) {
      console.error('Registration error:', error.message);
      ToastAndroid.show(error.message, 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollViewWrapper keyboardShouldPersistTaps="handled">
        <ImageBackground
          style={styles.imageBackground}
          source={require('../../assets/images/loginBg.png')}>
          <View style={styles.header}>
            <Image
              source={require('../../assets/images/logoBgRemoved.png')}
              style={styles.logo}
            />

            <View style={styles.formContainer}>
              <Formik
                initialValues={{name: '', email: '', password: ''}}
                validationSchema={validationSchema}
                onSubmit={handleRegister}>
                {({
                  values,
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  errors,
                  touched,
                }) => (
                  <View style={styles.formContent}>
                    <Text variant="medium" fontSize={28} style={styles.title}>
                      Get ready,
                    </Text>
                    <Text
                      variant="regular"
                      fontSize={16}
                      style={styles.subtitle}>
                      Discover peaks around the world.
                    </Text>

                    <Animated.View style={styles.inputFields}>
                      <View>
                        <TextInput
                          value={values.name}
                          onChangeText={handleChange('name')}
                          onBlur={handleBlur('name')}
                          leftIcon={
                            <PaperInput.Icon icon="account-multiple-outline" />
                          }
                          textInputProps={{
                            placeholder: 'Name',
                            style: styles.input,
                          }}
                          error={touched.name && !!errors.name}
                          bottomText={touched.name && errors.name}
                          bottomTextProps={styles.errorText}
                        />
                      </View>
                      <View>
                        <TextInput
                          value={values.email}
                          onChangeText={handleChange('email')}
                          onBlur={handleBlur('email')}
                          leftIcon={<PaperInput.Icon icon="email-outline" />}
                          textInputProps={{
                            placeholder: 'Email',
                            style: styles.input,
                            keyboardType: 'email-address',
                            autoCapitalize: 'none',
                          }}
                          error={touched.email && !!errors.email}
                          bottomText={touched.email && errors.email}
                          bottomTextProps={styles.errorText}
                        />
                      </View>
                      <View>
                        <TextInput
                          value={values.password}
                          onChangeText={handleChange('password')}
                          onBlur={handleBlur('password')}
                          leftIcon={<PaperInput.Icon icon="lock-outline" />}
                          textInputProps={{
                            placeholder: 'Password',
                            style: styles.inputPassword,
                            secureTextEntry: secureText,
                          }}
                          error={touched.password && !!errors.password}
                          bottomText={touched.password && errors.password}
                          bottomTextProps={styles.errorText}
                          rightIcon={
                            <PaperInput.Icon
                              icon={
                                secureText ? 'eye-off-outline' : 'eye-outline'
                              }
                              onPress={() => setSecureText(prev => !prev)}
                            />
                          }
                        />
                      </View>
                    </Animated.View>

                    <View style={styles.submitButtonContainer}>
                      <ContainedButton
                        label={'Register'}
                        onPress={handleSubmit}
                        children={undefined}
                        loading={loading}
                        disabled={loading}
                      />
                    </View>
                  </View>
                )}
              </Formik>
            </View>

            <View style={styles.footer}>
              <Text variant="regular" fontSize={13} style={styles.footerText}>
                Already have an account?{' '}
                <Text
                  variant="regular"
                  fontSize={13}
                  style={styles.footerLink}
                  onPress={() => {
                    navigation.navigate(routeNames.Login);
                  }}>
                  Login
                </Text>
              </Text>
            </View>
          </View>
        </ImageBackground>
      </ScrollViewWrapper>
    </SafeAreaView>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageBackground: {
    flex: 1,
  },
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 19,
  },
  logo: {
    width: 166,
    height: 122,
  },
  formContainer: {
    height: 430,
    width: '100%',
    paddingLeft: 35,
    paddingRight: 35,
  },
  formContent: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  title: {
    color: colors.white,
    lineHeight: 42,
  },
  subtitle: {
    color: colors.white,
    lineHeight: 24,
  },
  inputFields: {
    width: '100%',
    gap: 20,
    marginTop: 28,
  },
  input: {
    width: '100%',
    opacity: 0.5,

    backgroundColor: colors.white,
    borderColor: 'transparent',
    borderWidth: 0,
    color: colors.black,
  },
  inputPassword: {
    width: '100%',

    backgroundColor: colors.white,
    opacity: 0.5,
    borderColor: 'transparent',
    borderWidth: 0,
    color: colors.black,
  },
  errorText: {
    color: 'white',
    fontWeight: '800',
  },
  submitButtonContainer: {
    // flex: 1,
    width: '100%',
    marginTop: 20,
  },
  footer: {
    marginBottom: 10,
  },
  footerText: {
    color: colors.white,
    lineHeight: 24,
  },
  footerLink: {
    color: colors.white,
    textDecorationLine: 'underline',
  },
});
