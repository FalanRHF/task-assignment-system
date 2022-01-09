import React, { useState, useCallback, useEffect } from 'react';
import { View, Image } from 'react-native';
import axios from 'axios';

import { TextInput, Button, Text } from 'react-native-paper';

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { NavigationContainer, useFocusEffect, useIsFocused } from '@react-navigation/native';

import { useDispatch } from 'react-redux'
import { setUser } from '../../redux/currentUser';

const logo1 = require('../../../mobile/files/logo/netsinity1.png')


const Login = ({ navigation }) => {
  console.log(logo1)
  const isFocused = useIsFocused()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const dispatch = useDispatch()

  useEffect(() => {
    if (isFocused) {
      console.log(`Login: rendering...`)
    }
  }, [isFocused])

  const onLoginButton = async () => {
    try {
      const uid = await firebaseLogin()
      var userType = await getUserType(uid)
      var userDetails = {}
      if (userType == 'client') {
        userDetails = await getClientDetails(uid)
      } else if (userType == 'employee') {
        userDetails = await getEmployeeDetails(uid)
      } else {
        console.log(`Login.onLoginButton.userType error: neither 'client' nor 'employee`)
      }
      dispatch(setUser({ ...userDetails, type: userType, loggedin: true }))
    } catch (error) {
      console.log(error)
    }
  }

  const firebaseLogin = () => {
    console.log("Login.firebaseLogin: called")
    return new Promise(async (resolve, reject) => {
      try {
        await auth().signInWithEmailAndPassword(email, password)
        console.log('User account signed in!')
        resolve(auth().currentUser.uid)
      } catch (error) {
        if (error.code === 'auth/user-not-found') {
          reject('There is no account associated with this email!')
        }
        if (error.code === 'auth/invalid-email') {
          reject('That email address is invalid!')
        }
      }
    })
  }

  const getUserType = (uid) => {
    console.log(`Login.getUserType: called`)
    return new Promise(async (resolve, reject) => {
      try {
        const axiosGetResponse = await axios.get(`http://localhost:5050/api/mobile/auth/getdata/user/${uid}`)
        console.log(`${JSON.stringify(axiosGetResponse.data[0])}`)
        const userType = axiosGetResponse.data[0].us_type
        console.log(`Login.getUserType: success. userType=${userType}`)
        resolve(userType)
      } catch (error) {
        reject(`Login.getUserType: [ERROR] ${error}`)
      }
    })
  }

  const getClientDetails = (uid) => {
    console.log(`Login.getClientDetails: called`)
    return new Promise(async (resolve, reject) => {
      try {
        const axiosGetResponse = await axios.get(`http://localhost:5050/api/mobile/auth/getdata/client/${uid}`)
        const clientDetails = axiosGetResponse.data[0]
        console.log(JSON.stringify(clientDetails))
        console.log(`Login.getClientDetails: success`)
        resolve(clientDetails)
      } catch (error) {
        reject(`Login.getClientDetails: [ERROR] ${error}`)
      }
    })
  }

  const getEmployeeDetails = (uid) => {
    console.log(`Login.getEmployeeDetails: called`)
    return new Promise(async (resolve, reject) => {
      try {
        const axiosGetResponse = await axios.get(`http://localhost:5050/api/mobile/auth/getdata/employee/${uid}`)
        const employeeDetails = axiosGetResponse.data[0]
        console.log(JSON.stringify(employeeDetails))
        console.log(`Login.getEmployeeDetails: success`)
        resolve(employeeDetails)
      } catch (error) {
        reject(`Login.getEmployeeDetails: [ERROR] ${error}`)
      }
    })
  }

  const toRegister = () => {
    navigation.navigate("PreRegister")
  }

  // const toRegister2 = async () => {
  //   try {
  //     const getPendingResponse = await axios.get(`http://192.168.68.109:5050/ticket/getpending/${this.state.pjcode}`)
  //     pendingTicket = getPendingResponse.data
  //   } catch (error) {
  //     console.log(`getPending(): ${error}`)
  //   }
  // }

  return (
    <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 16, backgroundColor: '#232323' }}>
      <View style={{ flex: 2, justifyContent: 'center', paddingHorizontal: 60 }}>
        <Image
          source={logo1}
          style={{
            flex: 2,
            width: null,
            height: null,
            resizeMode: 'contain',
            marginTop: 75
          }}
        />
        <Image
          source={require('../../files/logo/netsinity2.png')}
          style={{
            flex: 1,
            width: null,
            height: null,
            resizeMode: 'contain',
            marginBottom: 20
          }}
        />
      </View>
      <View style={{ flex: 3 }}>
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
            onPress={() => onLoginButton()}
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
