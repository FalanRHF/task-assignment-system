import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import axios from 'axios';
import auth from '@react-native-firebase/auth';

import env from 'mobile/env.json'
const SERVER_DOMAIN = env.SERVER_DOMAIN


const EmployeeRegister = ({ navigation }) => {
  const [email, setEmail] = useState('')
  const [full_name, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [phone_no, setPhoneNum] = useState('')
  const [isPasswordSafe, setIsPasswordSafe] = useState(false)
  const [isEmailExist, setIsEmailExist] = useState(true)

  useEffect(() => {
    console.log('EmployeeRegister.js rendering...')
  }, [])

  const onSignUpButton = async () => {
    console.log(`onSignUpButton()`)
    //e.preventDefault() //avoids auto go to App.js
    try {
      if (await checkEmailExist(email)) {
        setIsEmailExist(true)
        registerEmployee()
      } else {
        setIsEmailExist(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const checkEmailExist = (email) => {
    console.log('checkEmailExist()');
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await axios.get(`${SERVER_DOMAIN}/api/mobile/auth/employee/email/${email}`)
        if (data.length > 0) {
          resolve(true)
        } else {
          resolve(false)
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  const registerEmployee = async () => {
    console.log(`registerClient()`)
    try {
      const fbUID = await firebaseSignUp()
      await employeeSignUp(fbUID)
      await usersSignUp(fbUID)
      navigation.navigate('PostRegister')
    } catch (error) {
      console.log(error)
    }
  }

  const firebaseSignUp = () => {
    console.log(`firebaseSignUp`)
    return new Promise(async (resolve, reject) => {
      try {
        const fbresult = await auth()
          .createUserWithEmailAndPassword(email, password)
        console.log(`firebaseSignUp() success`)
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
    })
  }

  const employeeSignUp = (fbUID) => {
    console.log(`employeeSignUp()`)
    return new Promise(async (resolve, reject) => {
      try {
        console.log(`uid: ${fbUID}`)
        const { data } = await axios.post(`${SERVER_DOMAIN}/api/mobile/auth/register/employee`, {
          em_uid: fbUID,
          em_fullname: full_name,
          em_email: email,
          em_phonenum: phone_no
        })
        console.log(`App.Login.PreRegister.employeeRegister.employeeSignUp: ${JSON.stringify(data)}`)
        resolve(data)
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
        const { data } = await axios.post(`${SERVER_DOMAIN}/api/mobile/auth/register/users`, {
          us_uid: fbUID,
          us_type: 'employee',
        })
        console.log(`usersSignUp = success`)
        console.log(`App.Login.PreRegister.employeeRegister.usersSignUp: ${JSON.stringify(data)}`)
        resolve(data)
      } catch (error) {
        console.log(`employeeRegister.onEmployeeSignUp.axios.post(): ${error}`)
        reject(error)
      }
    })
  }

  const checkPasswordSafe = (password) => {
    if (password.length > 5) {
      setIsPasswordSafe(true)
    } else {
      setIsPasswordSafe(false)
    }
  }

  const PasswordWarning = () => {
    if (!isPasswordSafe) {
      return (
        <Text style={{ fontSize: 10, color: 'white' }}>Password must be at least 6 characters.</Text>
      )
    }
  }

  const EmailWarning = () => {
    if (!isEmailExist) {
      return (
        <Text style={{ fontSize: 10, color: 'white' }}>Email does not exist.</Text>
      )
    }
  }

  const SignUpButton = () => {
    if (email == '' || full_name == '' || password == '' || phone_no == '' || !isPasswordSafe) {
      return (
        <Button
          mode="contained"
          style={{ backgroundColor: 'gray' }}
        >Sign Up</Button>
      )
    }
    return (
      <Button
        mode="contained"
        onPress={(e) => { setIsEmailExist(true); onSignUpButton() }}
      >Sign Up</Button>
    )
  }

  return (
    <View style={{ flex: 1, paddingHorizontal: 15, backgroundColor: '#232323' }}>
      <View style={{ marginVertical: 15 }}>
        <TextInput
          placeholder="FULL NAME"
          label='FULL NAME'
          mode='outlined' onChangeText={(fullname) => setFullName(fullname.trim().toUpperCase())}
        />
        <TextInput
          placeholder="EMAIL ADDRESS"
          label='EMAIL ADDRESS'
          mode='outlined' onChangeText={(email) => setEmail(email.trim())}
        />
        {EmailWarning()}
        <TextInput
          placeholder="PHONE NUMBER"
          label='PHONE NUMBER'
          mode='outlined' onChangeText={(phonenum) => setPhoneNum(phonenum.trim())}
        />
        <TextInput
          placeholder="PASSWORD"
          label='PASSWORD'
          secureTextEntry={true}
          mode='outlined' onChangeText={(password) => { setPassword(password); checkPasswordSafe(password) }}
        />
        {PasswordWarning()}
      </View>
      <View style={{ marginVertical: 5 }}>
        {SignUpButton()}
      </View>
    </View>
  )
}

export default EmployeeRegister
