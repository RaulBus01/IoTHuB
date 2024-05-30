
import React from 'react'
import { Stack } from 'expo-router'
const LoginLayout = () => {
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

export default LoginLayout