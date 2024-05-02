import React from 'react'
import { View, Text,StyleSheet } from 'react-native'
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons';
import LoginScreen from '../(login)/login';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../../config';
import LoadingScreen from '../loadingScreen';




const TabsLayout = () => {
  const [user, setUser] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      
      setLoading(false);
    });

    
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingScreen />; // Replace with your loading screen component
  }
  const colorScheme = 'dark';

  return (
       user ?
       <Tabs sceneContainerStyle={colorScheme ==='dark' ? styles.darkStyle : styles.lightStyle}>
        <Tabs.Screen 
          name="(home)" 
          options={{
            title:"Home",
            headerShown:false,
            headerTitleAlign: "center",
            tabBarActiveBackgroundColor: "#70d4fb",
            tabBarInactiveBackgroundColor: "#bec4dd",
            tabBarIcon: ({color, size}) => <Ionicons name="home" size={size} color={color} />
          }}
        />

        <Tabs.Screen 
        name="(profile)" 
        options={{
        title:"Profile",
        headerShown:false,
        tabBarActiveBackgroundColor: "#70d4fb",
        tabBarInactiveBackgroundColor: "#bec4dd",
        tabBarIcon: ({color, size}) => <Ionicons name="person" size={size} color={color} />
      }}/>
    </Tabs>
    :
     <LoginScreen/>
    

      
  )
}

const styles = StyleSheet.create({
  darkStyle: {
    backgroundColor: "#15496f",
  },
  lightStyle: {
    
  },
})



export default TabsLayout