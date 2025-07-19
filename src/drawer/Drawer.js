import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../utils/ThemeContext';

// Import your screens
import AppNavigator from '../Routes/Navigation';
import CryptoCurrencyScreen from '../screens/CryptoCurrecyScreen/index';
import AppleScreen from "../screens/AppleScreen/index";
import BusinessScreen from "../screens/BussinessScreen/index";
import TechScreen from "../screens/TechScreen/index";
import TeslaScreen from "../screens/TeslaScreen/index";
import WallStreetScreen from "../screens/WallStreetScreen/index";

const Drawer = createDrawerNavigator();

// Custom Drawer Content
const CustomDrawerContent = (props) => {
  const { navigation, state } = props;
  const { colors, isDarkMode, toggleTheme } = useTheme();
  
  // Get current route name
  const currentRoute = state.routeNames[state.index];
  
  const menuItems = [
    { name: 'Home', icon: 'home-outline', screen: 'HomeStack', color: '#007AFF' },
    { name: 'Cryptocurrency', icon: 'logo-bitcoin', screen: 'Cryptocurrency', color: '#FF9500' },
    { name: 'Apple', icon: 'logo-apple', screen: 'Apple', color: '#000000' },
    { name: 'Business', icon: 'briefcase', screen: 'Business', color: '#34C759' },
    { name: 'Technology', icon: 'laptop', screen: 'Tech', color: '#5856D6' },
    { name: 'Tesla', icon: 'car', screen: 'Tesla', color: '#FF3B30' },
    { name: 'Wall Street', icon: 'trending-up', screen: 'WallStreet', color: '#FF2D92' },
  ];

  const renderMenuItem = (item, index) => {
    const isActive = currentRoute === item.screen;
    const itemColor = isDarkMode ? (isActive ? item.color : colors.secondary) : (isActive ? item.color : colors.secondary);
    
    return (
      <TouchableOpacity
        key={index}
        style={[
          styles.menuItem,
          isActive && [styles.activeMenuItem, { backgroundColor: isDarkMode ? `${item.color}15` : `${item.color}08` }]
        ]}
        onPress={() => navigation.navigate(item.screen)}
        activeOpacity={0.6}
      >
        <View style={[
          styles.iconContainer,
          isActive && { backgroundColor: item.color }
        ]}>
          <Ionicons 
            name={item.icon} 
            size={18} 
            color={isActive ? '#FFFFFF' : itemColor}
          />
        </View>
        
        <Text style={[
          styles.menuText, 
          { 
            color: isActive ? item.color : colors.primary,
            fontWeight: isActive ? '600' : '400'
          }
        ]}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={[styles.drawerContainer, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.drawerHeader}>
        <View style={styles.headerTop}>
          <View>
            <Text style={[styles.greeting, { color: colors.secondary }]}>
              Good morning
            </Text>
            <Text style={[styles.appTitle, { color: colors.primary }]}>
              News
            </Text>
          </View>
          
          {/* Theme Toggle */}
          <TouchableOpacity
            style={[styles.themeButton, { backgroundColor: colors.cardBackground }]}
            onPress={toggleTheme}
            activeOpacity={0.7}
          >
            <Ionicons 
              name={isDarkMode ? "sunny" : "moon"} 
              size={16} 
              color={colors.primary} 
            />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Divider */}
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      
      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {menuItems.map(renderMenuItem)}
      </View>
      
      {/* Footer */}
      <View style={styles.footer}>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
        <View style={styles.footerContent}>
          <View style={styles.statusDot} />
          <Text style={[styles.statusText, { color: colors.secondary }]}>
            {isDarkMode ? 'Dark appearance' : 'Light appearance'}
          </Text>
        </View>
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
  const { colors, isDarkMode } = useTheme();
  
  return (
    <Drawer.Navigator
      initialRouteName="HomeStack"
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: colors.background,
          width: 320,
          borderRightWidth: 0,
          elevation: 0,
          shadowOpacity: 0,
        },
        drawerType: 'slide',
        overlayColor: isDarkMode ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.3)',
        sceneContainerStyle: {
          backgroundColor: colors.background,
        }
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="HomeStack" component={AppNavigator} />
      <Drawer.Screen name="Cryptocurrency" component={ThemedScreen(CryptoCurrencyScreen)} />
      <Drawer.Screen name="Apple" component={ThemedScreen(AppleScreen)} />
      <Drawer.Screen name="Business" component={ThemedScreen(BusinessScreen)} />
      <Drawer.Screen name="Tech" component={ThemedScreen(TechScreen)} />
      <Drawer.Screen name="Tesla" component={ThemedScreen(TeslaScreen)} />
      <Drawer.Screen name="WallStreet" component={ThemedScreen(WallStreetScreen)} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    paddingTop: 20,
  },
  drawerHeader: {
    paddingTop: 50,
    paddingHorizontal: 24,
    paddingBottom: 32,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: {
    fontSize: 15,
    fontWeight: '400',
    marginBottom: 2,
    letterSpacing: -0.2,
  },
  appTitle: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.8,
    lineHeight: 36,
  },
  themeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  divider: {
    height: 0.5,
    marginHorizontal: 24,
    opacity: 0.5,
  },
  menuContainer: {
    flex: 1,
    paddingTop: 8,
    paddingHorizontal: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginVertical: 1,
    borderRadius: 10,
  },
  activeMenuItem: {
    marginHorizontal: 4,
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuText: {
    fontSize: 16,
    letterSpacing: -0.3,
    flex: 1,
  },
  footer: {
    paddingBottom: 20,
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 20,
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34C759',
    marginRight: 10,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '400',
    letterSpacing: -0.1,
  },
});