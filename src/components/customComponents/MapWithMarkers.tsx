import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import MapView, {Marker, Polyline, PROVIDER_GOOGLE} from 'react-native-maps';
import {colors} from '../../theme/colors';
import {Icon} from 'react-native-paper';
import CustomMarker from './CustomMarker';

const MapWithMarkers = ({
  flex = 1, // Default flex value
  //@ts-ignore
  region,
  draggable = true, // Default draggable value
  markers: initialMarkers = [],
  overlayText = 'Top Right Text',
  onNavigate = () => {},
}) => {
  const [dragStart, setDragStart] = useState(false);
  const [markers, setMarkers] = useState(initialMarkers);
  const [pathCoordinates, setPathCoordinates] = useState(initialMarkers);
  console.log('II', initialMarkers);

  const mm = [{latitude: 6.8154, longitude: 80.3815, isEndPoint: true}];

  //@ts-ignore
  const handleMarkerDragEnd = (coordinate, index) => {
    const updatedMarkers = [...markers];
    //@ts-ignore
    updatedMarkers[index] = coordinate; // Update the dragged marker's position
    setMarkers(updatedMarkers); // Update markers state
  };

  return (
    <View style={{flex: flex, width: '100%'}}>
      {/* Map View */}
      <MapView
        mapType="hybrid"
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={region}>
        {markers.map((item, index) => (
          <Marker
            key={index}
            tracksViewChanges={false}
            coordinate={item}
            draggable={draggable}
            onDragStart={() => setDragStart(true)}
            onDragEnd={event => {
              const newCoordinate = {
                latitude: event.nativeEvent.coordinate.latitude,
                longitude: event.nativeEvent.coordinate.longitude,
              };
              handleMarkerDragEnd(newCoordinate, index);
              setDragStart(false);
            }}>
            {/* //@ts-ignore */}
            <CustomMarker
              markerIndex={item.markerIndex}
              isEndPoint={item.isEndPoint}
            />
          </Marker>
        ))}

        {!dragStart && (
          <Polyline
            strokeWidth={5}
            strokeColor={colors.primaryGreen}
            coordinates={pathCoordinates}
          />
        )}
      </MapView>

      {/* Overlay Text in Top-Right Corner */}
      <TouchableOpacity style={styles.overlay} onPress={onNavigate}>
        <Icon source="crop-free" size={20} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  map: {
    flex: 1,
    // height: '100%',
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
  addButton: {
    position: 'absolute',
    bottom: 10,
    left: '50%',

    backgroundColor: 'blue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    zIndex: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default MapWithMarkers;
