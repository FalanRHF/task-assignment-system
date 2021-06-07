import React, { Component } from 'react';
import { View, Button, TextInput } from 'react-native';


import firebase from 'firebase/app';

import auth from '@react-native-firebase/auth';



export class Register extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
      name: ''
    }
    this.onSignUp = this.onSignUp.bind(this)
  }
  onSignUp() {
    const { email, password, name } = this.state;
    // firebase.auth().createUserWithEmailAndPassword(email, password)
    //   .then((result) => {
    //     firebase.firestore().collection("users")
    //       .doc(firebase.auth().currentUser.uid)
    //       .set({
    //         name,
    //         email,
    //       })
    //     console.log(result)
    //   })
    //   .catch((error) => {
    //     console.log(error)
    //   });
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        console.log('User account created & signed in!');
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
          placeholder="name"
          onChangeText={(name) => this.setState({ name })}
        />
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
          onPress={() => this.onSignUp()}
          title="Sign Up"
        />
      </View>
    )
  }
}

export default Register
