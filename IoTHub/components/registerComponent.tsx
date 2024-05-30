import { View, Text, Pressable,TextInput,StyleSheet,TouchableOpacity} from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import React from 'react'
import {stylesLogin} from './loginStyles'
import { auth } from '../configFirebase'
import { createUserWithEmailAndPassword,updateProfile } from 'firebase/auth'
import Toast from 'react-native-toast-message';
import { toastConfig } from '../toastConfig.js'
const RegisterComponent = () => {

      const [username, setUsername] = React.useState('');
      const [email, setEmail] = React.useState('');
      const [password, setPassword] = React.useState('');
      const [confirmPassword, setConfirmPassword] = React.useState('');
      const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
      const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = React.useState(false);
      const register = async () => {
        if (username === '' || email === '' || password === '' || confirmPassword === '') {
          Toast.show
          ({
            type: 'error',
            text1: 'Please fill in all fields ',
            autoHide: true,
          });
          return;
        }
        if (password.length < 6) {
          Toast.show
          ({
            type: 'error',
            text1: 'Password must be at least 6 characters long',
            autoHide: true,
          });

          return;
        }
        if (password !== confirmPassword) {
          Toast.show
          ({
            type: 'error',
            text1: 'Passwords do not match',
            autoHide: true,
          });
          return;
        }
        if (!email.includes('@') || !email.includes('.')) {
          Toast.show
          ({
            type: 'error',
            text1: 'Please enter a valid email address',
            text2: 'e.g. example@domain.com',
            autoHide: true,
          });
          return;
        }
        if (username.length < 3)  {
          Toast.show
          ({
            type: 'error',
            text1: 'Username must be at least 3 characters long',
            autoHide: true,
          });
          return;
        }
        if (username.search(/[^a-zA-Z0-9]/) !== -1) {
          Toast.show
          ({
            type: 'error',
            text1: 'Username can only contain letters and numbers',
            autoHide: true,
          });
          return;
        }
        
        
       
        try {
      
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          await updateProfile(user, {
            displayName: username,
          
          });
          
          Toast.show({
            type: 'success',
            text1: 'Account created successfully',
            autoHide: true,
          });
        }
        catch (error) {
          Toast.show({
            type: 'error',
            text1: 'Oops! Something went wrong',
            autoHide: true,
          });
        }

      }


  return (
    <>
        <View style={stylesLogin.content}>
        
            <Text style={stylesLogin.textProfile}>Create a new account</Text>
       
           
            <TextInput
                style={stylesLogin.inputContainer}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={stylesLogin.inputContainer}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <View style={stylesLogin.passwordContainer}>
              <TextInput
                 
                  placeholder='Password'
                  secureTextEntry={!isPasswordVisible}
                  style={stylesLogin.inputContainer}
                  onChangeText={(text) => setPassword(text)}
              />
              <Ionicons
                name={!isPasswordVisible ? "eye" : "eye-off"}
                size={20}
                style={stylesLogin.eyeIcon}
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            />
            </View>
            <View style={stylesLogin.passwordContainer}>
              <TextInput
                 
                   placeholder='Confirm Password'
                   secureTextEntry={!isConfirmPasswordVisible}
                   style={stylesLogin.inputContainer}
                   onChangeText={(text) => setConfirmPassword(text)}
              />
              <Ionicons
                name={!isConfirmPasswordVisible ? "eye" : "eye-off"}
                size={20}
                style={stylesLogin.eyeIcon}
                onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}    
              />
            </View>
            <TouchableOpacity style={stylesLogin.bottomButton}>
         <Pressable  style={stylesLogin.actionButton} onPress={register}>
             <Text style={stylesLogin.loginText}>Register</Text>
         </Pressable>
        </TouchableOpacity>


        </View>
      
        <Toast config={toastConfig}/>
    </>
    
    );
}

export default RegisterComponent