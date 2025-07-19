import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import CryptoCurrecyScreen from './src/screens/CryptoCurrecyScreen/index';
import AppleScreen from "./src/screens/AppleScreen/index"
import BussinessScreen from "./src/screens/BussinessScreen/index"
import TechScreen from "./src/screens/TechScreen/index"
import TeslaScreen from "./src/screens/TeslaScreen/index"
import WallStreet from "./src/screens/WallStreetScreen/index"
import HomeScreen from "./src/screens/HomeScreen/index"


export default function App() {
  return (
    <View style={styles.container}>
      <HomeScreen/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
