import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import axios from 'axios';

import DropDown from "react-native-paper-dropdown";

import auth from '@react-native-firebase/auth';


const Register = ({ navigation }) => {
  const [password, setPassword] = useState('')
  const [employee, setEmployee] = useState({})
  const [showDropDown, setShowDropDown] = useState(false)
  const [state, setState] = useState('')
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

  const stateList = [
    { label: 'JOHOR', value: 'JOHOR' },
    { label: 'KEDAH', value: 'KEDAH' },
    { label: 'KELANTAN', value: 'KELANTAN' },
    { label: 'MELAKA', value: 'MELAKA' },
    { label: 'NEGERI SEMBILAN', value: 'N9' },
    { label: 'PAHANG', value: 'PAHANG' },
    { label: 'PERAK', value: 'PERAK' },
    { label: 'PERLIS', value: 'PERLIS' },
    { label: 'PULAU PINANG', value: 'PENANG' },
    { label: 'SABAH', value: 'SABAH' },
    { label: 'SARAWAK', value: 'SARAWAK' },
    { label: 'SELANGOR', value: 'SELANGOR' },
    { label: 'TERENGGANU', value: 'TERENGGANU' },
    { label: 'WP KUALA LUMPUR', value: 'WPKL' },
    { label: 'WP LABUAN', value: 'WPL' },
    { label: 'WP PUTRAJAYA', value: 'WPP' },
  ]

  const onSignUpButton = async (e) => {
    console.log(`EmployeeRegister.onSignUpButton: called`)
    console.log(JSON.stringify(employee))
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
    console.log(`EmployeeRegister.employeeSignUp: called`)
    return new Promise(async (resolve, reject) => {
      try {
        console.log(`uid: ${fbUID}`)
        const getPostResponse = await axios.post(`http://localhost:5050/api/mobile/auth/register/employee`, {
          em_uid: fbUID,
          em_fullname: employee.fullname.toUpperCase(),
          em_email: employee.email,
          em_phonenum: employee.phonenum,
          em_state: state
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
        const getPostResponse = await axios.post(`http://localhost:5050/api/mobile/auth/register/users`, {
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
          placeholder="FULL NAME"
          label='FULL NAME'
          mode='outlined' onChangeText={(fullname) => setEmployeeData('fullname', fullname)}
        />
        <TextInput
          placeholder="EMAIL ADDRESS"
          label='EMAIL ADDRESS'
          mode='outlined' onChangeText={(email) => setEmployeeData('email', email)}
        />
        <TextInput
          placeholder="PHONE NUMBER"
          label='PHONE NUMBER'
          mode='outlined' onChangeText={(phonenum) => setEmployeeData('phonenum', phonenum)}
        />
        <View>
          <DropDown
            label={"STATE"}
            mode={"outlined"}
            visible={showDropDown}
            showDropDown={() => setShowDropDown(true)}
            onDismiss={() => setShowDropDown(false)}
            value={state}
            setValue={setState}
            list={stateList}
            dropDownItemStyle={{ backgroundColor: 'white' }}
          />
        </View>
        <TextInput
          placeholder="PASSWORD"
          label='PASSWORD'
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
