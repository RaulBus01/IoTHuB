import React from 'react';
import { StyleSheet } from 'react-native';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
const TabsLayout = () => {
 
  

  const colorScheme = 'dark';

  return (

    <Tabs sceneContainerStyle={colorScheme === 'dark' ? styles.darkStyle : styles.lightStyle} >
     <Tabs.Screen 
        name="(home)"
        
        options={{

          title: "Home",
          headerShown: false,
          headerTitleAlign: "center",
          tabBarActiveBackgroundColor: "#70d4fb",
          tabBarInactiveBackgroundColor: "#bec4dd",
          tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />
        }}
      />
      <Tabs.Screen 
        name="(profile)" 
      
        options={{
          title: "Profile",
          headerShown: false,
          tabBarActiveBackgroundColor: "#70d4fb",
          tabBarInactiveBackgroundColor: "#bec4dd",
          tabBarIcon: ({ color, size }) => <Ionicons name="person" size={size} color={color} />
        }}
      />
       
    </Tabs>
  );
};

const styles = StyleSheet.create({
  darkStyle: {
    backgroundColor: "#15496f",
  },
  lightStyle: {
    backgroundColor: "#ffffff",
  },
});

export default TabsLayout;
