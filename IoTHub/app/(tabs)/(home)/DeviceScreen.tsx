import { View, Text,StyleSheet,Image, Pressable,Platform } from 'react-native'
import React from 'react'


import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import * as Device from 'expo-device';
const DeviceScreen = (props:any) => {
  const router = useRouter();
  const handlePress = async () => {
    

    if (Platform.OS === 'android') {
      router.push({ pathname: '/(tabs)/(home)/ControlScreen'});
    } else {
      router.push({ pathname: '/(tabs)/(home)/ControlScreen'});
    }
  };
  

  return (
    <View style={styles.default}>
        <Pressable onPress={handlePress} style={({pressed})=> !pressed ? styles.pressable : styles.pressed}>
          <Text style={styles.text}>{props.name}</Text>
          <Image style={styles.image} source={require('./DeviceLogo.png')} />
          <Text style={styles.text}>{props.type}</Text>
        </Pressable>
        <Pressable   onPress={()=>{props.deleteDevice()}} >
        <Ionicons name="trash-bin" size={22}></Ionicons>
        </Pressable>

    </View>
  )
}

const styles = StyleSheet.create({
    default: {
    backgroundColor: "#298ed6",
    padding: 5,
    margin: 5,
    borderRadius: 10,
    borderColor: "black",
  
    alignItems: "center",
    width: 180,
    },
    image:{
        width: 110,
        height: 110,
        borderRadius: 15,

    },
    pressable:{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        margin: 10,
        borderRadius: 15,
    },
    pressed:
    {
      
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "#9EC3DE",
      padding: 10,
      margin: 10,
      borderRadius: 15,

    },
    deleteBtn:{
        backgroundColor: "none",
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
        padding: 4
    },
    text:{
        color: "white",
        
    }
    

    })

export default DeviceScreen