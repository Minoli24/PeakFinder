import {StyleSheet, View} from 'react-native';
import React from 'react';

import MapWithMarkers from '../../components/customComponents/MapWithMarkers';

const PathMapView = ({route}: any) => {
  const {pathItem, mountainData} = route.params;

  return (
    <View style={{flex: 1}}>
      <MapWithMarkers
        flex={1}
        region={mountainData.initialLongLat}
        markers={pathItem.markers}
        draggable={false}
      />
    </View>
  );
};

export default PathMapView;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    flex: 1,
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 10, // Position the text at the top
    right: 10, // Position the text at the right
    zIndex: 10, // Ensure it's above the map
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Optional, add some background color to make the text stand out
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5, // Optional, rounded corners for the overlay
  },
  overlayText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
});
