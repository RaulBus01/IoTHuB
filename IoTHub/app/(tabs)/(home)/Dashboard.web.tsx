import { router } from 'expo-router';
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Appbar, Card, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import io from 'socket.io-client';
import { HOST, IO_PORT } from '../../../serverconfig';

const Dashboard = () => {
  const [activeTab, setActiveTab] = React.useState('Now');
  const [sensorReadings, setSensorReadings] = React.useState({
    gas: '',
    co2: 0,
    tvoc: 0,
    temperature: 0,
    humidity: 0,
    timestamp: 0,
    airquality: '',
    connection: false,
  });
  const [iotResponse, setIotResponse] = React.useState('');
  const handleTabChange = (tab: string) => {
  
    setActiveTab(tab);

  };
  React.useEffect(() => {
   
    const socket = io(`http://${HOST}:${IO_PORT}`);
    socket.on('sensorReadings', (data) => {
     
      setSensorReadings(
        {
          gas: data.gas > 500 ? 'High' : 'Low',
          co2: data.co2,
          tvoc: data.tvoc,
          temperature: data.temperature,
          humidity: data.humidity,
          timestamp: data.timestamp,
          airquality: data.gas > 500 ? 'Low' : 'High',
          connection: true,
        }
      )
    });
    socket.on('iotResponse', (data) => {
      setIotResponse(data);
    });
    return () => {
      socket.off('sensorReadings');
      socket.off('iotResponse');
    };
  }, []);
 
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.tabContainer}>
            {['Now', 'Last Week', 'Last Month'].map((tab, index) => (
              <Text
                key={index}
                style={[styles.tab, tab === activeTab && styles.activeTab]}
                onPress={() => handleTabChange(tab)}
              >
                {tab}
              </Text>
            ))}
          </View>
        <View style={styles.grid}>
          {
          [
            { label: 'Temp', value: `${sensorReadings.temperature}°C`, icon: 'chart-line' },
            { label: 'Humidity', value: `${sensorReadings.humidity}%`, icon: 'water' },
            activeTab === 'Now' ? {}:{ label: 'L. Temp', value: '14°', icon: 'chart-line' },
            { label: 'Air Quality', value: `${sensorReadings.gas}`, icon: 'air-filter'},
            { label: 'Gas Concentration', value: `${sensorReadings.airquality}`, icon: 'gas-cylinder'}
          ].map((item, index) => (
            item.label ? 
            <Card key={index} style={styles.card}>
                <Card.Content>
                  
        
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.value}>{item.value}</Text>
                <Icon name={item.icon} size={24} color={"gray"} />
                { (
                  <View style={styles.offlineContainer}>
                   <Icon name={sensorReadings.connection ? "wifi" :"wifi-off"} size={16} color="blue" />
                    <Text style={styles.offlineText}>{sensorReadings.connection ? 'Online': 'Offline'}</Text>
                  </View>
                )}
                
             

              </Card.Content> 
              
              
            </Card>
            : null
          ))}
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
  scrollContainer: {
    padding: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  tab: {
    fontSize: 16,
    color: 'gray',
  },
  activeTab: {
    color: 'blue',
    fontWeight: 'bold',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: '48%',
    marginBottom: 16,
  },
  label: {
    fontSize: 18,
    color: 'gray',
  },
  value: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  offlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  offlineText: {
    marginLeft: 4,
    color: 'gray',
  },
});

export default Dashboard;
