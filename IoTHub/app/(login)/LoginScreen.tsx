import React from 'react';
import { View, Text, Pressable, SafeAreaView } from 'react-native';
import { stylesLogin } from '../../components/loginStyles';
import LoginComponent from '../../components/loginComponent';
import RegisterComponent from '../../components/registerComponent';
import { useNavigation } from 'expo-router';

const LoginScreen = () => {
  const navigation = useNavigation();
  const [isFocused, setIsFocused] = React.useState({ login: true, register: false });

  return (
    <SafeAreaView style={stylesLogin.container}>
      <View style={stylesLogin.buttonContainer}>
        <Pressable 
          style={isFocused.login ? stylesLogin.buttonLeftActive : stylesLogin.buttonLeft} 
          onPress={() => setIsFocused({ login: true, register: false })}
        >
          <Text style={stylesLogin.buttonText}>Login</Text>
        </Pressable>
        <Pressable 
          style={isFocused.register ? stylesLogin.buttonRightActive : stylesLogin.buttonRight} 
          onPress={() => setIsFocused({ login: false, register: true })}
        >
          <Text style={stylesLogin.buttonText}>Register</Text>
        </Pressable>
      </View>
      {isFocused.login ? <LoginComponent navigation={navigation} /> : <RegisterComponent />}
    </SafeAreaView>
  );
};

export default LoginScreen;
