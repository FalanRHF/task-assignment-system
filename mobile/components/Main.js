import React, { Component } from 'react'
import { View, Text, Button } from 'react-native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'

import auth from '@react-native-firebase/auth'

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchClient } from '../redux/actions/index'

import HomeScreen from './main/Home'
import SettingsScreen from './main/Settings'


const Tab = createBottomTabNavigator();


export class Main extends Component {
  componentDidMount() {
    this.props.fetchClient();
  }
  render() {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Home" component={HomeScreen}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" size={24} color="black" />
            ),
          }} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    )
  }
}

const mapStatetoProps = (store) => ({
  currentUser: store.userState.currentUser
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchClient }, dispatch)

export default connect(mapStatetoProps, mapDispatchProps)(Main)
