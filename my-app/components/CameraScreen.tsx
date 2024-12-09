import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { RNCamera } from 'react-native-camera';
import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';

const CameraScreen = () => {
  const [isModelReady, setIsModelReady] = useState(false);
  const [recognizedMountain, setRecognizedMountain] = useState('Recognizing...');
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const cameraRef = useRef<RNCamera>(null);

  const mountainNames = [
    'Bible Rock',
    'Ella Rock',
    'Hanthana',
    'Lakegala Mountain',
    'Mihinthale',
    'Narangala Mountain',
    'Saptha Kanya',
    'Sigiriya',
    'SriPada',
    'Yahangala',
  ];

  useEffect(() => {
    const loadModel = async () => {
      await tf.ready();
      const loadedModel = await tf.loadLayersModel(
        bundleResourceIO(
          require('../assets/model.json'),
          require('../assets/model.bin')
        )
      );
      setModel(loadedModel);
      setIsModelReady(true);
    };

    loadModel();
  }, []);

  const captureAndProcessImage = async () => {
    if (!cameraRef.current || !model || !isModelReady) return;
  
    const options = { quality: 0.5, base64: true };
    const data = await cameraRef.current.takePictureAsync(options);
  
    const imageTensor = decodeImage(data.base64, 3) // Decode Base64 to Tensor
      .resizeNearestNeighbor([224, 224])
      .expandDims(0)
      .toFloat()
      .div(tf.scalar(255));
  
    const predictions = model.predict(imageTensor) as tf.Tensor;
    const predictedIndex = predictions.argMax(-1).dataSync()[0];
  
    setRecognizedMountain(mountainNames[predictedIndex]);
  };
  return (
    <View style={styles.container}>
      <RNCamera
        ref={cameraRef}
        style={styles.camera}
        type={RNCamera.Constants.Type.back}
        onCameraReady={() => console.log('Camera ready')}
        captureAudio={false}
      />
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{recognizedMountain}</Text>
      </View>
      <TouchableOpacity
        style={styles.captureButton}
        onPress={captureAndProcessImage}
      >
        <Text style={styles.buttonText}>Capture</Text>
      </TouchableOpacity>
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
  labelContainer: {
    position: 'absolute',
    bottom: 100,
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 10,
  },
  label: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  captureButton: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 50,
  },
  buttonText: {
    fontSize: 16,
    color: '#000',
  },
});

export default CameraScreen;
