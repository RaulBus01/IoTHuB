import { View, Text,StyleSheet,TextInput, Pressable } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { toastConfig } from '../../../../toastConfig'
import { auth } from '../../../../configFirebase';
import { updateEmail, updateProfile } from 'firebase/auth';
import { stylesProfile } from '../profileStyles';
const AccountSettings = () => {
    
    
  
    const [username, setUsername] = React.useState('JohnDoe');
    const [newUsername, setNewUsername] = React.useState('');
    const [isUsernameEditable, setIsUsernameEditable] = React.useState(false)
    const [email, setEmail] = React.useState('');
    React.useEffect(() => {
      const user = auth.currentUser;
      if (user) {
        setEmail(user.email || ''); 
        setUsername(user.displayName || '');
    
      }
    }, []);
    
    const handleSaveChanges =  async() => {
      if(isUsernameEditable)
      {
        if(newUsername !== '')
        {
         if(username !== newUsername)
         {
          if (auth.currentUser) {
            await updateProfile(auth.currentUser, {
              displayName: newUsername,
            }).then(() => {
              Toast.show({
                type: 'success',
                text1: 'Username Changed Successfully',
                autoHide: true,
              });
            });
          }

        
          
         }
        
         else 
          {
            Toast.show({
              type: 'error',
              text1: 'Username is already the same as the current one',
              autoHide: true,
             })
          
              

          }
        }
        else
        {
          Toast.show({
            type: 'error',
            text1: 'Username cannot be empty',
            autoHide: true,
           })

        }
      }
      
      
        
      


    };
    return (
      <>
        <View style={stylesProfile.container}>
          <View style={stylesProfile.content}>
            <Text style={stylesProfile.textProfile}>Email </Text>
            <View style={stylesProfile.passwordContainer}>
              <TextInput
                
                placeholder={email}
               
                style={stylesProfile.inputContainer}
              
              />
             
            </View>
            <Text style={stylesProfile.textProfile}>Username </Text>
            <View style={stylesProfile.passwordContainer}>
              <TextInput
               
                placeholder={username}
                style={stylesProfile.inputContainer}
                onChangeText={(text) => setNewUsername(text)}
                editable={isUsernameEditable}
              />
              <Ionicons
                name={!isUsernameEditable? "pencil" : "text"} 
                size={20}
                style={stylesProfile.eyeIcon}
                onPress={() => setIsUsernameEditable(!isUsernameEditable)}  
              />
            </View>
         
              <Pressable
                disabled={isUsernameEditable ? false : true}
                style={
                  isUsernameEditable
                    ? stylesProfile.actionButton
                    : stylesProfile.actionButtonDisabled
                }
                onPress={handleSaveChanges}
              >
                <Text style={stylesProfile.loginText}>Save</Text>
              </Pressable>
            
          </View>
        </View>
        <Toast config={toastConfig} />
      </>
    );

  };

  export default AccountSettings;


