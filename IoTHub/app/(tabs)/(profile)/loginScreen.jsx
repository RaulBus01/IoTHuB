import { View, Text, Pressable,TextInput,StyleSheet } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';

const LoginScreen = (props) => {
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [isPasswordVisible,setIsPasswordVisible] = React.useState(false)
  return (
    <View style={styles.container}>
   
    <View style = {styles.inputView}>
     <Text style={styles.textProfile}> You need to login to access your profile</Text>
     <Pressable  style ={styles.microsoftButton} >
       <Ionicons name="logo-microsoft" size={20} style={styles.logoMicrosoft}>
       </Ionicons>
       <Text style={styles.loginText}>Login with Microsoft</Text>
       
     </Pressable>
     
     <Text style={styles.textProfile}> Or </Text>
     <View style={styles.input}>
       
       <TextInput 
         title="Username" 
         placeholder='Username' 
         onChangeText={(text) => setEmail(text)}
         value={email}
         keyboardAppearance='dark'
         />
     </View>
     
     <View style={styles.input}>
       
       <TextInput title="Password"  placeholder='Password' secureTextEntry={!isPasswordVisible ? true : false}/>
       <Pressable onPress={()=>setIsPasswordVisible(!isPasswordVisible)}>
       <Ionicons name={!isPasswordVisible?"eye" : "eye-off" }  size={22}></Ionicons>
       </Pressable>
     </View>
       <Pressable onPress={()=>{props.setIsUserLoggedIn(true)}} style={styles.loginButton}>
       <Text style={styles.loginText}>Login</Text>
       </Pressable>
     </View>
 
    
 </View>
  )
}
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
      justifyContent: 'center',
      backgroundColor: "#6196A6",
    },
    microsoftButton: {
      height: 40,
      width: 220,
      borderRadius: 10,
      backgroundColor: '#67C6E3',
      flexDirection: 'row', 
      alignItems:'center',
      justifyContent: 'center',
      marginLeft: 50,
      marginVertical: 25
    },
    input: {
      height: 40,
      width: 300,
      borderRadius: 10,
      padding: 10,
      backgroundColor: 'yellow',
      flexDirection: 'row', 
      alignItems:'center',
      justifyContent: 'space-between',
      margin: 10,
    },
  
    loginButton: {
    
      height: 40,
      width: 180,
      borderRadius: 10,
      backgroundColor: '#67C6E3',
      flexDirection: 'row', 
      alignItems:'center',
      justifyContent: 'center',
      marginLeft:70,
      marginTop: 25,
  
  
   
    },
    loginText: {
      color: 'white',
      textAlign: 'center',
      fontSize: 16
    },
    logoMicrosoft: {
      paddingRight: 10,
      fontSize: 20,
      textAlign: 'center',
    }
  });

export default LoginScreen