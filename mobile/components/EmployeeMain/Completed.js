import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList } from 'react-native';
import { Button, Divider, Text } from 'react-native-paper';

import Loading from '../Loading'

import { useIsFocused } from '@react-navigation/native';

import { utils } from '@react-native-firebase/app';
import ImagePicker, { launchCamera, launchImageLibrary } from 'react-native-image-picker'

import { useSelector } from 'react-redux'

const Completed = ({ navigation }) => {
  // create bucket storage reference to not yet existing image

  const currentUser = useSelector(state => state.currentUser.value)
  const isFocused = useIsFocused()
  const [isLoaded, setIsLoaded] = useState(false)
  const [completedTicket, setCompletedTicket] = useState({})

  useEffect(() => {
    if (isFocused) {
      // console.log(`Employee.Completed.useEffect: called`)
      getCompletedTicket()
    }
  }, [isFocused])

  const getCompletedTicket = async () => {
    try {
      const res = await axios.get(`http://localhost:5050/api/mobile/helpdesk/resolvedticket/all`)
      console.log(`Completed Ticket Data: ${JSON.stringify(res.data)}`)
      setCompletedTicket(res.data)
      setIsLoaded(true)
    } catch (error) {
      console.log(`Home: getPendingTicket error: ${error}`)
    }
  }

  if (!isLoaded) {
    return (
      <Loading />
    )
  } else {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ marginHorizontal: 16 }}>
          <View style={{ paddingTop: 20, paddingBottom: 100 }}>
            <FlatList style={{ paddingBottom: 0 }}
              data={completedTicket}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Ticket', {
                    tc_id: item.tc_id
                  })}
                  style={{ ...styles.item, borderColor: '#4dc43b' }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.tc_title}</Text>
                  <Text style={{ fontSize: 10 }}>{item.tc_createdat.substr(6, 2) + '-' + item.tc_createdat.substr(4, 2) + '-' + item.tc_createdat.substr(0, 4) + ' ' + item.tc_createdat.substr(8, 2) + ':' + item.tc_createdat.substr(10, 2)}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.tc_id}
              refreshing={true}
            />
          </View>
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
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  separator: {
    marginVertical: 4,
    borderBottomColor: '#737373',
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  item: {
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#ffffff',
    borderWidth: 2.5,
    borderRadius: 10,
    elevation: 4,
  },
});


export default Completed