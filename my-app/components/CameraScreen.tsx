import React, { useRef, useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import RNFS from 'react-native-fs';

const CameraScreen = ({ model, mountainNames }: { model: tf.LayersModel, mountainNames: string[] }) => {
  const cameraRef = useRef<RNCamera>(null);
  const [isModelReady, setIsModelReady] = useState(false);
  const [recognizedMountain, setRecognizedMountain] = useState<string | null>(null);

  useEffect(() => {
    const initializeTf = async () => {
      await tf.ready();
      setIsModelReady(true);
    };

    initializeTf();
  }, []);

  const captureAndProcessImage = async () => {
    if (!cameraRef.current || !model || !isModelReady) return;

    const options = { quality: 0.5, base64: true };
    const data = await cameraRef.current.takePictureAsync(options);

    if (!data.base64) {
      console.error('Failed to capture image in base64 format');
      return;
    }

    // Write Base64 image to a temporary file
    const imagePath = `${RNFS.TemporaryDirectoryPath}/photo.jpg`;
    await RNFS.writeFile(imagePath, data.base64, 'base64');

    // Load the image using an external library like react-native-canvas
    const img = new Image();
    img.src = `file://${imagePath}`;

    // Convert the image to a tensor
    const imageTensor = tf.browser.fromPixels(img)
      .resizeNearestNeighbor([224, 224])
      .expandDims(0)
      .toFloat()
      .div(tf.scalar(255));

    // Make predictions
    const predictions = model.predict(imageTensor) as tf.Tensor;
    const predictedIndex = predictions.argMax(-1).dataSync()[0];

    setRecognizedMountain(mountainNames[predictedIndex]);

    // Clean up temporary file
    await RNFS.unlink(imagePath);
  };

  return (
    <View style={styles.container}>
      <RNCamera
        ref={cameraRef}
        style={styles.camera}
        type={RNCamera.Constants.Type.back}
        captureAudio={false}
      >
        <View style={styles.overlay}>
          <Text style={styles.text}>
            {recognizedMountain ? `Detected: ${recognizedMountain}` : 'Point the camera at a mountain'}
          </Text>
        </View>
      </RNCamera>
      <View style={styles.captureButton}>
        <Text onPress={captureAndProcessImage} style={styles.captureText}>
          Capture
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  overlay: {
    position: 'absolute',
    bottom: 100,
    width: '100%',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
  },
  captureButton: {
    position: 'absolute',
    bottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  captureText: {
    fontSize: 20,
    color: 'white',
    backgroundColor: 'blue',
    padding: 15,
    borderRadius: 50,
  },
});

export default CameraScreen;
