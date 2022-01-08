import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import axios from 'axios';

import auth from '@react-native-firebase/auth';


const Register = ({ navigation }) => {
  const [password, setPassword] = useState('')
  const [employee, setEmployee] = useState({})
  // const [uid, setUid] = useState('')
  const setEmployeeData = (key, value) => {
    var data = {};
    data[key] = value;
    setEmployee({
      ...employee,
      ...data,
    })
  }

  useEffect(() => {
    return () => {
      console.log(`Unmounting PreRegister.employeeRegister...`)
    }
  }, [])

  const onSignUpButton = async (e) => {
    console.log(`EmployeeRegister.onSignUpButton: called`)
    //e.preventDefault() //avoids auto go to App.js
    try {
      const fbUID = await firebaseSignUp()
      await employeeSignUp(fbUID)
      await usersSignUp(fbUID)
      navigation.navigate('PostRegister')
    } catch (error) {
      console.log(`EmployeeRegister.onSignUpButton: error`)
      console.log(error)
      // failedRegistration()

    }
  }

  const failedRegistration = async () => {
    console.log(`failedRegistration`)
    try {
      await deleteFirebaseAccount()
      await deleteEmployee()
      await deleteUsers()
    } catch (error) {
      console.log(error)
    }
  }

  const firebaseSignUp = () => {
    console.log(`firebaseSignUp`)
    return new Promise(async (resolve, reject) => {
      try {
        const fbresult = await auth()
          .createUserWithEmailAndPassword(employee.email, password)
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

  const employeeSignUp = (fbUID) => {
    console.log(`EmployeeRegister.employeeSignUp: called`)
    return new Promise(async (resolve, reject) => {
      try {
        console.log(`uid: ${fbUID}`)
        const getPostResponse = await axios.post(`http://localhost:5050/auth/register/employee`, {
          em_uid: fbUID,
          em_fullname: employee.fullname.toUpperCase(),
          em_username: employee.username,
          em_email: employee.email
        })

        console.log(`App.Login.PreRegister.employeeRegister.employeeSignUp: ${JSON.stringify(getPostResponse.data)}`)
        resolve(getPostResponse)
      } catch (error) {
        console.log(`employeeRegister.onemployeeSignUp.axios.post.employee(): ${error}`)
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
          us_type: 'employee',
        })
        console.log(`usersSignUp = success`)
        console.log(`App.Login.PreRegister.employeeRegister.usersSignUp: ${JSON.stringify(getPostResponse.data)}`)
        resolve(getPostResponse)
      } catch (error) {
        console.log(`employeeRegister.onEmployeeSignUp.axios.post(): ${error}`)
        reject(error)
      }
    })
  }

  return (
    <View style={{ flex: 1, paddingHorizontal: 15, backgroundColor: '#232323' }}>
      <View style={{ marginVertical: 15 }}>
        <TextInput
          placeholder="Full Name"
          label='Full Name'
          mode='outlined' onChangeText={(fullname) => setEmployeeData('fullname', fullname)}
        />
        <TextInput
          placeholder="Username"
          mode='outlined' onChangeText={(username) => setEmployeeData('username', username)}
        />
        <TextInput
          placeholder="Email Address"
          mode='outlined' onChangeText={(email) => setEmployeeData('email', email)}
        />
        <TextInput
          placeholder="Password"
          secureTextEntry={true}
          mode='outlined' onChangeText={(password) => setPassword(password)}
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
