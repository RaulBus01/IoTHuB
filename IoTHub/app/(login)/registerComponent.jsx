import { View, Text, Pressable,TextInput,StyleSheet,TouchableOpacity} from 'react-native'
import { Ionicons } from '@expo/vector-icons';
import React from 'react'
import {styles} from './loginStyles.jsx'
import { auth } from '../../config';
import { createUserWithEmailAndPassword,updateProfile } from 'firebase/auth'
import Toast from 'react-native-toast-message';
import { toastConfig } from '../../toastConfig'
const registerComponent = () => {

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
          console.log(user);
          console.log(username);
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
            text2: error.message,
            autoHide: true,
          });
        }

      }


  return (
    <>
        <View style={styles.content}>
        
            <Text style={styles.textProfile}>Create a new account</Text>
       
           
            <TextInput
                style={styles.inputContainer}
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.inputContainer}
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
            />
            <View style={styles.passwordContainer}>
              <TextInput
                  title="Password"
                  placeholder='Password'
                  secureTextEntry={!isPasswordVisible}
                  style={styles.inputContainer}
                  onChangeText={(text) => setPassword(text)}
              />
              <Ionicons
                name={!isPasswordVisible ? "eye" : "eye-off"}
                size={20}
                style={styles.eyeIcon}
                onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            />
            </View>
            <View style={styles.passwordContainer}>
              <TextInput
                   title="Confirm Password"
                   placeholder='Confirm Password'
                   secureTextEntry={!isConfirmPasswordVisible}
                   style={styles.inputContainer}
                   onChangeText={(text) => setConfirmPassword(text)}
              />
              <Ionicons
                name={!isConfirmPasswordVisible ? "eye" : "eye-off"}
                size={20}
                style={styles.eyeIcon}
                onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}    
              />
            </View>



        </View>
         <TouchableOpacity style={styles.bottomButton}>
         <Pressable  style={styles.actionButton} onPress={register}>
             <Text style={styles.loginText}>Register</Text>
         </Pressable>
        </TouchableOpacity>
        <Toast config={toastConfig}/>
    </>
    
    );
}

export default registerComponent