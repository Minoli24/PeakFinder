import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {Icon} from 'react-native-paper';

const CustomMarker = ({
  markerIndex,
  isEndPoint,
  isSpecialPlace,
  isDevice,
}: any) => {
  console.log(isEndPoint);
  return (
    <View>
      {isEndPoint ? (
        <>
          <Icon source={'map-marker-radius'} size={35} color={'red'} />
        </>
      ) : isSpecialPlace ? (
        <>
          <Icon source={'image-marker'} size={35} color={'red'} />
        </>
      ) : isDevice ? (
        <>
          <Icon source={'cellphone-wireless'} size={35} color={'red'} />
        </>
      ) : (
        <View
          style={{
            backgroundColor: 'red',
            width: 30,
            height: 30,
            borderRadius: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Text>{markerIndex}</Text>
        </View>
      )}
    </View>
  );
};

export default CustomMarker;

const styles = StyleSheet.create({});
