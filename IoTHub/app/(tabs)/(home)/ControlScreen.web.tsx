import React from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Appbar, Card, Text, IconButton, Button, Switch, List } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { router } from 'expo-router';
import { auth } from '../../../configFirebase';
import io from 'socket.io-client';
import { HOST,IO_PORT,PORT } from '../../../serverconfig';

const socket = io(`http://${HOST}:${IO_PORT}`);



const ControlScreen = () => {
  const [user, setUser] = React.useState('');
  const [switchStates, setSwitchStates] = React.useState({
    lights: false,
    windows: false,
    fan: false,
  });
  const [sensorReadings, setSensorReadings] = React.useState(
    {
        gas: 0,
        co2: 0,
        tvoc: 0,
        temperature: 0,
        humidity: 0,
        timestamp: 0,
    }
  );
  const [iotResponse, setIotResponse] = React.useState('');
  React.useEffect(() => {
    socket.on('sensorReadings', (data) => {
     
      setSensorReadings(
        {
          gas: data.gas,
          co2: data.co2,
          tvoc: data.tvoc,
          temperature: data.temperature,
          humidity: data.humidity,
          timestamp: data.timestamp,
        }
      )
    });
    socket.on('iotResponse', (data) => {
      setIotResponse(data);
    });
    return () => {
      socket.off('sensorReadings');
     
    };
  }, []);
  console.log(sensorReadings);
  console.log(iotResponse);


  
  React.useEffect(() => {
    fetch(`http://${HOST}:${PORT}/invokeMethod`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        targetDevice: 'rasbperry',
        methodName: 'get_state',
        payload: 'a'
      })
    })
    .then(response => response.json())
    .then(data => {
      
      setSwitchStates({
        lights: data.payload.data[0] === 1,
        windows: data.payload.data[1] === 1,
        fan: data.payload.data[2] === 1,
      });
     
    })
    .catch((error) => {
      console.error('Error:', error);
    });
  }, []);

  React.useEffect(() => {

    setTimeout(() => {

    const user = auth.currentUser;
    

    if (user) {
      setUser(user.displayName);
    }
    else
      {
        setUser('Guest');
      }
    }, 1000);

    
      
  
  }, []);

  const navigateTo = (screen: string) => {
    router.push({ pathname: screen });
  }
  
  const handleSwitchChange = async (endpoint:string, value:boolean) =>
    {
      console.log(endpoint, value);
      setSwitchStates((prevState) => ({
        ...prevState,
        [endpoint]: value,
      }));
  
      fetch(`http://${HOST}:${PORT}/invokeMethod`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          targetDevice: 'rasbperry',
          methodName: endpoint,
          payload: {
            value
          }
        })
      }).then
      (response => response.json())
      .then(data => {
        
      })
      .catch((error) => {
        
      });

    }
    React.useEffect(() => {
   
      socket.on('deviceState', (data) => {
        console.log(data);
        setSwitchStates({
          lights: data.payload.data[0] === 1,
          windows: data.payload.data[1] === 1,
          fan: data.payload.data[2] === 1,
        });
       
      })
      return () => {
        socket.off('deviceState');
      }
     
    }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.mainContent}>
          <View style={styles.greeting}>
            <Text style={styles.greetingText}>Hello, <Text style={styles.greetingName}>{user}</Text></Text>
        
          </View>
          <View style={styles.controlSection}>
            
            
            <View style={styles.temperatureControl}>
            <Text style={styles.roomTemperature}>Room Temperature</Text>
              <View style={styles.temperatureDial}>
                
                <Text style={styles.temperatureValue}>{sensorReadings.temperature}°C</Text>
               
              </View>
            </View>
            <View style={styles.temperatureControl}>
              <Text style={styles.roomTemperature}>Room Humidity</Text>
              <View style={styles.temperatureDial}>
                  
                  <Text style={styles.temperatureValue}>{sensorReadings.humidity}%</Text>
              </View>
              
            </View>
           
           
            
          </View>
          <View style={styles.quickActions}>
            {[
              { icon: 'monitor-dashboard', label: 'Dashboard',screen: 'Dashboard' },
              { icon: 'text-to-speech', label: 'Speech-to-Text',screen:'TranscribeText' },
              { icon: 'home-import-outline', label: 'Back home',screen:'HomeScreen' },
            ].map((item, index) => (
              <Button key={index} mode="contained" style={styles.quickActionButton} icon={item.icon}
                onPress={() => navigateTo(item.screen)}
              >
                {item.label}
              </Button>
            ))}
          </View>
        </View>
        <View style={styles.shortcutSection}>
         
           
          <View style={styles.deviceCard}>
            
            <Text style={styles.deviceTitle}>Devices</Text>
            {[
              { icon:'lightbulb-on-outline',label: 'Lights',endpoint: 'lights' },
              { icon: 'window-closed-variant',label: 'Windows', endpoint: 'windows'},
              { icon:'fan', label: 'Fan',  endpoint: 'fan'},
            ].map((item, index) => (
              <View key={index} style={styles.devicesContainer}>
                <Icon name={item.icon || ''} size={30} color="#6200EE" />
                <List.Item
                  key={index}
                  title={item.label}
                  right={() => (

                    <Switch
                    style={styles.switch}
                  value={switchStates[item.endpoint]}
                  onValueChange={(value) => handleSwitchChange(item.endpoint, value)}
                />
                  )}
                  style={styles.deviceItem}
                />
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },

  header: {
    backgroundColor: '#2f95dc',
  },
  switch:{
    marginLeft: 20,
  },
  devicesContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      width: '100%',
     
   
  },
  scrollContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 16,
  },
  sideNav: {
    width: 80,
    backgroundColor: '#6200EE',
    borderRadius: 15,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  navButton: {
    padding: 10,
  },
  logoutButton: {
    padding: 10,
  },
  mainContent: {
    flex: 1,
    marginLeft: 16,
  },
  greeting: {
    marginBottom: 20,
  },
  greetingText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  greetingName: {
    color: '#6200EE',
  },
  roomTemperature: {
    textAlign: 'center',
    fontSize: 16,
    color: '#666',
  },
  controlSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    marginBottom: 20,
  },
  temperatureControl: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  temperatureDial: {
    width: 100,
    height: 100,
    borderRadius: 50,
    margin: 10,
    alignContent: 'center',
    
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  temperatureValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  modeControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  modeButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
  },
  modeLabel: {
    marginTop: 8,
    fontSize: 12,
    color: '#666',
  },
  scheduleControl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  scheduleLabel: {
    fontSize: 16,
    color: '#666',
  },
  scheduleValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickActionButton: {
    flex: 1,
    margin: 4,
  },
  shortcutSection: {
    width: 240,
    marginLeft: 16,
  },
  shortcutCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 16,
    marginBottom: 20,
  },
  shortcutTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  shortcutItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  shortcutLabel: {
    fontSize: 16,
    color: '#666',
  },
  shortcutValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  deviceCard: {
    backgroundColor: '#fff',
    marginTop: 50,
    borderRadius: 15,
    padding: 16,
    height: 290
  },
  deviceTitle: {
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    marginBottom: 16,
  },
  deviceItem: {
    marginBottom: 10,
  },
});

export default ControlScreen;