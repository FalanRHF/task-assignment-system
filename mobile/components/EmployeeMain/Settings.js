import React, { useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import axios from 'axios'
import auth from '@react-native-firebase/auth'

import { useIsFocused } from '@react-navigation/native';


import { useDispatch, useSelector } from 'react-redux'
import { setUser, resetUser } from '../../redux/currentUser';

import Loading from '../Loading'


const Settings = ({ navigation }) => {
  const isFocused = useIsFocused()
  const currentUser = useSelector(state => state.currentUser.value)
  const dispatch = useDispatch()
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (isFocused) {
      // console.log('Employee.Settings.useEffect: called')
      navigation.setOptions({ title: 'Settings' })
      setIsLoaded(true)
    }
  }, [isFocused])

  const getUserDetails = async () => {
    console.log(`Settings.getUserDetails: called`)
    const uid = auth().currentUser.uid
    try {
      const axiosGetResponse = await axios.get(`http://localhost:5050/api/mobile/auth/getdata/client/${uid}`)
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
      <View style={{ flex: 1 }}>
        <Loading />
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10, backgroundColor: 'white' }}>
          <Button
            mode="contained"
            onPress={() => onLogOutButton()}
          >Log Out</Button>
        </View>
      </View>
    )
  } else {
    return (
      <View style={{ flex: 1, margin: 10 }}>
        <View style={{ borderWidth: 0.5, borderRadius: 5, borderColor: 'grey', marginVertical: 5 }}>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ ...styles.tableItem, flex: 1, borderTopLeftRadius: 5 }}>FULL NAME</Text>
            <Text style={{ ...styles.tableItem, flex: 2, borderTopRightRadius: 5 }}>{currentUser.em_fullname}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ ...styles.tableItem, flex: 1 }}>USERNAME</Text>
            <Text style={{ ...styles.tableItem, flex: 2 }}>@{currentUser.em_username}</Text>
          </View>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ ...styles.tableItem, flex: 1, borderBottomLeftRadius: 5 }}>EMAIL</Text>
            <Text style={{ ...styles.tableItem, flex: 2, borderBottomRightRadius: 5 }}>
              {currentUser.em_email}
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}>
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


