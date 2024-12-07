import React, {useEffect, useRef} from 'react';
import {StyleSheet} from 'react-native';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import RootNavigation from './src/navigation/RootNavigation';
import {NavigationContainer} from '@react-navigation/native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import './reanimatedConfig';
import {useMMKVString} from 'react-native-mmkv';

import useNavigationStateStore from './src/store/navigationStore';
function App(): React.JSX.Element {
  const [userId, setUserid] = useMMKVString('userId');
  const [userName, setName] = useMMKVString('userName');

  const {setIsAuthenticated, setIsNavigationReady, setUsername} =
    useNavigationStateStore();
  useEffect(() => {
    if (userId) {
      setIsAuthenticated(true);
      //@ts-ignore
      setUsername(userName);
    }
    setIsNavigationReady(true);
  }, [userId]);
  const navRef = useRef();

  return (
    <GestureHandlerRootView style={styles.container}>
      <SafeAreaProvider>
        <NavigationContainer ref={navRef}>
          <RootNavigation />
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
});

export default App;
