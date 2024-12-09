import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { RNCamera } from 'react-native-camera';
import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';

const CameraScreen = () => {
  const [isModelReady, setIsModelReady] = useState(false);
  const [recognizedMountain, setRecognizedMountain] = useState('Recognizing...');
  const [model, setModel] = useState<tf.LayersModel | null>(null);

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

  const processImage = async (data: any) => {
    if (!model || !isModelReady) return;

    const imageTensor = tf.browser.fromPixels(data).resizeNearestNeighbor([224, 224]).expandDims(0).toFloat().div(tf.scalar(255));

    const predictions = model.predict(imageTensor) as tf.Tensor;
    const predictedIndex = predictions.argMax(-1).dataSync()[0];

    setRecognizedMountain(mountainNames[predictedIndex]);
  };

  return (
    <View style={styles.container}>
      <RNCamera
        style={styles.camera}
        type={RNCamera.Constants.Type.back}
        onCameraReady={() => console.log('Camera ready')}
        onPreviewFrame={(data) => processImage(data)}
        captureAudio={false}
      />
      <View style={styles.labelContainer}>
        <Text style={styles.label}>{recognizedMountain}</Text>
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
  labelContainer: {
    position: 'absolute',
    bottom: 50,
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
});

export default CameraScreen;
