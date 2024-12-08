import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';
import { classifyImage } from './ModelLoader';

const CameraComponent = () => {
  const [mountainName, setMountainName] = useState('Recognizing...');
  const processingRef = useRef(false); // To prevent overlapping frame processing

  const handleFrame = async (data: any) => {
    if (processingRef.current) return; // Skip if already processing
    processingRef.current = true;

    try {
      const mountain = await classifyImage(data);
      setMountainName(mountain);
    } catch (error) {
      console.error('Error in classification:', error);
      setMountainName('Error in recognition');
    }

    processingRef.current = false;
  };

  return (
    <View style={styles.container}>
      <RNCamera
        style={styles.camera}
        type={RNCamera.Constants.Type.back}
        captureAudio={false}
        onCameraReady={() => console.log('Camera ready')}
        onFrame={(frame) => handleFrame(frame)}
        frameProcessorFps={1} // Process 1 frame per second (adjust as needed)
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
