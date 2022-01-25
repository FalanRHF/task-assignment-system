import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { StyleSheet, View, TouchableOpacity, FlatList } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

//redux
import { useSelector } from 'react-redux';

import { RadioButton, Divider, Button, Text } from 'react-native-paper';

import firebase from 'firebase';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';


const Home = ({ navigation }) => {
  const isFocused = useIsFocused()
  const currentUser = useSelector(state => state.currentUser.value)
  const [checked, setChecked] = useState('all')
  const [allPendingTicket, setAllPendingTicket] = useState({})
  const [isLoaded, setIsLoaded] = useState(false)
  console.log(`checked: ${checked}`)

  useEffect(() => {
    if (isFocused) {
      // console.log(`Employee.Home.useEffect: called`)
      getAllPendingTicket()
    }
  }, [isFocused])

  const getAllPendingTicket = async () => {
    try {
      const res = await axios.get(`http://localhost:5050/api/mobile/helpdesk/pendingticket/all`)
      console.log(`Pending Ticket Data: ${JSON.stringify(res.data)}`)
      setAllPendingTicket(res.data)
      setIsLoaded(true)
    } catch (error) {
      console.log(`Home: getPendingTicket error: ${error}`)
    }
  }

  const showTouchableOpacity = (item) => {
    if (checked == 'all' || item.tc_assignedto == currentUser.em_fullname) {
      return (
        <TouchableOpacity
          onPress={() => navigation.navigate('Ticket', {
            tc_id: item.tc_id
          })}
          style={{ ...styles.item, borderColor: item.tc_status == 'IN PROGRESS' ? '#f2bc46' : '#e0e0e0' }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.tc_title}</Text>
          <Text style={{ fontSize: 10 }}>{item.tc_createdat.substr(6, 2) + '-' + item.tc_createdat.substr(4, 2) + '-' + item.tc_createdat.substr(0, 4) + ' ' + item.tc_createdat.substr(8, 2) + ':' + item.tc_createdat.substr(10, 2)}</Text>
        </TouchableOpacity>
      )
    } else {
      return (
        <View></View>
      )
    }
  }

  return (
    <View style={{ flex: 1, marginHorizontal: 16 }}>
      <View style={{}}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 5 }}>
          <RadioButton
            color="#f4b210"
            uncheckedColor='#f4b210'
            value="all"
            status={checked === 'all' ? 'checked' : 'unchecked'}
            onPress={() => setChecked('all')}
          />
          <Text style={{ marginRight: 10 }}>ALL</Text>
          <RadioButton
            color="#f4b210"
            uncheckedColor='#f4b210'
            value="me"
            status={checked === 'me' ? 'checked' : 'unchecked'}
            onPress={() => setChecked('me')}
          />
          <Text>ASSIGNED TO ME</Text>
        </View>
      </View>
      <Divider style={{ marginHorizontal: 10 }} />
      <View style={{ flex: 1, marginVertical: 0 }}>
        <FlatList style={{ flex: 1, marginBottom: 0, borderWidth: 0 }}
          data={allPendingTicket}
          renderItem={({ item }) => (
            showTouchableOpacity(item))}
          keyExtractor={(item) => item.tc_id}
          refreshing={true}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    marginHorizontal: 16,
  },
  title: {
    fontSize: 12,
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
    marginVertical: 7.5,
    marginHorizontal: 5,
    backgroundColor: '#ffffff',
    borderWidth: 2.5,
    borderRadius: 10,
    elevation: 4,
  },
});

export default Home
