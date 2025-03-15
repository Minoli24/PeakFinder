import {
  Alert,
  Button,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import MapView, {Marker, Polyline, PROVIDER_GOOGLE} from 'react-native-maps';
import {firebase} from '@react-native-firebase/firestore';
import ContainedButton from '../../components/customComponents/ContainedButton';
import {useCustomNavigation} from '../../hooks/useCustomNavigation';
import {routeNames} from '../../navigation/config/routeNames';
import CustomMarker from '../../components/customComponents/CustomMarker';
import {colors} from '../../theme/colors';
const PathCreateScreen = ({route}: any) => {
  const {values, mountainData} = route.params;

  const navigation = useCustomNavigation();

  // State to manage the markers and the polyline path coordinates
  const [dragStart, setDragStart] = useState(false);
  const [loading, setLoading] = useState(false);

  const [markers, setMarkers] = useState([
    {...mountainData.endPoint, isEndPoint: true},
  ]);
  const [pathCoordinates, setPathCoordinates] = useState([
    {...mountainData.endPoint, isEndPoint: true},
  ]); // Initially set path to only the end point

  const [markerIndex, setMarkerIndex] = useState(0);

  // Update pathCoordinates when markers change
  useEffect(() => {
    setPathCoordinates(markers);
  }, [markers]);

  // Handle the marker drag event to update marker position
  //@ts-ignore
  const handleMarkerDragEnd = (coordinate, index) => {
    // Create a new marker with updated coordinates but preserving the original index
    const updatedMarkers = [...markers];
    updatedMarkers[index] = {
      ...updatedMarkers[index], // Keep the previous properties
      latitude: coordinate.latitude, // Update latitude
      longitude: coordinate.longitude, // Update longitude
    };
    setMarkers(updatedMarkers); // Update markers and pathCoordinates
  };

  // Add a new midpoint marker
  const addMidpoint = () => {
    const lastMarker = markers[markers.length - 1]; // Get the last marker (which is the endpoint or any added marker)

    // Set the new marker index as 1 (since it's the most recently added one)
    const newMidpoint = {
      latitude: lastMarker.latitude + 0.01, // Move it slightly for demo purposes
      longitude: lastMarker.longitude + 0.01, // Move it a bit to the east
      markerIndex: 1, // The last added marker should always have an index of 1
    };

    // Update the index for all the other markers in the path
    const updatedMarkers = [
      newMidpoint,
      ...markers.map((marker, idx) => ({
        ...marker,
        markerIndex: idx + 2, // Shift previous markers up by one index
      })),
    ];

    setMarkers(updatedMarkers); // Update the markers list with the new indexes
  };

  // Save the path data (this function can be used for database submission if needed)
  const createSaveData = () => {
    console.log('asd');
    const newPath = {
      pathId: `p${new Date().getTime()}`, // Generate a new unique path ID
      pathName: values.pathName,
      pathDescription: values.description,
      travelMethods: {
        bikeMins: values.bikeMins,
        carMins: values.carMins,
        footMins: values.footMins,
        bicycleMins: values.bicycleMins,
      },
      bioDiversity: values.bioDiversity,
      distance: values.distance,
      climaticZone: values.climaticZone,
      specialPlaces: values.specialPlaces,
      markers: markers,
    };

    addPathToMountain(newPath); // Call to Firestore to save the path
  };

  // @ts-ignore
  const addPathToMountain = async newPath => {
    setLoading(true);
    try {
      const mountainRef = firebase
        .firestore()
        .collection('mountains')
        .doc(mountainData.mountainId);
      const mountainDoc = await mountainRef.get();
      console.log('mm', mountainDoc);
      if (mountainDoc.exists) {
        const currentPaths = mountainDoc.data()?.paths || [];
        const updatedPaths = [...currentPaths, newPath];
        console.log('upd', updatedPaths);
        await mountainRef.update({
          paths: updatedPaths,
        });
        console.log('12', updatedPaths);
        setLoading(false);
        ToastAndroid.show('Path added successfully!', 3000);
        navigation.navigate(routeNames.Home);
      } else {
        setLoading(false);
        Alert.alert('Error', 'Mountain not found!');
      }
    } catch (error) {
      setLoading(false);
      console.error('Error adding path:', error);
      Alert.alert('Error', 'Something went wrong, please try again!');
    }
  };

  return (
    <View style={{flex: 1}}>
      <View style={{flex: 1, width: '100%', height: 50}}>
        {/* Map View */}
        <MapView
          mapType="hybrid"
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          region={mountainData.initialLongLat}>
          {markers.map((item, index) => {
            console.log(markers);
            return (
              <Marker
                key={index}
                coordinate={item}
                draggable
                onDragStart={() => setDragStart(true)}
                onDragEnd={event => {
                  const newCoordinate = {
                    latitude: event.nativeEvent.coordinate.latitude,
                    longitude: event.nativeEvent.coordinate.longitude,
                  };
                  handleMarkerDragEnd(newCoordinate, index);
                  setDragStart(false);
                }}>
                <CustomMarker
                  markerIndex={item.markerIndex}
                  isEndPoint={item.isEndPoint}
                />
              </Marker>
            );
          })}

          {/* Connect all markers in order */}
          {!dragStart && (
            <Polyline
              strokeWidth={5}
              strokeColor={colors.primaryGreen}
              coordinates={pathCoordinates} // Connect markers in their current order
            />
          )}
        </MapView>
      </View>

      {/* Add Marker Button */}
      <View style={styles.buttonContainer}>
        <ContainedButton
          disabled={loading}
          loading={loading}
          label="Add Marker"
          onPress={addMidpoint}
          children={undefined}
          buttonColor="white"
          labelStyle={{
            color: 'black',
          }}
        />
        <ContainedButton
          disabled={loading}
          loading={loading}
          label="Save"
          onPress={createSaveData}
          children={undefined}
        />
      </View>

      {/* Overlay Text in Top-Right Corner */}
      <TouchableOpacity
        style={styles.overlay}
        onPress={() => navigation.goBack()}>
        <Text style={styles.overlayText}>X</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PathCreateScreen;

const styles = StyleSheet.create({
  map: {
    flex: 1,
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  overlayText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: '20%',
    justifyContent: 'space-between',
    gap: 10,
    flexDirection: 'row',

    zIndex: 10,
    width: 200,
  },
});
