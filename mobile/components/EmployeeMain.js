import React, { Component, useEffect } from 'react'
import { View, Text, Button } from 'react-native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import auth from '@react-native-firebase/auth'

import HomeComponent from './EmployeeMain/Home'
// import SettingsComponent from './EmployeeMain/Settings'
import CompletedComponent from './EmployeeMain/Completed'
import { createStackNavigator } from '@react-navigation/stack'

const Tab = createBottomTabNavigator();
const HomeStack = createStackNavigator();
const CompletedStack = createStackNavigator();

const HomeScreen = () => {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Home"
        component={HomeComponent}
        options={{ tabBarLabel: 'Home', headerTitleAlign: 'center' }}
      />
    </HomeStack.Navigator>
  )
}

const CompletedScreen = () => {
  return (
    <CompletedStack.Navigator>
      <CompletedStack.Screen
        name="Completed"
        component={CompletedComponent}
        options={{ tabBarLabel: 'Completed', headerTitleAlign: 'center' }}
      />
    </CompletedStack.Navigator>
  )
}

// const SettingsScreen = () => {
//   return (
//     <SettingsStack.Navigator>
//       <SettingsStack.Screen
//         name="Settings"
//         component={SettingsComponent}
//         options={{ tabBarLabel: 'Settings', headerTitleAlign: 'center' }}
//       />
//     </SettingsStack.Navigator>
//   )
// }

const Main = ({ navigation }) => {

  useEffect(() => {
    console.log(`EmployeeMain.js mounted`)
    return () => {
      console.log(`EmployeeMain.js unmounted`)
    }
  }, [])

  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={HomeScreen}
        options={{ tabBarLabel: 'Home' }} icon='home' />
      <Tab.Screen name="Completed" component={CompletedScreen}
        options={{ tabBarLabel: 'Completed' }} icon='home' />
    </Tab.Navigator>
  )
}

export default Main
