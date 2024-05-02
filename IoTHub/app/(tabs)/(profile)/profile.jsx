import { View, Text, Pressable,TextInput,StyleSheet } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import LoginScreen from './loginScreen';
import ProfileSettingsMenu from './profileSettingsMenu';
const ProfileScreen = () => {
 
  const [isUserLoggedIn,setIsUserLoggedIn] = React.useState(true);

  return (
    isUserLoggedIn ? <ProfileSettingsMenu setIsUserLoggedIn={setIsUserLoggedIn}/> : <LoginScreen  setIsUserLoggedIn={setIsUserLoggedIn}/>
  );
  
}



export default ProfileScreen;