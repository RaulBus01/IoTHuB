import { View, Text, Pressable} from 'react-native'
import React from 'react'
import {styles} from './loginStyles';

import LoginComponent from './loginComponent';
import RegisterComponent from './registerComponent';
import { SafeAreaView } from 'react-native-safe-area-context';




const LoginScreen = () => {


   
    const [isFocused, setIsFocused] = React.useState({login:true,register:false});

  return (
    <SafeAreaView style={styles.container}>
    
        <View style={styles.buttonContainer}>
          <Pressable style={isFocused.login ? styles.buttonLeftActive: styles.buttonLeft} onPress={()=>setIsFocused({login:true,register:false})}>
              <Text style={styles.buttonText}>Login</Text>
          </Pressable>
          <Pressable style={isFocused.register ? styles.buttonRightActive : styles.buttonRight} onPress={() => setIsFocused({login: false, register: true})}>
              <Text style={styles.buttonText}>Register</Text>
          </Pressable>
        </View>
       
        {isFocused.login ? <LoginComponent/>: isFocused.register ? <RegisterComponent/> : null}
      
      


       
      
    </SafeAreaView>
 
  );
  
}


export default LoginScreen