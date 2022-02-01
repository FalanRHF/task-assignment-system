import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import axios from 'axios';

import auth from '@react-native-firebase/auth';
import { TextInput, Button, Text } from 'react-native-paper';

import env from 'mobile/env.json'
const SERVER_DOMAIN = env.SERVER_DOMAIN

const Register = ({ navigation }) => {
  // const [client, setClient] = useState({})
  const [email, setEmail] = useState('')
  const [full_name, setFullName] = useState('')
  const [password, setPassword] = useState('')
  const [company_code, setCompanyCode] = useState('')
  const [isPasswordSafe, setIsPasswordSafe] = useState(false)
  const [isCompanyExist, setIsCompanyExist] = useState(true)

  useEffect(() => {
    console.log('ClientRegister.js rendering...')
  }, [])

  const onSignUpButton = async () => {
    console.log(`onSignUpButton()`)
    //e.preventDefault() //avoids auto go to App.js
    try {
      if (await checkCompanyExist(company_code)) {
        setIsCompanyExist(true)
        registerClient()
      } else {
        setIsCompanyExist(false)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const registerClient = async () => {
    console.log(`registerClient()`)
    try {
      const fbUID = await firebaseSignUp()
      await clientSignUp(fbUID)
      await usersSignUp(fbUID)
      navigation.navigate('PostRegister')
    } catch (error) {
      console.log(error)
    }
  };


  const firebaseSignUp = () => {
    console.log(`firebaseSignUp()`)
    return new Promise(async (resolve, reject) => {
      try {
        const fbresult = await auth()
          .createUserWithEmailAndPassword(email, password)
        console.log(`firebaseSignUp() success`)
        resolve(auth().currentUser.uid)
      } catch (error) {
        if (error.code === 'auth/email-already-in-use') {
          console.log('That email address is already in use!')
        }
        if (error.code === 'auth/invalid-email') {
          console.log('That email address is invalid!')
        }
        reject(error)
      }
    })
  }

  const clientSignUp = (fbUID) => {
    console.log(`clientSignUp()`)
    return new Promise(async (resolve, reject) => {
      try {
        console.log(`uid: ${fbUID}`)
        const getPostResponse = await axios.post(`${SERVER_DOMAIN}/api/mobile/auth/register/client`, {
          cl_uid: fbUID,
          cl_email: email,
          cl_fullname: full_name,
          cl_cmcode: company_code,
        })
        console.log(`clientSignUp success`)
        console.log(`App.Login.PreRegister.ClientRegister.clientSignUp: ${JSON.stringify(getPostResponse.data)}`)
        resolve(getPostResponse)
      } catch (error) {
        console.log(`ClientRegister.onClientSignUp.axios.post.client(): ${error}`)
        reject(error)
      }
    })
  }

  const usersSignUp = (fbUID) => {
    console.log(`usersSignUp`)
    return new Promise(async (resolve, reject) => {
      try {
        const getPostResponse = await axios.post(`${SERVER_DOMAIN}/api/mobile/auth/register/users`, {
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
    })
  }

  const checkPasswordSafe = (password) => {
    if (password.length > 5) {
      setIsPasswordSafe(true)
    } else {
      setIsPasswordSafe(false)
    }
  };

  const checkCompanyExist = (code) => {
    console.log('checkCompanyExist()');
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await axios.get(`${SERVER_DOMAIN}/api/mobile/auth/company/${code}`)
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

  const PasswordWarning = () => {
    if (!isPasswordSafe) {
      return (
        <Text style={{ fontSize: 10, color: 'white' }}>Password must be at least 6 characters.</Text>
      )
    }
  };

  const CompanyWarning = () => {
    if (!isCompanyExist) {
      return (
        <Text style={{ fontSize: 10, color: 'white' }}>Company does not exist.</Text>
      )
    }
  }

  const SignUpButton = () => {
    if (email == '' || full_name == '' || password == '' || company_code == '' || !isPasswordSafe) {
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
        onPress={() => { setIsCompanyExist(true); onSignUpButton() }}
      >Sign Up</Button>
    )
  }

  return (
    <View style={{ flex: 1, paddingHorizontal: 15, backgroundColor: '#232323' }}>
      <View style={{ marginVertical: 15 }}>
        <TextInput
          label='EMAIL ADDRESS'
          placeholder='EMAIL ADDRESS'
          mode='outlined' onChangeText={(email) => setEmail(email.trim())}
        />
        <TextInput
          label='FULL NAME'
          placeholder='FULL NAME'
          mode='outlined'
          onChangeText={(fullname) => setFullName(fullname.trim().toUpperCase())}
        />
        <TextInput
          label='PASSWORD'
          placeholder='PASSWORD'
          secureTextEntry={true}
          mode='outlined' onChangeText={(password) => { setPassword(password); checkPasswordSafe(password) }}
        />
        {PasswordWarning()}
        <TextInput
          label='COMPANY CODE'
          placeholder='COMPANY CODE'
          mode='outlined' onChangeText={(cmcode) => setCompanyCode(cmcode.trim().toUpperCase())}
        />
        {CompanyWarning()}
      </View>
      <View style={{ marginVertical: 5 }}>
        {SignUpButton()}
      </View>
    </View>
  )
}

export default Register
