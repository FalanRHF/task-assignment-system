import React, { Component } from 'react'
import { View, Text, Button } from 'react-native';
import auth from '@react-native-firebase/auth'

export class Settings extends Component {
  onLogOut() {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  }
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text style={{ textAlign: 'center' }}>Settings</Text>
        <Button
          onPress={() => this.onLogOut()}
          title="Log Out" />
      </View>
    )
  }

}

export default Settings


