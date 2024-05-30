import { Platform } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence,Auth } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FIREBASECONFIG } from "./firebase-config";
import {getStorage } from 'firebase/storage';

const config = {
  apiKey: FIREBASECONFIG.APIKEY,
  authDomain: FIREBASECONFIG.AUTHDOMAIN,
  projectId: FIREBASECONFIG.PROJECTID,
  storageBucket: FIREBASECONFIG.STORAGEBUCKET,
  messagingSenderId: FIREBASECONFIG.MESSAGINGSENDERID,
  appId: FIREBASECONFIG.APPID,
  measurementId: FIREBASECONFIG.MEASUREMENTID
};

const app = initializeApp(config);
let storage = getStorage(app,"gs://iothub-e48d1.appspot.com");
let auth: Auth;

if (Platform.OS === 'web') {
  auth = getAuth(app);
 
} else {
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

export { app, auth,storage };
