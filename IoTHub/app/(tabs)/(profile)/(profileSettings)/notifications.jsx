import { View, Text, Switch, StyleSheet, Pressable, Platform, Modal, FlatList, StatusBar } from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import { useState, useEffect, useRef } from 'react';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Toast from 'react-native-toast-message';
import { toastConfig } from '../_layout'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});
enums = {
  '15 minutes': 15,
  '1 hour': 60,
  '2 hours': 120,
  '4 hours': 240,
  '8 hours': 480,
  '24 hours': 1440,
}
const NotificationsScreen = () => {
  const [switches, setSwitches] = useState({ push: true, silent: false });
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedNotificationTime, setSelectedNotificationTime] = useState(0);
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const [notificationTimeout, setNotificationTimeout] = useState(null);

  const toggleSwitch = (name) => {
    const newSwitchState = !switches[name];
    setSwitches({ ...switches, [name]: newSwitchState });
  
  
    if (name === 'push' && !newSwitchState) {
      setModalVisible(true);
    }
  };


  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    const notificationListener = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  }, []);
  useEffect(() => {
   
    if (selectedNotificationTime > 0) {
      const timeout = setTimeout(() => {
        setSwitches({ ...switches, push: true }); 
        setNotificationTimeout(null);
        setSelectedNotificationTime(0);
      }, selectedNotificationTime*60*1000); 
      
      setNotificationTimeout(timeout);
    }
  }, [selectedNotificationTime]);

  const toggleModal = (time) => {
    setSelectedNotificationTime(enums[time]);
    
    setModalVisible(!modalVisible);
  };


  const onPressSend = () => {
    if (switches.push) {
      schedulePushNotification();
    }
  };
  

  return (
    <View style={styles.container}>
      <Modal 
          animationType="slide"
          transparent={true}
          visible={modalVisible}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <View style={styles.modalTitle}>
                <Text style={styles.textStyle}>Push Notification disable time</Text>
              </View>
              <FlatList
                data={['15 minutes', '1 hour', '2 hours','4 hours', '8 hours','24 hours']}
                renderItem={({item}) => (
                  <Pressable onPress={() => toggleModal(item)}>
                    <View style={styles.modalButton}>
                      <Text>{item}</Text>
                    </View>
                  </Pressable>
                )}
                keyExtractor={(item, index) => index.toString()}

              />

              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(false)}
                
              >
                <Text style={styles.textStyle}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>

      <View style={styles.topButtons}>
        <View style={styles.topButtonContainer}>
          <View style={styles.buttonContent}> 
            <Ionicons style={styles.icons} name="notifications" size={24} color="black" />
            <Text>Push Notifications</Text>
          </View>
          <View style={styles.switch}>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={switches.push ? "#f5dd4b" : "#f4f3f4"}
              onValueChange={() => toggleSwitch('push')}
              value={switches.push} />
          </View>
        </View>
        
        <View style={styles.buttonConatiner}>
          <View style={styles.buttonContent}>
            <Ionicons style={styles.icons} name="notifications-off" size={24} color="black" />
            <Text>Silent Mode</Text>
          </View>
          <View style={styles.switch}>
            <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={switches.silent ? "#f5dd4b" : "#f4f3f4"}
              onValueChange={() => toggleSwitch('silent')}
              value={switches.silent} />
          </View>
        </View>
        
        <Pressable onPress={onPressSend}>
          <Ionicons name="notifications" size={24} color="black" />
          <Text>Send Notification</Text>
        </Pressable>
      </View>
      
   
      
    </View>
  );


  async function schedulePushNotification() {
    if (Platform.OS === 'android') {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "You've got mail! 📬",
        body: 'Here is the notification body',
        data: { data: 'goes here' },
      },
      trigger: { seconds: 2 },
    });
    }
    else
    {
      Toast.show({
        type: 'info',
        position:'top',
        swipeable: true,
        text1: 'Push Notifications not supported on Web',
        autoHide: true,
      })
    
    }
  }
  
  async function registerForPushNotificationsAsync() {
    let token;
  
    if (Platform.OS === 'android') 
    {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }
  
    if (Device.isDevice && Platform.OS !== 'web') 
    {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log(token);
    } 
    

  
    return token;
  }
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
      marginTop: 50,
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: '100%',
  },
  topButtonContainer:{
    borderRadius: 10,
    margin:10,
    height: '10%',
    width: '85%',
    paddingLeft: 20,
    alignItems: 'center', 
    justifyContent: 'space-between',   
    flexDirection: 'row',
    backgroundColor: 'lightblue',
  },
  buttonConatiner:
  {
    margin:10,
    borderRadius: 10,
    height: '10%',
    width: '70%',
    paddingLeft: 20,
    alignItems: 'center', 
    justifyContent: 'space-between',   
    flexDirection: 'row',
    backgroundColor: 'lightblue',
  },
  buttonContent:{
    flexDirection: 'row',
    alignItems: 'center',
  },
  switch:{
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: '5%',
  },
  icons:{
    marginRight: 10,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 // Adjusted marginTop
  },
  modalView: {
    margin: 10,
    height: 500, 
    width: 300, 
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center", 
    shadowColor: "#000",
    shadowOffset: {
      width: 1,
      height: 3
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalButton:{
    margin: 10,
    padding: 10,
    width: 200,
    borderRadius: 10,
    backgroundColor: 'lightblue',
    textAlign: 'center',
    
    alignItems: 'center',
  },
  button: {
    
    borderRadius: 20,
    padding: 10,
    elevation: 2,
    width: 100,
    margin: 10,
    alignItems: 'center',

  },
  buttonClose: {
    
  },
  textStyle: {
    
    color: "darkblue",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalTitle: {
  
    width: '100%',
    padding: 10,
    marginTop: 10,
  },
  
  
})
export default NotificationsScreen
