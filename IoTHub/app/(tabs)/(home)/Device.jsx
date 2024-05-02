import { View, Text,StyleSheet,Image, Pressable } from 'react-native'
import React from 'react'
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const Device = (props) => {
  
  
  function routeToDetails() {
    console.log(props.name)
    router.push({ pathname:'/(tabs)/(home)/[deviceId]', params:{name: props.name, type: props.type}})
  }
  return (
    <View style={styles.default}>
        <Pressable onPress={routeToDetails} style={({pressed})=> !pressed ? styles.pressable : styles.pressed}>
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
    ontouchmove: "none",
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

export default Device