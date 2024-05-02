
import React from 'react'
import { Stack } from 'expo-router'


const LayoutProfile = () => {
  return (
    <Stack>
           
        <Stack.Screen name="profile" options={{
          title:"Profile",
          headerTintColor: "#fff",
          headerStyle: { backgroundColor: "#298ed6" },
          headerTitleAlign: "center",
          }} />
        <Stack.Screen name="(profileSettings)/accountSettings" options={{
          title:"Account Settings",
          headerTintColor: "#fff",
          headerStyle: { backgroundColor: "#298ed6" },
          headerTitleAlign: "center",}  }/>
        <Stack.Screen name="(profileSettings)/notifications" options={{
          title:"Notifications",
          headerTintColor: "#fff",
          headerStyle: { backgroundColor: "#298ed6" },
          headerTitleAlign: "center",}  }/>
        <Stack.Screen name="(profileSettings)/privacy" options={{
          title:"Privacy",
          headerTintColor: "#fff",
          headerStyle: { backgroundColor: "#298ed6" },
          headerTitleAlign: "center",}  }/>
        <Stack.Screen name="(profileSettings)/security" options={{
          title:"Security",
          headerTintColor: "#fff",
          headerStyle: { backgroundColor: "#298ed6" },
          headerTitleAlign: "center",}  }/>
     

      
    </Stack>
  )
}

export default LayoutProfile