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
  const [full_name_raw, setFullNameRaw] = useState(currentUser?.cl_fullname)
  const [phone_no_raw, setPhoneNumRaw] = useState(currentUser?.cl_phonenum)
  const dispatch = useDispatch()
  const [loaded, setIsLoaded] = useState(false)
  const [client, setClient] = useState(currentUser)


  const containerStyle = { backgroundColor: 'white', padding: 10 };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      console.log(`EditProfile rendering...`)
      setIsLoaded(true)
    })
    return unsubscribe
  }, [navigation]);

  const updateUserProfile = async () => {
    console.log(`updateUserProfile()`)
    try {
      const axiosPostResponse = await axios.post(`${SERVER_DOMAIN}/api/mobile/profile/client/update`, {
        cl_uid: client.cl_uid,
        cl_fullname: client.cl_fullname,
        cl_phonenum: client.cl_phonenum
      })
      console.log(`EditProfile.updateUserProfile`)
      dispatch(setUser(client))
    } catch (error) {
      console.log(`EditProfile.updateUserProfile: [ERROR] ${error}`)
    }
    navigation.goBack()
  }

  const SubmitButton = () => {
    if (client.cl_fullname == '') {
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
              setClient({
                ...client,
                cl_fullname: fullname.trim().toUpperCase(),
              })
            }}
          />
        </View>
        <View style={{ marginVertical: 5 }}>
          <TextInput
            label='EMAIL'
            placeholder="EMAIL"
            mode='outlined'
            value={client.cl_email}
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
              setPhoneNumRaw(phonenum.trim())
              setClient({
                ...client,
                cl_phonenum: phonenum.trim(),
              })
            }} />
          <Text style={{ fontSize: 10 }}>Your phone number will be public. Leave empty for privacy.</Text>
        </View>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}>
        {SubmitButton()}
      </View>
    </View >
  )
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     marginTop: 100,
//     alignItems: "center"
//   },
//   row: {
//     flexDirection: 'row',
//     flexWrap: 'wrap',
//     paddingHorizontal: 12
//   },
//   chip: {
//     borderColor: "#000000",
//     borderWidth: 1,
//     marginVertical: 1,
//     marginHorizontal: 1
//   },
//   chipText: {
//     color: "#000000"
//   },
//   fab: {
//     backgroundColor: '#56b700',
//     height: 30,
//     width: 30,
//     alignItems: 'center',
//     justifyContent: 'center'
//   }
// });

export default EditProfile
