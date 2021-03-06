import React, { Component, useState, useEffect } from 'react'
import { StyleSheet, View, Text } from 'react-native';
import { Button } from 'react-native-paper';
import axios from 'axios'
import auth from '@react-native-firebase/auth'
import DropDownPicker from 'react-native-dropdown-picker';
import DropdownMenu from 'react-native-dropdown-menu';

import { useDispatch, useSelector } from 'react-redux'
import { setUser, resetUser } from '../../redux/currentUser';

import { useIsFocused } from '@react-navigation/native';

import env from 'mobile/env.json'
const SERVER_DOMAIN = env.SERVER_DOMAIN


const Settings = ({ navigation }) => {
  const isFocused = useIsFocused()
  const currentUser = useSelector(state => state.currentUser.value)
  const dispatch = useDispatch()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (isFocused) {
      // console.log('Client.Settings.useEffect: called')
      navigation.setOptions({ title: 'Settings' })
      setIsLoaded(true)
    }

    // comment [S]
    // const unsubscribe = navigation.addListener('focus', () => {
    //   console.log(`Home.useEffect.addListener.focus triggered`)
    //   getUserDetails
    // }
    // );
    // //comment [E]

    // // comment [S]
    // // const unsubscribe = () => {
    // //   console.log(`${auth().currentUser.email} logging out!`)
    // //   auth()
    // //     .signOut()
    // //   getUserProfile()
    // // }
    // return unsubscribe;
    // //comment [E]
    return () => {
      setIsLoaded(false)
    }
  }, [isFocused])

  const getUserDetails = async () => {
    console.log(`Settings.getUserDetails: called`)
    const uid = auth().currentUser.uid
    try {
      const axiosGetResponse = await axios.get(`${SERVER_DOMAIN}/api/mobile/auth/getdata/client/${uid}`)
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
    dispatch(resetUser())
  }

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Settings is loading...</Text>
        <Button
          mode="contained"
          onPress={() => onLogOutButton()}
        >Log Out</Button>
      </View>
    )
  } else {
    return (
      <View style={{ flex: 1, margin: 10 }}>
        <View style={{ borderWidth: 0.5, borderRadius: 5, borderColor: 'grey', marginVertical: 5 }}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ ...styles.tableItem, flex: 1, borderTopLeftRadius: 5 }}>FULL NAME</Text>
            <Text style={{ ...styles.tableItem, flex: 2, borderTopRightRadius: 5 }}>{currentUser.cl_fullname}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ ...styles.tableItem, flex: 1 }}>EMAIL</Text>
            <Text style={{ ...styles.tableItem, flex: 2 }}>{currentUser.cl_email}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ ...styles.tableItem, flex: 1 }}>COMPANY NAME</Text>
            <Text style={{ ...styles.tableItem, flex: 2 }}>{currentUser.cm_name}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ ...styles.tableItem, flex: 1 }}>COMPANY CODE</Text>
            <Text style={{ ...styles.tableItem, flex: 2 }}>{currentUser.cl_cmcode}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ ...styles.tableItem, flex: 1, borderBottomLeftRadius: 5 }}>PHONE NO.</Text>
            <Text style={{ ...styles.tableItem, flex: 2, borderBottomRightRadius: 5 }}>
              {currentUser.cl_phonenum}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('EditProfile', {
              username: currentUser.cl_username
            })}
          >Edit Profile</Button>
          <Button
            mode="contained"
            onPress={() => onLogOutButton()}
          >Log Out</Button>
        </View>
      </View>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  title: {
    fontSize: 22,
  },
  tableItem: {
    padding: 5,
    borderColor: 'grey',
    borderWidth: 0.5,
    fontSize: 12,
  },
});

export default Settings


