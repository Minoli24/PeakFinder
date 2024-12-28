import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';

const MODEL_PATH = '../assets/trained_model/model.json'; 
const mountainList = [
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

let model: tf.LayersModel | null = null;

export const modelLoader = async () => {
  await tf.ready();
  model = await tf.loadLayersModel(MODEL_PATH);
  console.log('Model loaded successfully');
};

export const predictImage = async (imageData: any): Promise<string | null> => {
  if (!model) return null;
  
  const tensor = tf.browser.fromPixels(imageData).resizeNearestNeighbor([224, 224]).toFloat().expandDims();
  const predictions = model.predict(tensor) as tf.Tensor;
  const predictionIndex = predictions.argMax(-1).dataSync()[0];
  return mountainList[predictionIndex] || null;
};
