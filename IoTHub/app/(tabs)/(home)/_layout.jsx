import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'

const LayoutHome = () => {
  return (
    <Stack>
        <Stack.Screen name="index" options={{
          title:"Home",
          headerTintColor: "#fff",
          headerStyle: { backgroundColor: "#298ed6" },
          headerTitleAlign: "center",
          }} />
        <Stack.Screen name="[deviceId]" options={{
          title:"Device Details",
          headerTintColor: "#fff",
          headerStyle: { backgroundColor: "#298ed6" },
          headerTitleAlign: "center",
          }} />
    </Stack>
  )
}

export default LayoutHome