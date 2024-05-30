import { View, Text,TextInput, Pressable } from 'react-native'
import React from 'react'
import { useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { stylesProfile } from '../profileStyles';
import { reauthenticateWithCredential, updatePassword,EmailAuthProvider } from 'firebase/auth';
import Toast from 'react-native-toast-message';
import { auth } from '../../../../configFirebase';
import { toastConfig } from '../../../../toastConfig';



const Security = () => {
  const [password, setPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleChangePassword = async () => {
    if (password === '' || newPassword === '') {
      Toast.show({
        type: 'error',
        text1: 'Please fill in all fields',
        autoHide: true,
      });
      return;
    }
  
    if (newPassword.length < 6) {
      Toast.show({
        type: 'error',
        text1: 'Password must be at least 6 characters long',
        autoHide: true,
      });
      return;
    }
  
    const user = auth.currentUser;
  
    const credentials = {
      email: user?.email,
      password: password,
    };
  
    try {
      if (!user) {
        throw new Error('User is null');
      }
      await reauthenticateWithCredential(
        user,
        EmailAuthProvider.credential(credentials.email || '', credentials.password)
      );
      await updatePassword(user, newPassword);
      Toast.show({
        type: 'success',
        text1: 'Password Changed Successfully',
        autoHide: true,
      });
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Oops! Something went wrong',
        autoHide: true,
      });
    }
  };
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isNewPasswordVisible, setIsNewPasswordVisible] = useState(false);

  
  

  return (
    <View style={stylesProfile.container}>
      <View style={stylesProfile.content}>
        <Text style={stylesProfile.textProfile}>Change Password</Text>
        <View style={stylesProfile.passwordContainer}>
          <TextInput
            
            placeholder='Password'
            secureTextEntry={!isPasswordVisible}
            style={stylesProfile.inputContainer}
            onChangeText={(text) => setPassword(text)}
          />
          <Ionicons
            name={!isPasswordVisible ? "eye" : "eye-off"}
            size={20}
            style={stylesProfile.eyeIcon}
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
          />
        </View>
        <View style={stylesProfile.passwordContainer}>
          <TextInput
            
            placeholder='New Password'
            secureTextEntry={!isNewPasswordVisible}
            style={stylesProfile.inputContainer}

            onChangeText={(text) => setNewPassword(text)}
          />
          <Ionicons
            name={!isNewPasswordVisible ? "eye" : "eye-off"}
            size={20}
            style={stylesProfile.eyeIcon}
            onPress={() => setIsNewPasswordVisible(!isNewPasswordVisible)}
          />
        </View>

        <Pressable style={newPassword.length > 0 ? stylesProfile.actionButton: stylesProfile.actionButtonDisabled} onPress={handleChangePassword}>
          <Text style={stylesProfile.buttonText}>Save</Text>
        </Pressable>
        
        
      </View>
      <Toast config={toastConfig} />
    </View>
 
);
}




export default Security