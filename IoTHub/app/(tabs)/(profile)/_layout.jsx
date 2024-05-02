import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import {BaseToast,ErrorToast} from 'react-native-toast-message';
export const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderColor: 'green' ,backgroundColor: 'lightgreen'}}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 14,
        color: 'white'
      }}
      />),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: 'red' ,backgroundColor: 'lightcoral'}}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        
        color: 'white'
      }}
      />)
  ,
  info: (props) => (
    <BaseToast
      {...props}
      style={{ borderColor: 'blue' ,backgroundColor: 'lightblue'}}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 14,
        color: 'white'
      }}
      />)
};
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