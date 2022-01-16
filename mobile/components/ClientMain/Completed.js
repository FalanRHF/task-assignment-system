import axios from 'axios';
import React, { Component, useState, useEffect, useCallback } from 'react'
import { StyleSheet, View, TouchableOpacity, FlatList } from 'react-native';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

import { Button, Divider, Text } from 'react-native-paper';

//redux
import { useSelector } from 'react-redux';
import { current } from '@reduxjs/toolkit';


const Completed = ({ navigation }) => {
  const isFocused = useIsFocused()
  const [curpjcode, setcurpjcode] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)
  const [completedTicket, setCompletedTicket] = useState([])
  const currentUser = useSelector(state => state.currentUser.value)
  navigation.setOptions({ title: 'Resolved Tickets' })

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {

  //   })
  //   return unsubscribe
  // }, [navigation])

  useEffect(() => {
    if (isFocused) {
      // console.log(`Client.Completed.useEffect: called`)
      getCompleted(currentUser.cl_cmcode)
    }
  }, [isFocused])

  const getCompleted = async (cmcode) => {
    console.log(`Completed.getCompleted: called`)
    try {
      console.log(`Company Code: ${cmcode}`)
      const res = await axios.get(`http://localhost:5050/api/mobile/helpdesk/completedticket/${cmcode}`)
      console.log(`Resolved Tickets Data: ${JSON.stringify(res.data)}`)
      setCompletedTicket(res.data)
      setIsLoaded(true)
    } catch (error) {
      console.log(`Completed.getCompleted: reject(${error})`)
    }
  }

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Completed is loading...</Text>
      </View>
    )
  } else if (currentUser.cl_cmcode == null) {
    return (
      <View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>No Active Project Code</Text>
        </View>
      </View>
    )
  } else {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ backgroundColor: '#f4b210', alignItems: 'center', paddingVertical: 2 }}>
          <Text style={{ fontSize: 12, fontWeight: 'bold' }}>Company Code: {currentUser.cl_cmcode}</Text>
        </View>
        <View style={{ marginHorizontal: 16 }}>
          <View style={{ paddingVertical: 20 }}>
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
    );
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
