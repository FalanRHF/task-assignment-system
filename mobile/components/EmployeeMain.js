import React, { Component, useEffect } from 'react'
import { View, Text, Button } from 'react-native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import auth from '@react-native-firebase/auth'

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchClient } from '../oldredux/actions/index'

import HomeComponent from './EmployeeMain/Home'
import SettingsComponent from './EmployeeMain/Settings'
import CompletedComponent from './EmployeeMain/Completed'
import { createStackNavigator } from '@react-navigation/stack';

const Tab = createMaterialBottomTabNavigator();
const HomeStack = createStackNavigator();
const CompletedStack = createStackNavigator();
const SettingsStack = createStackNavigator();

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

const SettingsScreen = () => {
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

  useEffect(() => {
  }, [])

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
        tabBarLabel: 'RESOLVED',
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
