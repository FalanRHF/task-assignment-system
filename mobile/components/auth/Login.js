import React, { useState } from 'react';
import { View } from 'react-native';
import axios from 'axios';

import { TextInput, Button, Text } from 'react-native-paper';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { NavigationContainer } from '@react-navigation/native';


const Login = ({ navigation }) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const onLogin = async () => {
    console.log("Login.js > onLogin()")
    try {

    } catch (error) {

    }
    try {
      await auth().signInWithEmailAndPassword(email, password)
      console.log('User account signed in!');
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        console.log('There is no account associated with this email!')
      }
      if (error.code === 'auth/invalid-email') {
        console.log('That email address is invalid!');
      }

      console.error(error);
    }
  }

  const toRegister = () => {
    navigation.navigate("PreRegister")
  }

  const toRegister2 = async () => {
    try {
      const getPendingResponse = await axios.get(`http://192.168.68.109:5050/ticket/getpending/${this.state.pjcode}`)
      pendingTicket = getPendingResponse.data
    } catch (error) {
      console.log(`getPending(): ${error}`)
    }
  }


  return (
    <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 10, backgroundColor: '#232323' }}>
      <View>
        <TextInput
          placeholder='Email'
          mode='outlined'
          onChangeText={(email) => setEmail(email)}
        />
        <TextInput
          placeholder='Password'
          mode='outlined'
          secureTextEntry={true}
          onChangeText={(password) => setPassword(password)}
        />
      </View>
      <View style={{ marginVertical: 20 }}>
        <Button
          mode="contained"
          onPress={() => onLogin()}
        >Log In</Button>
      </View>
      <View style={{ flexDirection: 'row', alignSelf: 'center', textColor: 'white' }}>
        <Text style={{ color: 'white' }}>Don't have an account? </Text>
        <Text
          style={{
            textDecorationLine: 'underline',
            fontWeight: 'bold',
            color: '#f4b210'
          }}
          onPress={() => toRegister()}>Register</Text>
      </View>
    </View>
  )
}

//   async getEmail(username) {
//     let email = ''
//     try {
//       email = (await firestore().collection('Client').where('cl_username', '==', username).get()).docs[0].data().cl_email
//       console.log(`email: ${email}`)
//     } catch (error) {
//       console.log(`getEmail() error: ${error}`)
//     }
//     console.log(`email: ${email}`)
//     return (email)
//   }


export default Login
