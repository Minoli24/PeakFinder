import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Camera } from 'expo-camera';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import { ExpoWebGLRenderingContext } from 'expo-gl';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';

const RealTimeRecognition = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [isTfReady, setIsTfReady] = useState(false);
  const cameraRef = useRef<Camera | null>(null);
  const modelRef = useRef<tf.LayersModel | null>(null);

  const mountainClasses = [
    "Bible Rock", "Ella Rock", "Hanthana", "Lakegala Mountain",
    "Mihinthale", "Narangala Mountain", "Saptha Kanya",
    "Sigiriya", "SriPada", "Yahangala"
  ];

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');

      // Initialize TensorFlow.js
      await tf.ready();
      const model = await tf.loadLayersModel(bundleResourceIO(
        require('../assets/trained_model.json'),
        require('../assets/trained_model.weights.bin')
      ));
      modelRef.current = model;
      setIsTfReady(true);
    })();
  }, []);

  const handleCameraStream = async (gl: ExpoWebGLRenderingContext) => {
    const loop = async () => {
      if (!isTfReady || !modelRef.current || !cameraRef.current) return;

      // Capture the frame as Tensor
      const { width, height } = gl.drawingBufferWidth;
      const cameraTexture = new tf.Tensor(gl);

      const imageTensor = tf.browser.fromPixels(cameraTexture);
      const resizedTensor = tf.image.resizeBilinear(imageTensor, [224, 224]);
      const normalizedTensor = resizedTensor.expandDims(0).div(255.0);

      // Predict
      const predictionTensor = modelRef.current.predict(normalizedTensor) as tf.Tensor;
      const predictionArray = await predictionTensor.array();
      const predictedIndex = predictionArray[0].indexOf(Math.max(...predictionArray[0]));

      setPrediction(mountainClasses[predictedIndex]);

      requestAnimationFrame(loop); // Continue processing the next frame
    };

    loop();
  };

  if (hasPermission === null) return <View><Text>Requesting Camera Permission...</Text></View>;
  if (hasPermission === false) return <View><Text>No access to the camera</Text></View>;

  return (
    <View style={styles.container}>
      <Camera
        ref={cameraRef}
        style={styles.camera}
        type={Camera.Constants.Type.back}
        onCameraReady={handleCameraStream}
      />
      {prediction && (
        <View style={styles.overlay}>
          <Text style={styles.predictionText}>{prediction}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  overlay: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  predictionText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 10,
  },
});

export default RealTimeRecognition;
