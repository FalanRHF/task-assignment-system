import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import axios from 'axios';


import firebase from '@react-native-firebase/app';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { TextInput, Button, Text } from 'react-native-paper';



const Register = ({ navigation }) => {
  const [password, setpassword] = useState('')
  const [client, setclient] = useState({})
  const [registerStatus, setregisterStatus] = useState({})

  const setClientData = (key, value) => {
    var data = {};
    data[key] = value;
    setclient({
      ...client,
      ...data,
    })
  }

  //console.log(client)

  useEffect(() => {
    setregisterStatus({
      ...registerStatus,
      fb: false,
      client: false,
      users: false,
    })
    return () => {
      console.log(`Unmounting PreRegister.ClientRegister...`)
    }
  }, [])

  const onSignUpButton = async (e) => {
    console.log(`onClientSignUp`)
    //e.preventDefault() //avoids auto go to App.js
    try {
      await firebaseSignUp()
      await clientSignUp()
      await usersSignUp()
      //navigation.popToTop()
    } catch (error) {
      console.log(`onClientSignUp() error`)
      console.log(error)
      // failedRegistration()

    }
  }

  const failedRegistration = async () => {
    console.log(`failedRegistration`)
    try {
      await deleteFirebaseAccount()
      await deleteClient()
      await deleteUsers()
    } catch (error) {
      console.log(error)

    }
  }
  const deleteFirebaseAccount = () => {
    console.log(`deleteFirebaseAccount`)
    return new Promise(async (resolve, reject) => {
      try {
        const fbresult = await auth().
          console.log(`firebaseSignUp() success`)
        setregisterStatus({
          ...registerStatus,
          fb: true,
        })
        resolve(fbresult)
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }
        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }
        reject(error)
      }
    });
  }

  const firebaseSignUp = () => {
    console.log(`firebaseSignUp`)
    return new Promise(async (resolve, reject) => {
      try {
        const fbresult = await auth()
          .createUserWithEmailAndPassword(client.email, password)
        console.log(`firebaseSignUp() success`)
        setregisterStatus({
          ...registerStatus,
          fb: true,
        })
        resolve(fbresult)
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!');
        }
        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!');
        }
        reject(error)
      }
    });
  }

  const clientSignUp = () => {
    console.log(`clientSignUp`)
    return new Promise(async (resolve, reject) => {
      try {
        const getPostResponse = await axios.post(`http://localhost:5050/auth/register/client`, {
          cl_uid: auth().currentUser.uid,
          cl_username: client.username,
          cl_fullname: client.fullname,
          cl_email: client.email,
        })

        console.log(`clientSignUp success`)
        console.log(`App.Login.PreRegister.ClientRegister.clientSignUp: ${JSON.stringify(getPostResponse.data)}`)
        setregisterStatus({
          ...registerStatus,
          client: true,
        })
        resolve(getPostResponse)
      } catch (error) {
        console.log(`ClientRegister.onClientSignUp.axios.post.client(): ${error}`)
        reject(error)
      }
    });
  }

  const usersSignUp = () => {
    console.log(`usersSignUp`)
    return new Promise(async (resolve, reject) => {
      try {
        const getPostResponse = await axios.post(`http://localhost:5050/auth/register/users`, {
          us_uid: auth().currentUser.uid,
          us_type: 'client',
        })
        console.log(`userSignUp() success`)
        console.log(`App.Login.PreRegister.ClientRegister.usersSignUp: ${JSON.stringify(getPostResponse.data)}`)
        setregisterStatus({
          ...registerStatus,
          users: true,
        })
        resolve(getPostResponse)
      } catch (error) {
        console.log(`ClientRegister.onClientSignUp.axios.post(): ${error}`)
        reject(error)
      }
    });
  }

  return (
    <View style={{ flex: 1, paddingHorizontal: 10, backgroundColor: '#232323' }}>
      <TextInput
        placeholder="Full Name"
        label='Full Name'
        mode='outlined' onChangeText={(fullname) => setClientData('fullname', fullname)}
      />
      <TextInput
        placeholder="Username"
        mode='outlined' onChangeText={(username) => setClientData('username', username)}
      />
      <TextInput
        placeholder="Email Address"
        mode='outlined' onChangeText={(email) => setClientData('email', email)}
      />
      <TextInput
        placeholder="Password"
        secureTextEntry={true}
        mode='outlined' onChangeText={(password) => setpassword(password)}
      />
      {/* <TextInput
        placeholder="Project Code"
        mode='outlined' onChangeText={(pjcode) => setpjcode(pjcode)}
      /> */}

      <Button
        mode="contained"
        onPress={(e) => onSignUpButton(e)}
      >Sign Up</Button>
    </View>
  )
}

export default Register
