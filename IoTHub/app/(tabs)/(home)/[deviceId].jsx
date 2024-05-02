import { View, Text } from 'react-native'
import React, { useLayoutEffect } from 'react'
import { useLocalSearchParams } from 'expo-router';
import { useNavigation } from 'expo-router';

const DeviceDetails = () => {
    const navigation = useNavigation();
    const {name,type} = useLocalSearchParams();
    useLayoutEffect(() => {
        navigation.setOptions({
          title: `Details  ${name}`,
        });

      }, []);
  return (
    <View >
        <Text>Device Details</Text>
        <Text>{name}</Text>
        <Text>{type}</Text>

        
    </View>
  )
}

export default DeviceDetails