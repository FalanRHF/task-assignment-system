import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import axios from 'axios';


import firebase from '@react-native-firebase/app';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { TextInput, Button, Text } from 'react-native-paper';



const Register = ({ navigation }) => {
  const [password, setPassword] = useState('')
  const [client, setClient] = useState({})
  // const [uid, setUid] = useState('')

  const setClientData = (key, value) => {
    var data = {};
    data[key] = value;
    setClient({
      ...client,
      ...data,
    })
  }

  //console.log(client)

  useEffect(() => {
    return () => {
      console.log(`Unmounting PreRegister.ClientRegister...`)
    }
  }, [])

  const onSignUpButton = async (e) => {
    console.log(`onClientSignUp`)
    //e.preventDefault() //avoids auto go to App.js
    try {
      const fbUID = await firebaseSignUp()
      await clientSignUp(fbUID)
      await usersSignUp(fbUID)
      navigation.navigate('PostRegister')
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
        // setUid(auth().currentUser.uid)
        resolve(auth().currentUser.uid)
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

  const clientSignUp = (fbUID) => {
    console.log(`clientSignUp`)
    return new Promise(async (resolve, reject) => {
      try {
        console.log(`uid: ${fbUID}`)
        const getPostResponse = await axios.post(`http://localhost:5050/auth/register/client`, {
          cl_uid: fbUID,
          cl_username: client.username,
          cl_fullname: client.fullname.toUpperCase(),
          cl_email: client.email,
          cl_curpj: client.pjcode,
          cl_pjcode: `{${client.pjcode}}`

        })

        console.log(`clientSignUp success`)
        console.log(`App.Login.PreRegister.ClientRegister.clientSignUp: ${JSON.stringify(getPostResponse.data)}`)
        resolve(getPostResponse)
      } catch (error) {
        console.log(`ClientRegister.onClientSignUp.axios.post.client(): ${error}`)
        reject(error)
      }
    });
  }

  const usersSignUp = (fbUID) => {
    console.log(`usersSignUp`)
    return new Promise(async (resolve, reject) => {
      try {
        const getPostResponse = await axios.post(`http://localhost:5050/auth/register/users`, {
          us_uid: fbUID,
          us_type: 'client',
        })
        console.log(`userSignUp() success`)
        console.log(`App.Login.PreRegister.ClientRegister.usersSignUp: ${JSON.stringify(getPostResponse.data)}`)
        resolve(getPostResponse)
      } catch (error) {
        console.log(`ClientRegister.onClientSignUp.axios.post(): ${error}`)
        reject(error)
      }
    });
  }

  return (
    <View style={{ flex: 1, paddingHorizontal: 15, backgroundColor: '#232323' }}>
      <View style={{ marginVertical: 15 }}>
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
          mode='outlined' onChangeText={(password) => setPassword(password)}
        />
        <TextInput
          placeholder="Project Code"
          mode='outlined' onChangeText={(pjcode) => setClientData('pjcode', pjcode)}
        />
      </View>
      <View style={{ marginVertical: 5 }}>
        <Button
          mode="contained"
          onPress={(e) => onSignUpButton(e)}
        >Sign Up</Button>
      </View>
    </View>
  )
}

export default Register
