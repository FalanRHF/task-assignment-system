import React, { Component } from 'react';
import { View, Button, TextInput } from 'react-native';

import auth from '@react-native-firebase/auth';
import { NavigationContainer } from '@react-navigation/native';

export class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      name: ''
    }
    this.onLogin = this.onLogin.bind(this)
  }
  onLogin() {
    const { email, password } = this.state;
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log('User account signed in!');
      })
      .catch(error => {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }

        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }

        console.error(error);
      });
  }
  render() {
    return (
      <View>
        <TextInput
          placeholder="email"
          onChangeText={(email) => this.setState({ email })}
        />
        <TextInput
          placeholder="password"
          secureTextEntry={true}
          onChangeText={(password) => this.setState({ password })}
        />

        <Button
          onPress={() => this.onLogin()}
          title="Log In"
        />
      </View>
    )
  }
}

export default Login
