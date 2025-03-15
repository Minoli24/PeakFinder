import {StyleSheet, ToastAndroid, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import ScrollViewWrapper from '../../components/wrappers/ScrollViewWrapper';
import SafeAreaWrapper from '../../components/wrappers/SafeAreaWrapper';
import ContentWrap from '../../components/wrappers/ContentWrap';
import NavigationHeader from '../../components/customComponents/headers/NavigationHeader';

import {useCustomNavigation} from '../../hooks/useCustomNavigation';
import {routeNames} from '../../navigation/config/routeNames';
import MapWithMarkers from '../../components/customComponents/MapWithMarkers';

import {Text} from '../../components/customComponents';
import InfoRow from '../../components/customComponents/InfoRow';
import TravelMethod from '../../components/customComponents/TravelMethod';
import {calculateInitialRegion} from '../../utils/calculateInitialRegion';
import {Icon, Modal, PaperProvider, Portal} from 'react-native-paper';
import ContainedButton from '../../components/customComponents/ContainedButton';
import RatingComponent from '../../components/customComponents/RatingComponent';
import {firebase} from '@react-native-firebase/firestore';
import {useMMKVString} from 'react-native-mmkv';

const PathDetails = ({route}: any) => {
  const {pathItem, mountainData} = route.params;
  const [initialRegion, setInitialRegion] = useState(null);
  const [rating, setRating] = useState(0);
  const [userId, setUserid] = useMMKVString('userId');

  const navigation = useCustomNavigation();

  useEffect(() => {
    if (route.params.pathItem) {
      const initialRegion = calculateInitialRegion(pathItem.markers);
      setInitialRegion(initialRegion);
    }
  }, [route]);

  console.log('Pth Ite', route.params.pathItem, mountainData);
  const [visible, setVisible] = React.useState(false);
  const [loading, setLoading] = React.useState(false);

  const showModal = () => setVisible(true);
  const hideModal = () => {
    setVisible(false), setRating(() => 0);
  };
  const containerStyle = {
    backgroundColor: 'white',
    padding: 20,
    width: '90%',
    left: 20,
  };
  const addRating = async () => {
    if (rating == 0) return; // Skip if no rating is provided
    try {
      setLoading(true);
      const mountainRef = firebase
        .firestore()
        .collection('mountains')
        .doc(mountainData.mountainId);
      const mountainDoc = await mountainRef.get();

      if (mountainDoc.exists) {
        const currentPaths = mountainDoc.data()?.paths;

        // Step 1: Filter out the path by pathId
        const pathToUpdateIndex = currentPaths.findIndex(
          path => path.pathId === pathItem.pathId,
        );

        if (pathToUpdateIndex !== -1) {
          // Step 2: Get the path object to update
          const pathToUpdate = currentPaths[pathToUpdateIndex];

          // Step 3: Check if the ratings property exists, if not, create it
          if (!pathToUpdate.ratings) {
            pathToUpdate.ratings = [];
          }

          // Step 4: Check if the user has already rated this path
          const userRatingIndex = pathToUpdate.ratings.findIndex(
            ratingObj => ratingObj.userID === userId,
          );

          if (userRatingIndex !== -1) {
            // User has already rated, update the existing rating
            pathToUpdate.ratings[userRatingIndex].rating = rating;
          } else {
            // User hasn't rated yet, add a new rating object
            pathToUpdate.ratings.push({userID: userId, rating: rating});
          }

          // Step 5: Update the path in the currentPaths array with the modified pathToUpdate
          currentPaths[pathToUpdateIndex] = pathToUpdate;

          // Step 6: Update the document in Firestore
          await mountainRef.update({
            paths: currentPaths, // Update the paths array with the modified path
          });
          setLoading(false);
          setVisible(() => false);
          setRating(() => 0);

          console.log('Rating updated successfully');
        } else {
          setLoading(false);

          console.log('Path not found');
        }
      } else {
        setLoading(false);

        console.log('Mountain document not found');
      }
    } catch (error) {
      setLoading(false);

      ToastAndroid.show('An error occured', 2000);
    }
  };

  return (
    <PaperProvider>
      <ScrollViewWrapper>
        <SafeAreaWrapper>
          <ContentWrap paddingLeft={20} paddingRight={20} paddingTop={10}>
            <NavigationHeader title={pathItem.pathName} />
            <View
              style={{
                marginTop: 20,
              }}
            />

            <View style={styles.mapContainer}>
              {initialRegion && initialRegion !== null && (
                <MapWithMarkers
                  showInfo={false}
                  flex={1}
                  region={initialRegion}
                  markers={pathItem.markers}
                  draggable={false}
                  onRatingPress={showModal}
                  onNavigate={() =>
                    navigation.navigate(routeNames.PathMapView, {
                      pathItem,
                      mountainData,
                    })
                  }
                  rating={pathItem.ratings}
                />
              )}
            </View>

            <View
              style={{
                marginTop: 40,
              }}>
              <Text variant="medium" style={{textAlign: 'center'}}>
                {pathItem.pathDescription}
              </Text>
            </View>

            <View
              style={{
                flexDirection: 'row',
                gap: 30,
                alignItems: 'center',
                justifyContent: 'center',
                marginTop: 40,
              }}>
              <TravelMethod
                iconName="motorbike"
                travelTime={pathItem.travelMethods.bikeMins}
              />
              <TravelMethod
                iconName="car"
                travelTime={pathItem.travelMethods.carMins}
              />
              <TravelMethod
                iconName="bike"
                travelTime={pathItem.travelMethods.bicycleMins}
              />
              <TravelMethod
                iconName="walk"
                travelTime={pathItem.travelMethods.footMins}
              />
            </View>

            <View style={styles.infoContainer}>
              <InfoRow label="Bio Diversity" content={pathItem.bioDiversity} />
              <InfoRow label="Distance" content={pathItem.distance} />
              <InfoRow label="Permission" content={pathItem.permission} />
              <InfoRow
                label="Special Places"
                content={pathItem.specialPlaces}
              />
              <ContainedButton label="Rate Trail" onPress={showModal} />
            </View>

            <Portal>
              <Modal
                visible={visible}
                onDismiss={hideModal}
                contentContainerStyle={containerStyle}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 17,
                    fontWeight: '800',
                  }}>
                  Rate Your Favourite Trail
                </Text>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: 12,
                  }}>
                  We're excited to hear your thoughts! Share your experience by
                  rating this trail and help future hikers on their journey.
                </Text>
                <RatingComponent rating={rating} setRating={setRating} />
                <ContainedButton
                  label="Add Rating"
                  onPress={addRating}
                  loading={loading}
                />
              </Modal>
            </Portal>
          </ContentWrap>
        </SafeAreaWrapper>
      </ScrollViewWrapper>
    </PaperProvider>
  );
};

export default PathDetails;

const styles = StyleSheet.create({
  mapContainer: {
    height: 250,
  },
  infoContainer: {
    marginTop: 20,
    flex: 1,
    marginBottom: 40,
  },
});
