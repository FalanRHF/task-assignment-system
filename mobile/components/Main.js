import React, { Component } from 'react'
import { View, Text, Button } from 'react-native';
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import auth from '@react-native-firebase/auth'

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchClient } from '../redux/actions/index'

const Tab = createBottomTabNavigator()


export class Main extends Component {
  componentDidMount() {
    this.props.fetchClient();
  }
  logout() {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  }
  render() {
    const { currentUser } = this.props;
    console.log("Main.js render():");
    console.log(currentUser);
    if (currentUser == undefined) {
      return (
        <View>
          <Text>undefined currentUser state</Text>
        </View>
      )
    }
    return (
      <Tab.Navigator>
        <Tab.Screen />
        <Tab.Screen />
      </Tab.Navigator>
    )
  }
}

const mapStatetoProps = (store) => ({
  currentUser: store.userState.currentUser
})
const mapDispatchProps = (dispatch) => bindActionCreators({ fetchClient }, dispatch)

export default connect(mapStatetoProps, mapDispatchProps)(Main)
