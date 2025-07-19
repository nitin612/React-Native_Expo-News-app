import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RootStack from "./src/Routes/Navigation"
import { NavigationContainer } from '@react-navigation/native';
import DrawerNavigator from './src/drawer/Drawer';


export default function App() {
  return (
    <NavigationContainer>
      <DrawerNavigator/>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
