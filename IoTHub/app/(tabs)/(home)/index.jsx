import { View, Text,StyleSheet, Pressable, ScrollView, FlatList } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import Device from './Device'
const HomeScreen = () => {
  const Devices = {
    device1 : {
        name: "Device 1",
        type: "Light",
        status: "On",
        location: "Living Room",
        id: 1
    },
    device2 : {
        name: "Device 2",
        type: "Light",
        status: "Off",
        location: "Bedroom",
        id: 2
    }
};

  const [deviceList, setDeviceList] = React.useState(Devices)
  const [nextId, setNextId] = React.useState(Object.keys(Devices).length + 1);

  function deleteDevice(key){
    const newList = {...deviceList}
    delete newList[key]
    setDeviceList(newList)
   
  }
  function addDevice(){
    const newList = {...deviceList}
    const newKey = "device" + nextId
    newList[newKey] = {name:"!23", type:"Light", status:"On", location:"Living Room", id: nextId}
    setDeviceList(newList)
    setNextId(nextId + 1)
    
  }
  return (
   
      <FlatList 
        contentContainerStyle={{alignItems: "center",padding: 10,}}
        data={Object.keys(deviceList)}
        renderItem={({item: key}) => (
          <View>
            <Pressable>
              <Device name={deviceList[key].name} type={deviceList[key].type}  deleteDevice={()=>deleteDevice(key)}/>
            </Pressable>
          </View>
        )}
        keyExtractor={key => deviceList[key].id.toString()} 
        numColumns={2}
        key={2}
        ListHeaderComponent={
          <Pressable style={styles.pressAdd} onPress={addDevice}>
            <Text> Add Device </Text>
            <Ionicons name="add-circle" size={22}></Ionicons>
          </Pressable>
        }
      />

       

        
 
  )
}
const styles = StyleSheet.create({
  default: {
  borderRadius: 10,
  backgroundColor: "none",
  padding: 10,
  margin: 5,
  alignContent: "center",
  justifyContent: "center",
  alignItems: "center",

  },
  pressAdd:{
    backgroundColor: "white",
    padding: 10,
    margin: 10,
    borderRadius: 10,
    ontouchmove: "none",
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: 200,
  },

  

  })

export default HomeScreen