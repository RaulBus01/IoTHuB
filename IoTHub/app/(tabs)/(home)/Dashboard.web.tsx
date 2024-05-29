import { router } from 'expo-router';
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Appbar, Card, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Dashboard = () => {
  const [activeTab, setActiveTab] = React.useState('Now');

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);

  };

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
          {[
            { label: 'Temp', value: '23°', icon: 'chart-line' },
            { label: 'Humidity', value: '92%', icon: 'water' },
            { label: 'L. Temp', value: '14°', icon: 'chart-line' },
            { label: 'Air Quality', value: 'Good', icon: 'air-filter'},
            { label: 'Gas Concentration', value: 'Low', icon: 'gas-cylinder'}
          ].map((item, index) => (
            <Card key={index} style={styles.card}>
              <Card.Content>
                <Text style={styles.label}>{item.label}</Text>
                <Text style={styles.value}>{item.value}</Text>
                <Icon name={item.icon} size={24} color={"gray"} />
                { (
                  <View style={styles.offlineContainer}>
                    <Icon name="wifi-off" size={16} color="gray" />
                    <Text style={styles.offlineText}>Offline</Text>
                  </View>
                )}
              </Card.Content>
            </Card>
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
