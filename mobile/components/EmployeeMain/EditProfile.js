import axios from 'axios';
import React, { Component, useState, useEffect } from 'react'
import { StyleSheet, View, TouchableOpacity, FlatList, useIsFocus } from 'react-native';

import { useIsFocused } from '@react-navigation/native';

import { TextInput, Text, Chip, FAB, Portal, Modal, Provider, Button } from 'react-native-paper';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchClient } from '../../oldredux/actions';

import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../../redux/currentUser';

import env from 'mobile/env.json'
const SERVER_DOMAIN = env.SERVER_DOMAIN

const EditProfile = ({ navigation }) => {
  const isFocused = useIsFocused()
  const currentUser = useSelector(state => state.currentUser.value)
  const dispatch = useDispatch()
  const [loaded, setIsLoaded] = useState(false)
  const [employee, setEmployee] = useState(currentUser)
  const [full_name_raw, setFullNameRaw] = useState(currentUser?.em_fullname)
  const [phone_no_raw, setPhoneNumRaw] = useState(currentUser?.em_phonenum)
  const [isPhoneNumCorrect, setIsPhoneNumCorrect] = useState(true)

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log(`EditProfile rendering...`)
      setIsLoaded(true)
    })
    return unsubscribe
  }, [navigation])

  const updateUserProfile = async () => {
    console.log(`updateUserProfile()`)
    try {
      const axiosPostResponse = await axios.post(`${SERVER_DOMAIN}/api/mobile/profile/employee/update`, {
        em_uid: employee.em_uid,
        em_fullname: employee.em_fullname,
        em_phonenum: employee.em_phonenum
      })
      console.log(`EditProfile.updateUserProfile`)
      dispatch(setUser(employee))
    } catch (error) {
      console.log(`EditProfile.updateUserProfile: [ERROR] ${error}`)
    }
    navigation.goBack()
  }

  const checkPhoneNumValid = (phone_no) => {
    if (phone_no.length >= 10 && phone_no.length <= 11 && phone_no.substring(0, 2) == '01' && !(/[a-z]/i.test(phone_no))) {
      setIsPhoneNumCorrect(true)
    } else {
      setIsPhoneNumCorrect(false)
    }
  };


  const PhoneNumWarning = (phone_no) => {
    phone_no = '' + phone_no
    if (!isPhoneNumCorrect) {
      if (phone_no.length <= 0) {
        return (
          <Text style={{ fontSize: 10 }}>Phone Number cannot be empty!</Text>
        )
      }
      return (
        <Text style={{ fontSize: 10 }}>Invalid phone number!</Text>
      )
    }
  };


  const SubmitButton = () => {
    if (employee.em_fullname == '' || !isPhoneNumCorrect) {
      return (
        <Button
          mode="contained"
          disabled='true'>Update Profile
        </Button>
      )
    }
    return (
      <Button
        mode="contained"
        onPress={() => updateUserProfile()}>Update Profile
      </Button>
    )
  }

  return (
    <View style={{ flex: 1, margin: 10 }}>
      <View>
        <View style={{ marginVertical: 5 }}>
          <TextInput
            label='FULL NAME'
            placeholder="FULL NAME"
            mode='outlined'
            value={full_name_raw}
            onChangeText={(fullname) => {
              setFullNameRaw(fullname)
              setEmployee({
                ...employee,
                em_fullname: fullname.trim().toUpperCase(),
              })
            }}
          />
        </View>
        <View style={{ marginVertical: 5 }}>
          <TextInput
            label='EMAIL'
            placeholder="EMAIL"
            mode='outlined'
            value={employee.em_email}
            disabled='true'
          />
        </View>
        <View style={{ marginVertical: 5 }}>
          <TextInput
            label='PHONE NUMBER'
            placeholder="PHONE NUMBER"
            mode='outlined'
            value={phone_no_raw}
            onChangeText={(phonenum) => {
              setPhoneNumRaw(phonenum)
              checkPhoneNumValid(phonenum.trim())
              setEmployee({
                ...employee,
                em_phonenum: phonenum.trim(),
              })
            }} />
          {PhoneNumWarning(employee?.em_phonenum)}
        </View>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}>
        {SubmitButton()}
      </View>
    </View>
  )
}

export default EditProfile