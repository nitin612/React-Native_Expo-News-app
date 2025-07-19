import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

// Import your screens
import AppNavigator from '../Routes/Navigation'; // Your existing stack navigator
import CryptoCurrencyScreen from '../screens/CryptoCurrecyScreen/index';
import AppleScreen from "../screens/AppleScreen/index";
import BusinessScreen from "../screens/BussinessScreen/index";
import TechScreen from "../screens/TechScreen/index";
import TeslaScreen from "../screens/TeslaScreen/index";
import WallStreetScreen from "../screens/WallStreetScreen/index";

const Drawer = createDrawerNavigator();

// Custom Drawer Content
const CustomDrawerContent = (props) => {
  const { navigation } = props;
  
  const menuItems = [
    { name: 'Home', icon: 'home-outline', screen: 'HomeStack' },
    { name: 'Cryptocurrency', icon: 'logo-bitcoin', screen: 'Cryptocurrency' },
    { name: 'Apple', icon: 'logo-apple', screen: 'Apple' },
    { name: 'Business', icon: 'business-outline', screen: 'Business' },
    { name: 'Technology', icon: 'hardware-chip-outline', screen: 'Tech' },
    { name: 'Tesla', icon: 'car-outline', screen: 'Tesla' },
    { name: 'Wall Street', icon: 'trending-up-outline', screen: 'WallStreet' },
  ];

  return (
    <View style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerTitle}>News Categories</Text>
        <Text style={styles.drawerSubtitle}>Choose your interest</Text>
      </View>
      
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={styles.menuItem}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Ionicons name={item.icon} size={24} color="#007AFF" />
            <Text style={styles.menuText}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="HomeStack"
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#fff',
          width: 280,
        },
        drawerActiveTintColor: '#007AFF',
        drawerInactiveTintColor: '#8e8e93',
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      {/* Home Stack (includes HomeScreen and ArticleDetailScreen) */}
      <Drawer.Screen 
        name="HomeStack" 
        component={AppNavigator}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="home-outline" size={24} color={color} />
          ),
        }}
      />
      
      {/* Other category screens */}
      <Drawer.Screen 
        name="Cryptocurrency" 
        component={CryptoCurrencyScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="logo-bitcoin" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Apple" 
        component={AppleScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="logo-apple" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Business" 
        component={BusinessScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="business-outline" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Tech" 
        component={TechScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="hardware-chip-outline" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Tesla" 
        component={TeslaScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="car-outline" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="WallStreet" 
        component={WallStreetScreen}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="trending-up-outline" size={24} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  drawerHeader: {
    backgroundColor: '#f8f9fa',
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e9ecef',
  },
  drawerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1c1c1e',
    marginBottom: 5,
  },
  drawerSubtitle: {
    fontSize: 16,
    color: '#8e8e93',
  },
  menuContainer: {
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f2f2f7',
  },
  menuText: {
    fontSize: 16,
    color: '#1c1c1e',
    marginLeft: 15,
    fontWeight: '500',
  },
});