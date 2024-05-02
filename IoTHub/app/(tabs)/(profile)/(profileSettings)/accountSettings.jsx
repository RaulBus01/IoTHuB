import { View, Text,StyleSheet,TextInput, Pressable } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';
import { toastConfig } from '../_layout'
const AccountSettings = () => {
    
    const [email, setEmail] = React.useState('johndoe@example.com');
    const [username, setUsername] = React.useState('JohnDoe');
    const [newUsername, setNewUsername] = React.useState('');
    const [newEmail, setNewEmail] = React.useState('');
    const [isUsernameEditable, setIsUsernameEditable] = React.useState(false)
    const [isEmailEditable, setIsEmailEditable] = React.useState(false)
  
    const handleSaveChanges = () => {
      if(isEmailEditable)
      {
        if(newEmail !== '')
        {
          if(newEmail.includes('@') && newEmail.includes('.') && newEmail.length > 5)
          {
            if(email !== newEmail)
            {
              setEmail(newEmail);
              setIsEmailEditable(!isEmailEditable);
              Toast.show({
                type: 'success',
                text1: 'Email Changed Successfully',
                autoHide: true,
                })
            }
            else
            {
              Toast.show({
                type: 'error',
                text1: 'Email is already the same as the current one',
                autoHide: true,
                })
            }
          }
          else
          {
            Toast.show({
              type: 'error',
              text1: 'Please enter a valid email address (e.g. abc@a.co)',
              autoHide: true,
              text1Style: {fontSize: 14, color: 'white'}
              })
          }
        }
        else
        {
          Toast.show({
            type: 'error',
            text1: 'Email cannot be empty',
            autoHide: true,
            })
        }

      }
      else
      {
        

      if(isUsernameEditable)
      {
        if(newUsername !== '')
        {
         if(username !== newUsername)
         {
           setUsername(newUsername);
           setIsUsernameEditable(!isUsernameEditable);
           
           Toast.show({
            type: 'success',
            text1: 'Username Changed Successfully',
            autoHide: true,
           })

        
          
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
      
      }
        
      


    };
    return (
      <>
    
      <View style={styles.container}>
       
            <View style = {styles.inputView}>
              
              <Text style={styles.textProfile}>Email </Text>
            <View style={styles.input}>
              <TextInput 
                title="Username" 
                placeholder={email}
                onChangeText={(text) => setNewEmail(text)}
                editable={isEmailEditable}
                style={styles.inputArea}
                />
                <Pressable >
                    {!isEmailEditable & !isUsernameEditable ? <Ionicons style={styles.logo} name="pencil" size={18} color="black" onPress={()=>setIsEmailEditable(!isEmailEditable)}/> : <Text></Text>}
                </Pressable>
            </View>
              <Text style={styles.textProfile}>Username </Text>
              <View style={styles.input}>
                <TextInput 
                  title="Username" 
                  placeholder={username}
                  onChangeText={(text) => setNewUsername(text)}
                  editable={isUsernameEditable}
                  style={styles.inputArea}
                  />
                  <Pressable >
                    {!isUsernameEditable & !isEmailEditable ? <Ionicons  style={styles.logo}name="pencil" size={18} color="black" onPress={()=>setIsUsernameEditable(!isUsernameEditable)}/> : <Text></Text>}
                  </Pressable>
                </View>
                <View style={styles.bottomButton}>
                  <Pressable disabled={isUsernameEditable | isEmailEditable ? false:true}style={isUsernameEditable | isEmailEditable? styles.saveButtonActive:styles.saveButtonDisabled} onPress={handleSaveChanges}>
                  <Text style={styles.loginText}>Save</Text>
                  </Pressable>
                </View>
              
            </View>
            
            
          </View>
          <Toast config={toastConfig}/>
      </>
 
    );

  };
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      backgroundColor: "aliceblue",
      alignContent: 'center',
      justifyContent: 'center',
      paddingTop: 10,
      textAlign: 'center',
      width: '100%',
    },
    textProfile:
    {
      width: 220,
      borderRadius: 10,
      textAlign: 'center',
      fontSize: 18,
      color: 'white',
      marginLeft: 50,
      marginVertical:5
    },
    
    inputView: {
      margin: 10,
      padding: 10,
      borderRadius: 15,
      height: 400,
      alignItems: 'flex-start',
      backgroundColor: "#6196A6",
      
    },
    input: {
      height: 50,
      width: 300,
      borderRadius: 10,
      backgroundColor: '#F7EEDD',
      flexDirection: 'row', 
      alignItems:'center',
      justifyContent: 'space-between',
      margin: 10,
    },
    inputArea:{
      width:'85%',
      marginLeft: 10,
      borderRadius: 10,
      height: 40,
      color: '#496989',
    },
  
    saveButtonActive: {
      
      height: 40,
      width: 180,
      borderRadius: 10,
      backgroundColor: '#67C6E3',
      flexDirection: 'row', 
      alignItems:'center',
      justifyContent: 'center',
      marginLeft:70,
      marginBottom: 10,
      marginTop: 20,
    },
    saveButtonDisabled: {
      height: 40,
      width: 180,
      borderRadius: 10,
      backgroundColor: 'grey',
      flexDirection: 'row', 
      alignItems:'center',
      justifyContent: 'center',
      marginLeft:70,
      marginBottom: 10,
      marginTop: 20,
    },
    loginText: {
      color: 'white',
      textAlign: 'center',
      fontSize: 16
    },
    logo: {
      paddingRight: 10,
      textAlign: 'center',
    }
  });
  
  export default AccountSettings;


