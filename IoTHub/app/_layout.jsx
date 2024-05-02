import { View, Text,StyleSheet } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import LoginScreen from './(login)/login';
const RootLayout = () => {
  
  return (
    <Stack>
        <Stack.Screen name="(tabs)" options={{headerShown:false}  }/>
       <Stack.Screen name="(login)" options={{headerShown:false}  }/>


    </Stack>
  )
}



export default RootLayout
