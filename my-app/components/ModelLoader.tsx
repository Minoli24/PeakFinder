import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';

let model: tf.LayersModel | null = null;

export const loadModel = async () => {
  if (!model) {
    const modelJSON = require('../assets/trained_model/model.json');
    const modelWeights = require('../assets/trained_model/group1-shard1of1.bin');
    model = await tf.loadLayersModel(bundleResourceIO(modelJSON, modelWeights));
    console.log('Model loaded successfully');
  }
  return model;
};

export const classifyImage = async (imageData: any) => {
  if (!model) {
    await loadModel();
  }
  
  // Preprocess imageData for TensorFlow
  const imageTensor = tf.browser.fromPixels(imageData)
    .resizeNearestNeighbor([224, 224]) // Match the input shape of your model
    .toFloat()
    .expandDims();

  const predictions = model!.predict(imageTensor) as tf.Tensor;
  const predictedIndex = predictions.argMax(-1).dataSync()[0];

  const mountainNames = [
    'Bible Rock', 'Ella Rock', 'Hanthana', 'Lakegala Mountain', 
    'Mihinthale', 'Narangala Mountain', 'Saptha Kanya', 
    'Sigiriya', 'SriPada', 'Yahangala'
  ];

  return mountainNames[predictedIndex];
};
