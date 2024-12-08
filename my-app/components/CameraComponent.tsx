import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { classifyImage } from './ModelLoader';

const CameraComponent = () => {
  const [mountainName, setMountainName] = useState('Recognizing...');

  const handleCameraFrame = async (data: any) => {
    try {
      const result = await classifyImage(data);
      setMountainName(result);
    } catch (error) {
      console.error('Error in classification:', error);
      setMountainName('Error in recognition');
    }
  };

  return (
    <View style={styles.container}>
      <RNCamera
        style={styles.camera}
        type={RNCamera.Constants.Type.back}
        captureAudio={false}
        onCameraReady={() => console.log('Camera ready')}
        onPictureTaken={(data) => handleCameraFrame(data)}
      />
      <View style={styles.overlay}>
        <Text style={styles.text}>{mountainName}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
  },
});

export default CameraComponent;
