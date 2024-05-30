
import React from 'react'
import { Stack } from 'expo-router'


const LayoutHome = () => {

 
  return (
    <Stack>
        <Stack.Screen
          name="HomeScreen"
          options={{
            title: "Home",
            headerShown: false,
            headerTitleAlign: "center",
            
            
          }}
        />
      
       
        <Stack.Screen
          name ="ControlScreen"
         
            options={{
            headerTintColor: "#fff",
            headerStyle: { backgroundColor: "#298ed6" },
            headerTitleAlign: "center",
            }}
            />
        <Stack.Screen
         name ="TextScreen"
          
          options={{
          headerTintColor: "#fff",
          headerStyle: { backgroundColor: "#298ed6" },
          headerTitleAlign: "center",
          }}
        />
        <Stack.Screen
          name ="Dashboard"
          
              options={{
              headerTintColor: "#fff",
              headerStyle: { backgroundColor: "#298ed6" },
              headerTitleAlign: "center",
              }}
              />    
          <Stack.Screen
           name="TranscribeText"
           
           options={{
            headerTintColor: "#fff",
            headerStyle: { backgroundColor: "#298ed6" },
            headerTitleAlign: "center",
            }}
          />                

        
        
    </Stack>
  )
}

export default LayoutHome