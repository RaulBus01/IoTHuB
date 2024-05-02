
import React from 'react'
import { Stack } from 'expo-router'
const _layout = () => {
  return (
    <Stack>
        <Stack.Screen name="login" options={{
          title:"Login",
          headerTintColor: "#fff",
          headerStyle: { backgroundColor: "#298ed6" },
          headerTitleAlign: "center",
          headerShown: false
          }} />
    </Stack>

  )
}

export default _layout