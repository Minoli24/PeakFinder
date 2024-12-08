import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import * as tf from '@tensorflow/tfjs';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';
import { TensorCamera } from '@tensorflow/tfjs-react-native';


const MountainRecognizer = ({ cameraRef }: { cameraRef: React.RefObject<Camera> }) => {
  const [model, setModel] = useState<tf.LayersModel | null>(null);
  const [prediction, setPrediction] = useState('');

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
    (async () => {
      await tf.ready();
      const modelJson = require('../assets/trained_model.json');
      const modelWeights = require('../assets/trained_model_weights.bin');
      const loadedModel = await tf.loadLayersModel(bundleResourceIO(modelJson, modelWeights));
      setModel(loadedModel);
    })();
  }, []);

  const handlePrediction = async () => {
    if (model && cameraRef.current) {
      const tensor = await cameraRef.current.takePictureAsync();
      const predictionTensor = model.predict(tensor) as tf.Tensor;
      const predictionArray = await predictionTensor.data();
      const predictedIndex = predictionArray.indexOf(Math.max(...predictionArray));
      setPrediction(mountainNames[predictedIndex]);
    }
  };

  return (
    <View style={styles.overlay}>
      <Text style={styles.predictionText}>
        {prediction || 'Point the camera at a mountain'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    alignItems: 'center',
  },
  predictionText: {
    fontSize: 20,
    color: '#fff',
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 5,
  },
});

export default MountainRecognizer;
