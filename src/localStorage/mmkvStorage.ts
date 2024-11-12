import {MMKV} from 'react-native-mmkv';

// use this to store small data, it will be avaialable even after app closed
export const storage = new MMKV();
