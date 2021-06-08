import React, { Component } from 'react';
import { View, Button, TextInput } from 'react-native';


import firebase from 'firebase/app';

import auth from '@react-native-firebase/auth';



export class Setup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      Project: '',
      New: '',
      takde: ''
    }
  }
  logout() {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  }

  render() {
    return (
      <View>
        <TextInput
          placeholder="Project"
          onChangeText={(Project) => this.setState({ Project })}
        />
        <TextInput
          placeholder="New"
          onChangeText={(New) => this.setState({ New })}
        />
        <TextInput
          placeholder="takde"
          onChangeText={(takde) => this.setState({ takde })}
        />

        <Button
          onPress={() => this.logout()}
          title="Log Out La Bich"
        />
      </View>
    )
  }
}

export default Setup
