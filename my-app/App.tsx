import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import CameraScreen from './components/CameraScreen';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <CameraScreen />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});

export default App;
