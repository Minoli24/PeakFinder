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
import Animated from 'react-native-reanimated';
import {useCustomNavigation} from '../../hooks/useCustomNavigation';
import {routeNames} from '../../navigation/config/routeNames';
import {firebaseCollections} from '../../constants/firebaseCollections';
import {stackNames} from '../../navigation/config/stackNames';
import {useMMKVString} from 'react-native-mmkv';
import useNavigationStateStore from '../../store/navigationStore';
import {storage} from '../../localStorage/mmkvStorage';

// Validation Schema using Yup for Login (email & password)
const validationSchema = Yup.object().shape({
  email: Yup.string()
    .trim()
    .matches(/^[^\s]*$/, 'Email cannot contain spaces')
    .email('Invalid email format')
    .required('Email is required'),

  password: Yup.string()
    .trim()
    .min(8, 'Password must be at least 8 characters') // Password length should be at least 8 characters
    .matches(/^[^\s]*$/, 'Password cannot contain spaces')
    .required('Password is required'),
});

const LoginScreen = () => {
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [secureText, setSecureText] = useState(false);
  const [userId, setUserid] = useMMKVString('userId');
  // const [userName, setUsername] = useMMKVString('userName');

  const navigation = useCustomNavigation();
  const {setIsAuthenticated, setUsername} = useNavigationStateStore();
  // Login User function
  const handleLogin = async (values: any) => {
    setLoading(true);

    try {
      const userCredential = await auth().signInWithEmailAndPassword(
        values.email,
        values.password,
      );

      const user = userCredential.user;

      console.log('User logged in successfully:', user);

      // Fetch user data from Firestore using the uid
      const userDoc = await firestore()
        .collection(firebaseCollections.usersCollection)
        .doc(user.uid)
        .get();
      console.log('usee', userDoc.data().name);

      if (userDoc.exists) {
        setUserData(userDoc.data());
        setUserid(user.uid);
        //@ts-ignore
        setUsername(userDoc.data().name);
        storage.set('userName', userDoc.data().name);
        console.log('User data retrieved from Firestore:', userDoc.data());
        // navigation.navigate(stackNames.tabStack);
        ToastAndroid.show('Login Successful', 2000);
        setIsAuthenticated(true);
      } else {
        ToastAndroid.show('User data not found in Firestore.', 2000);
      }
    } catch (error: any) {
      console.error('Login error:', error.message);

      // Handle Firebase Authentication errors
      if (error.code === 'auth/user-not-found') {
        ToastAndroid.show('User not found. Please check your email.', 2000);
      } else if (error.code === 'auth/wrong-password') {
        ToastAndroid.show('Incorrect password. Please try again.', 2000);
      } else {
        ToastAndroid.show('An error occurred. Please try again later.', 2000);
      }
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
                initialValues={{email: '', password: ''}}
                validationSchema={validationSchema}
                onSubmit={handleLogin}>
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
                      Welcome Back,
                    </Text>
                    <Text
                      variant="regular"
                      fontSize={16}
                      style={styles.subtitle}>
                      Log in to continue your adventure.
                    </Text>

                    <Animated.View style={styles.inputFields}>
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
                        label={loading ? 'Logging in...' : 'Log In'}
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
                Don't have an account?{' '}
                <Text
                  variant="regular"
                  fontSize={13}
                  style={styles.footerLink}
                  onPress={() => {
                    navigation.navigate(routeNames.Register);
                  }}>
                  Register
                </Text>
              </Text>
            </View>
          </View>
        </ImageBackground>
      </ScrollViewWrapper>
    </SafeAreaView>
  );
};

export default LoginScreen;

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

    backgroundColor: colors.white,
    opacity: 0.5,
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
