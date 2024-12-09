import {StyleSheet, View, Button, Alert} from 'react-native';
import React from 'react';
import {Formik} from 'formik';
import * as Yup from 'yup';
import ScrollViewWrapper from '../../components/wrappers/ScrollViewWrapper';
import SafeAreaWrapper from '../../components/wrappers/SafeAreaWrapper';
import ContentWrap from '../../components/wrappers/ContentWrap';
import NavigationHeader from '../../components/customComponents/headers/NavigationHeader';
import TextInput from '../../components/customComponents/TextInput';

import {routeNames} from '../../navigation/config/routeNames';
import {useCustomNavigation} from '../../hooks/useCustomNavigation';
import ContainedButton from '../../components/customComponents/ContainedButton';

// Yup validation schema
const validationSchema = Yup.object().shape({
  pathName: Yup.string()
    .required('Path name is required')
    .max(50, 'Max length is 50 characters'),
  description: Yup.string()
    .required('Description is required')
    .max(50, 'Max length is 50 characters'),
  distance: Yup.string()
    .required('Distance is required')
    .max(50, 'Max length is 50 characters'),
  bikeMins: Yup.number()
    .positive('Must be a positive number')

    .notRequired(),
  carMins: Yup.number()
    .positive('Must be a positive number')

    .notRequired(),
  footMins: Yup.number()
    .positive('Must be a positive number')

    .notRequired(),
  bicycleMins: Yup.number()
    .positive('Must be a positive number')

    .notRequired(),
  bioDiversity: Yup.string().notRequired(),
  climaticZone: Yup.string().notRequired(),
  specialPlaces: Yup.string().notRequired(),
});

const PathDetailsAddScreen = ({route}: any) => {
  const {mountainData} = route.params; // Getting the mountain data passed via route params

  const navigation = useCustomNavigation();

  return (
    <SafeAreaWrapper>
      <ContentWrap paddingLeft={15} paddingRight={15} paddingTop={10}>
        <NavigationHeader title="Add Path Details" />
        <ScrollViewWrapper>
          <Formik
            initialValues={{
              pathName: '',
              description: '',
              distance: '',
              bikeMins: '',
              carMins: '',
              footMins: '',
              bicycleMins: '',
              bioDiversity: '',
              climaticZone: '',
              specialPlaces: '',
            }}
            validationSchema={validationSchema}
            onSubmit={values => {
              if (
                values.bikeMins === '' &&
                values.carMins === '' &&
                values.footMins === '' &&
                values.bicycleMins === ''
              ) {
                Alert.alert(
                  'At least one of the "Minutes" fields should be filled.',
                );
              } else {
                navigation.navigate(routeNames.PathCreateScreen, {
                  values,
                  mountainData,
                });
              }
            }}>
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
            }) => (
              <View style={{marginBottom: 30}}>
                {/* Path Name */}
                <View style={{marginBottom: 20}}>
                  <TextInput
                    label="Path Name"
                    value={values.pathName}
                    onBlur={handleBlur('pathName')}
                    onChangeText={handleChange('pathName')}
                    textInputProps={{
                      outlineStyle: {borderRadius: 10},
                    }}
                    error={touched.pathName && !!errors.pathName}
                    bottomText={touched.pathName && errors.pathName}
                    bottomTextProps={styles.errorText}
                  />
                </View>

                {/* Path Description */}
                <View style={{marginBottom: 20}}>
                  <TextInput
                    label="Path Description"
                    value={values.description}
                    onBlur={handleBlur('description')}
                    onChangeText={handleChange('description')}
                    textInputProps={{
                      style: {height: 80},
                      outlineStyle: {borderRadius: 10},
                      multiline: true,
                    }}
                    error={touched.description && !!errors.description}
                    bottomText={touched.description && errors.description}
                    bottomTextProps={styles.errorText}
                  />
                </View>

                {/* Bike Mins */}
                <View style={{marginBottom: 20}}>
                  <TextInput
                    label="Bike Mins"
                    value={values.bikeMins}
                    onBlur={handleBlur('bikeMins')}
                    onChangeText={handleChange('bikeMins')}
                    textInputProps={{
                      style: {width: 200},
                      outlineStyle: {borderRadius: 10},
                      keyboardType: 'numeric',
                    }}
                    error={touched.bikeMins && !!errors.bikeMins}
                    bottomText={touched.bikeMins && errors.bikeMins}
                    bottomTextProps={styles.errorText}
                  />
                </View>

                {/* Car Mins */}
                <View style={{marginBottom: 20}}>
                  <TextInput
                    label="Car Mins"
                    value={values.carMins}
                    onBlur={handleBlur('carMins')}
                    onChangeText={handleChange('carMins')}
                    textInputProps={{
                      style: {width: 200},
                      outlineStyle: {borderRadius: 10},
                      keyboardType: 'numeric',
                    }}
                    error={touched.carMins && !!errors.carMins}
                    bottomText={touched.carMins && errors.carMins}
                    bottomTextProps={styles.errorText}
                  />
                </View>

                {/* Foot Mins */}
                <View style={{marginBottom: 20}}>
                  <TextInput
                    label="Foot Mins"
                    value={values.footMins}
                    onBlur={handleBlur('footMins')}
                    onChangeText={handleChange('footMins')}
                    textInputProps={{
                      style: {width: 200},
                      outlineStyle: {borderRadius: 10},
                      keyboardType: 'numeric',
                    }}
                    error={touched.footMins && !!errors.footMins}
                    bottomText={touched.footMins && errors.footMins}
                    bottomTextProps={styles.errorText}
                  />
                </View>

                {/* Bicycle Mins */}
                <View style={{marginBottom: 20}}>
                  <TextInput
                    label="Bicycle Mins"
                    value={values.bicycleMins}
                    onBlur={handleBlur('bicycleMins')}
                    onChangeText={handleChange('bicycleMins')}
                    textInputProps={{
                      style: {width: 200},
                      outlineStyle: {borderRadius: 10},
                      keyboardType: 'numeric',
                    }}
                    error={touched.bicycleMins && !!errors.bicycleMins}
                    bottomText={touched.bicycleMins && errors.bicycleMins}
                    bottomTextProps={styles.errorText}
                  />
                </View>

                {/* Bio Diversity */}
                <View style={{marginBottom: 20}}>
                  <TextInput
                    label="Bio Diversity"
                    value={values.bioDiversity}
                    onBlur={handleBlur('bioDiversity')}
                    onChangeText={handleChange('bioDiversity')}
                    textInputProps={{
                      style: {height: 80},
                      outlineStyle: {borderRadius: 10},
                      multiline: true,
                    }}
                    error={touched.bioDiversity && !!errors.bioDiversity}
                    bottomText={touched.bioDiversity && errors.bioDiversity}
                    bottomTextProps={styles.errorText}
                  />
                </View>

                {/* Distance */}
                <View style={{marginBottom: 20}}>
                  <TextInput
                    label="Distance"
                    value={values.distance}
                    onBlur={handleBlur('distance')}
                    onChangeText={handleChange('distance')}
                    textInputProps={{
                      outlineStyle: {borderRadius: 10},
                      keyboardType: 'number-pad',
                    }}
                    error={touched.distance && !!errors.distance}
                    bottomText={touched.distance && errors.distance}
                    bottomTextProps={styles.errorText}
                  />
                </View>

                {/* Climatic Zone */}
                <View style={{marginBottom: 20}}>
                  <TextInput
                    label="Climatic Zone"
                    value={values.climaticZone}
                    onBlur={handleBlur('climaticZone')}
                    onChangeText={handleChange('climaticZone')}
                    textInputProps={{
                      outlineStyle: {borderRadius: 10},
                    }}
                    error={touched.climaticZone && !!errors.climaticZone}
                    bottomText={touched.climaticZone && errors.climaticZone}
                    bottomTextProps={styles.errorText}
                  />
                </View>

                {/* Special Places */}
                <View style={{marginBottom: 20}}>
                  <TextInput
                    label="Special Places"
                    value={values.specialPlaces}
                    onBlur={handleBlur('specialPlaces')}
                    onChangeText={handleChange('specialPlaces')}
                    textInputProps={{
                      style: {height: 80},
                      outlineStyle: {borderRadius: 10},
                      multiline: true,
                    }}
                    error={touched.specialPlaces && !!errors.specialPlaces}
                    bottomText={touched.specialPlaces && errors.specialPlaces}
                    bottomTextProps={styles.errorText}
                  />
                </View>

                {/* Submit Button */}
                <View style={{marginTop: 20}}>
                  <ContainedButton
                    onPress={handleSubmit}
                    label="Submit"
                    children={undefined}
                  />
                </View>
              </View>
            )}
          </Formik>
        </ScrollViewWrapper>
      </ContentWrap>
    </SafeAreaWrapper>
  );
};

export default PathDetailsAddScreen;

const styles = StyleSheet.create({
  errorText: {
    color: 'red',
    fontSize: 12,
  },
});
