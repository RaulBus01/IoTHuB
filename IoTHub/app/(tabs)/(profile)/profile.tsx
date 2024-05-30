import { View, Text, Pressable,TextInput,StyleSheet } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';

import ProfileSettingsMenu from './profileSettingsMenu';
const ProfileScreen = () => {
 
  
  
  return (
      <View style={styles.container}>
      
      <ProfileSettingsMenu/>
      </View>

  
  );
  
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: "aliceblue",
    paddingTop: 10,
    textAlign: 'center',
    width: '100%',
},
      textProfile: {
        color: "white",
        fontSize: 30,
      },
})


export default ProfileScreen;