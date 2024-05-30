import { View, Text } from 'react-native'
import React from 'react'
import HomeScreen from './HomeScreen'


import { useNavigation } from '@react-navigation/native';

const index = () => {
  const navigation = useNavigation();

  React.useEffect(() => {
    navigation.setOptions({
      title: "Home",
      headerTintColor: "#fff",
      headerStyle: { backgroundColor: "#298ed6" },
      headerTitleAlign: "center",
    });
  }, []);

  return (
    <HomeScreen />
  )
}

export default index