import React, { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, Text } from 'react-native';
import CameraScreen from './components/CameraScreen';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';

const App = () => {
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
      await tf.ready(); // Ensure TensorFlow.js is ready

      // Load the model
      const model = await tf.loadLayersModel(
        bundleResourceIO(
          require('./assets/trained_model/model.json'),
          require('./assets/trained_model/model.bin')
        )
      );
      setModel(model);
    };

    loadModel();
  }, []);

  if (!model) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading model, please wait...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CameraScreen model={model} mountainNames={mountainNames} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  loadingText: {
    color: '#fff',
    fontSize: 18,
  },
});

export default App;
