
import React from 'react'
import { Stack } from 'expo-router'

const RootLayout = () => {
  return (
    <Stack>
    <Stack.Screen
      name="(tabs)"
      options={{
        headerShown: false,
        title: 'Home',
        
      }}
    />
  </Stack>
  )
}



export default RootLayout
