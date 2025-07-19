import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/ThemeContext';

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
  const { colors, isDarkMode, toggleTheme } = useTheme();
  
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
    <View style={[styles.drawerContainer, { backgroundColor: colors.background }]}>
      <View style={[styles.drawerHeader, { 
        backgroundColor: colors.cardBackground,
        borderBottomColor: colors.border 
      }]}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.drawerTitle, { color: colors.primary }]}>
              News Categories
            </Text>
            <Text style={[styles.drawerSubtitle, { color: colors.secondary }]}>
              Choose your interest
            </Text>
          </View>
          
          {/* Theme Toggle Button */}
          <TouchableOpacity
            style={[styles.themeToggle, { backgroundColor: colors.border }]}
            onPress={toggleTheme}
          >
            <Ionicons 
              name={isDarkMode ? "sunny" : "moon"} 
              size={20} 
              color={colors.primary} 
            />
          </TouchableOpacity>
        </View>
      </View>
      
      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.menuItem, { borderBottomColor: colors.border }]}
            onPress={() => navigation.navigate(item.screen)}
          >
            <Ionicons name={item.icon} size={24} color={colors.accent} />
            <Text style={[styles.menuText, { color: colors.primary }]}>
              {item.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Footer */}
      <View style={[styles.drawerFooter, { borderTopColor: colors.border }]}>
        <Text style={[styles.footerText, { color: colors.secondary }]}>
          {isDarkMode ? 'Dark Mode' : 'Light Mode'}
        </Text>
      </View>
    </View>
  );
};

// Wrapper components for screens to pass theme
const ThemedScreen = (ScreenComponent) => {
  return (props) => {
    const theme = useTheme();
    return <ScreenComponent {...props} theme={theme} />;
  };
};

export default function DrawerNavigator() {
  const { colors } = useTheme();
  
  return (
    <Drawer.Navigator
      initialRouteName="HomeStack"
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: colors.background,
          width: 280,
        },
        drawerActiveTintColor: colors.accent,
        drawerInactiveTintColor: colors.secondary,
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
      
      {/* Other category screens with theme support */}
      <Drawer.Screen 
        name="Cryptocurrency" 
        component={ThemedScreen(CryptoCurrencyScreen)}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="logo-bitcoin" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Apple" 
        component={ThemedScreen(AppleScreen)}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="logo-apple" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Business" 
        component={ThemedScreen(BusinessScreen)}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="business-outline" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Tech" 
        component={ThemedScreen(TechScreen)}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="hardware-chip-outline" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="Tesla" 
        component={ThemedScreen(TeslaScreen)}
        options={{
          drawerIcon: ({ color }) => (
            <Ionicons name="car-outline" size={24} color={color} />
          ),
        }}
      />
      <Drawer.Screen 
        name="WallStreet" 
        component={ThemedScreen(WallStreetScreen)}
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
  },
  drawerHeader: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  drawerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 5,
  },
  drawerSubtitle: {
    fontSize: 16,
  },
  themeToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuContainer: {
    flex: 1,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  menuText: {
    fontSize: 16,
    marginLeft: 15,
    fontWeight: '500',
  },
  drawerFooter: {
    borderTopWidth: 1,
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
  },
});