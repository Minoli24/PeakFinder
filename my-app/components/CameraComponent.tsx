import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Camera } from 'react-native-vision-camera';
import { modelLoader, predictImage } from '../utils/ModelUtils';

const CameraComponent = () => {
  const [hasPermission, setHasPermission] = useState(false);
  const [prediction, setPrediction] = useState<string | null>(null);

  useEffect(() => {
    const requestPermission = async () => {
      const status = await Camera.requestCameraPermission();
      setHasPermission(status === 'authorized');
    };
    requestPermission();
  }, []);

  useEffect(() => {
    modelLoader();
  }, []);

  const handlePrediction = async (imageData: any) => {
    const mountainName = await predictImage(imageData);
    setPrediction(mountainName);
  };

  if (!hasPermission) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionText}>Camera access required</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        onFrameProcessor={handlePrediction}
      />
      {prediction && <Text style={styles.prediction}>{prediction}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  prediction: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    fontSize: 24,
    color: '#fff',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 10,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  permissionText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default CameraComponent;
