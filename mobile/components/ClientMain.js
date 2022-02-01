import React, { Component, useEffect } from 'react'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';


import HomeComponent from './ClientMain/Home'
import SettingsComponent from './ClientMain/Settings'
import CompletedComponent from './ClientMain/Completed'
import { createStackNavigator } from '@react-navigation/stack';

const Tab = createMaterialBottomTabNavigator();
const HomeStack = createStackNavigator();
const CompletedStack = createStackNavigator();
const SettingsStack = createStackNavigator();

function HomeScreen() {
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

function CompletedScreen() {
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

function SettingsScreen() {
  return (
    <SettingsStack.Navigator>
      <SettingsStack.Screen
        name="Settings"
        component={SettingsComponent}
        options={{ tabBarLabel: 'Settings', headerTitleAlign: 'center' }}
      />
    </SettingsStack.Navigator>
  )
}

const Main = ({ navigation }) => {

  return (
    <Tab.Navigator
      initialRouteName="Home"
      activeColor="white"
      inactiveColor="black"
      barStyle={{ backgroundColor: '#f4b120' }}>
      <Tab.Screen name="Home" component={HomeScreen}
        options={{
          tabBarLabel: 'HOME',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }} />
      <Tab.Screen name="Completed" component={CompletedScreen} options={{
        tabBarLabel: 'COMPLETED',
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="check-circle" color={color} size={26} />
        ),
      }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{
        tabBarLabel: 'SETTINGS',
        tabBarIcon: ({ color }) => (
          <MaterialCommunityIcons name="cog" color={color} size={26} />
        ),
      }} />
    </Tab.Navigator>
  )
}

export default Main
