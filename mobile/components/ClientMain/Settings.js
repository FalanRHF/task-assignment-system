import React, { Component, useState, useEffect } from 'react'
import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';
import axios from 'axios'
import auth from '@react-native-firebase/auth'
import firestore from '@react-native-firebase/firestore'
//import { Dropdown } from 'react-native-material-dropdown';
import DropDownPicker from 'react-native-dropdown-picker';
import DropdownMenu from 'react-native-dropdown-menu';

import { useDispatch, useSelector } from 'react-redux'
import { login, logout } from '../../redux/currentUser';


const Settings = ({ navigation }) => {
  console.log('Settings.js render...')
  const [client, setclient] = useState({ isLoading: true })
  const currentUser = useSelector(state => state.currentUser.value)
  const dispatch = useDispatch()

  useEffect(() => {
    navigation.setOptions({ title: 'Settings' })
    console.log(`Settings.useEffect: activated`)

    // comment [S]
    const unsubscribe = navigation.addListener('focus', () => {
      console.log(`Home.useEffect.addListener.focus triggered`)
      getUserDetails()
    }
    );
    //comment [E]

    // comment [S]
    // const unsubscribe = () => {
    //   console.log(`${auth().currentUser.email} logging out!`)
    //   auth()
    //     .signOut()
    //   getUserProfile()
    // }
    // return unsubscribe;
    //comment [E]
  }, [navigation]);

  const getUserDetails = async () => {
    console.log(`Settings.getUserDetails: called`)
    const uid = auth().currentUser.uid
    try {
      const axiosGetResponse = await axios.get(`http://localhost:5050/auth/getdata/client/${uid}`)
      console.log(`${JSON.stringify(axiosGetResponse.data[0])}`)
      setclient({
        ...client,
        ...axiosGetResponse.data[0],
        isLoading: false,
      })
      console.log(`Settings.getUserDetails: success`)
    } catch (error) {
      console.log(`Settings.getUserDetails: [ERROR] ${error}`)
    }
  }


  const onLogOutButton = () => {
    auth()
      .signOut()
      .then(() => console.log('Settings.onLogOut: User signed out!'))
    dispatch(logout())
  }

  if (client.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Settings is loading...</Text>
        <Button
          mode="contained"
          onPress={() => onLogOut()}
        >Log Out</Button>
      </View>
    )
  }

  return (
    <View style={{ flex: 1 }}>
      <View style={{ marginVertical: 20 }}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ flex: 4 }}>Full Name</Text>
          <Text style={{ flex: 1 }}>||</Text>
          <Text style={{ flex: 13 }}>{currentUser.cl_fullname}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ flex: 4 }}>Username</Text>
          <Text style={{ flex: 1 }}>||</Text>
          <Text style={{ flex: 13 }}>@{currentUser.cl_username}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ flex: 4 }}>Email</Text>
          <Text style={{ flex: 1 }}>||</Text>
          <Text style={{ flex: 13 }}>{currentUser.cl_email}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ flex: 4 }}>Project</Text>
          <Text style={{ flex: 1 }}>||</Text>
          <Text style={{ flex: 13 }}>
            {currentUser.cl_curpj}
          </Text>
        </View>
      </View>
      <Button
        mode="outlined"
        onPress={() => navigation.navigate('EditProfile', {
          username: currentUser.cl_username
        })}
      >Edit Profile</Button>
      <View style={{ marginVertical: 2 }} />
      <Button
        mode="contained"
        onPress={() => onLogOutButton()}
      >Log Out</Button>
    </View>
  )

}

export default Settings


