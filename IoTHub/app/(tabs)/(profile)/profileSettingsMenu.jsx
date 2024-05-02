import { View, Text,ScrollView, Pressable,StyleSheet } from 'react-native'
import React from 'react'
import { Ionicons as IonIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { auth } from '../../../config';
import { signOut } from 'firebase/auth';


const ProfileSettingsMenu = () => {
    function routeToAccountSettings() {
        router.push({ pathname:'/(tabs)/(profile)/(profileSettings)/accountSettings'})
    }
    function routeToNotifications() {
        router.push({ pathname:'/(tabs)/(profile)/(profileSettings)/notifications'})
    }
    function routeToPrivacy() {
        router.push({ pathname:'/(tabs)/(profile)/(profileSettings)/privacy'})
    }
    function routeToSecurity() {
        router.push({ pathname:'/(tabs)/(profile)/(profileSettings)/security'})
    }
    const handleSignOut = async () => {
        
        await signOut(auth);
        router.push({ pathname:'/(login)'})
    }
    


       
  
    
  return (
    <View>
        <View style={styles.topContainer}>
           
            <Text style={[styles.textProfile, { textAlign: 'right' }]}>

            Hello, {auth.currentUser.displayName}
            </Text>
            <IonIcons style={styles.icons} name="person-circle" size={34} color="black" />
        </View>
        <ScrollView contentContainerStyle={styles.container}>
       
        <View style={styles.topButtons}>
            <Pressable style={styles.buttons} onPress={routeToAccountSettings} >
                <IonIcons style={styles.icons} name="person" size={24} color="black" />
                <Text style={styles.textProfile}>Account Settings</Text>
            </Pressable>
       
            <Pressable style={styles.buttons} onPress={routeToNotifications}> 
                <IonIcons style={styles.icons} name="notifications" size={24} color="black" />
                <Text style={styles.textProfile}>Notifications</Text>
            </Pressable>
       
            <Pressable style={styles.buttons} onPress={routeToPrivacy}>
                <IonIcons style={styles.icons} name="lock-closed" size={24} color="black" />
                <Text style={styles.textProfile}>Privacy</Text>
            </Pressable>
          
            <Pressable style={styles.buttons} onPress={routeToSecurity}>
                <IonIcons style={styles.icons} name="shield-checkmark" size={24} color="black" />
                <Text style={styles.textProfile}>Security</Text>
            </Pressable >
    
            
   
        </View>
        <View style={styles.bottomButton}>
            <Pressable style={styles.signOutButton} onPress={handleSignOut}>
                <IonIcons style={styles.icons} name="log-out" size={24} color="white" />
                <Text style={styles.textProfile}>Sign Out</Text>
            </Pressable>
        </View>
    </ScrollView>
    </View>
  )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: "aliceblue",
        paddingTop: 10,
        textAlign: 'center',
        width: '100%',
    },
    topButtons: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
    },
    bottomButton: {
        width: '100%',
        marginBottom: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttons:{
        borderRadius: 10,
        height: '10%',
        width: 360,
        paddingHorizontal: '15%',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: 'lightblue',
        margin: 20,
        
    },
    signOutButton: {
        borderRadius: 10,
        width: 360,
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'coral',
        marginBottom: 10,
    },
    icons: {
        marginHorizontal: 10,
    },
    textProfile:
    {
        fontSize: 18,
        color :'#496989',
        marginVertical:5
    },
    topContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        width: '100%',
        padding: 10,
    },
   

})

export default ProfileSettingsMenu