import { View, Text, Pressable,TextInput,StyleSheet,TouchableOpacity, Platform} from 'react-native'
import React from 'react'
import { signInWithEmailAndPassword,GoogleAuthProvider,signInWithPopup,sendPasswordResetEmail } from 'firebase/auth'
import {styles} from './loginStyles.jsx'

import { Ionicons } from '@expo/vector-icons';
import { auth,app } from '../../config.js';
import Toast from 'react-native-toast-message';
import { toastConfig } from '../../toastConfig'
const loginComponent = () => {
    
      
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

  
  const handleLogin = () => {
   
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
       
        const user = userCredential.user;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });

  }
  const handleGoogleLogin = () => {
    
    const provider = new GoogleAuthProvider();
    if (Platform.OS === 'web')
      {
      signInWithPopup(auth, provider)
        .then((result) => {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          const token = credential.accessToken;
          const user = result.user;
          console.log(token, user);
        }).catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          const email = error.email;
          const credential = GoogleAuthProvider.credentialFromError(error);
          console.log(errorCode, errorMessage, email, credential);
        });
      }

  }
  const handleForgotPassword = () => {
    if (email === '') {
      Toast.show({
        type: 'error',
        text1: 'Please enter your email address ',
        autoHide: true,
      });
      return;
    }
    sendPasswordResetEmail(auth, email)
      .then(() => {
        Toast.show({
          type: 'success',
          text1: 'Password reset email sent',
          autoHide: true,
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  }
  const handlePasswordChange = (text) => {
    if (text.length > 0) {
      text = text.slice(0, -1) + '*';
    }
    setPassword(text);
  };

   



  

        
        
        
  return (
    <>
    
    <View style={styles.content}>
          <Text style={styles.textProfile}> You need to login to access your profile</Text> 
          { Platform.OS === 'web' ?
          <>
          <Pressable  style ={styles.googleButton} onPress={handleGoogleLogin}>
            <Ionicons name="logo-google" size={20} style={styles.logoGoogle}>
            </Ionicons>
            <Text style={styles.loginText}>Log In with Google</Text>
            
          </Pressable>
          
          <Text style={styles.textProfile}> Or </Text>
          </>
          :
          null}  
          <TextInput title="Email" placeholder='Email' onChangeText={(text) => setEmail(text)}value={email} style={styles.inputContainer}/>
          
          
       
            
          <View style={styles.passwordContainer}>
            <TextInput
              title="Password"
              placeholder='Password'
              secureTextEntry={!isPasswordVisible}
              style={styles.inputContainer}
              onChangeText={handlePasswordChange}
            />
            <Ionicons
                name={!isPasswordVisible ? "eye" : "eye-off"}
                size={20}
                style={styles.eyeIcon}
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            />
          </View>
            
            
          
          <View style={styles.linkContainer}>
              <Pressable style={styles.forgotPasswordLink} onPress={handleForgotPassword}>
                  <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </Pressable>
          </View>
          
          
    </View>
    <View style={styles.bottomButton}>
            <Pressable onPress={handleLogin} style={styles.actionButton}>
                  <Text style={styles.loginText}>Login</Text>
            </Pressable>
    </View>
    <Toast config={toastConfig}/>
    </>
    
    );
}

export default loginComponent