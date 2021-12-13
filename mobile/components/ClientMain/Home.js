import axios from 'axios';
import React, { Component, useState, useEffect } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Button } from 'react-native-paper';
import { useFocusEffect } from '@react-navigation/native';

import firebase from 'firebase';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

//redux
import { useSelector } from 'react-redux'

const Separator = () => (
  <View style={styles.separator} />
);

let pendingTicket = []

const Home = ({ navigation }) => {
  const [curpjcode, setcurpjcode] = useState('')
  const [isLoading, setisLoading] = useState(true)
  const [pendingTicket, setpendingTicket] = useState([])
  const currentUser = useSelector(state => state.currentUser.value)

  useEffect(() => {
    navigation.setOptions({ title: 'Home' })
    console.log(`Home.js: useEffect() activated`)
    const unsubscribe = navigation.addListener('focus', () => {
      console.log(`Home.useEffect.addListener.focus triggered`)
      init()
    });

    return unsubscribe;
  }, [navigation]);

  const init = async () => {
    console.log(`Home.init: called`)
    try {
      const pjcode = await getCurrentPjcode()
      if (currentUser.cl_curpj != null) {
        navigation.setOptions({ title: `Home (${pjcode})` })
        const res = await getPending(pjcode)
      }
      else {
        navigation.setOptions({ title: `Home` })
      }
    } catch (error) {
      console.log(`Home.init: ERROR`)
      console.log(error.message)
    }
    console.log(`setting isLoading to false...`)
    setisLoading(false)
  }

  const getCurrentPjcode = () => {
    console.log(`Home.init.getCurrentPjcode: called`)
    return new Promise(async (resolve, reject) => {
      const uid = auth().currentUser.uid
      try {
        const axiosGetResponse = await axios.get(`http://localhost:5050/auth/getdata/client/${uid}`)
        console.log(`${JSON.stringify(axiosGetResponse.data)}`)
        const { cl_curpj } = axiosGetResponse.data[0]
        setcurpjcode(cl_curpj)
        console.log(`Home.init.getCurrentPjcode: calling resolve(${cl_curpj})...`)
        resolve(cl_curpj)
      } catch (error) {
        reject(error)
      }
    })
  }

  const getPending = (pjcode) => {
    console.log(`Home.init.getPending: called`)
    return new Promise(async (resolve, reject) => {
      try {
        console.log(`Project Code: ${pjcode}`)
        const res = await axios.get(`http://localhost:5050/helpdesk/pendingticket/${currentUser.cl_curpj}`)
        // let pendingarray = []
        // res.forEach(ticket => {
        //   pendingarray.push(ticket.data())
        // })
        console.log(`Pending Tickets Data: ${JSON.stringify(res.data)}`)
        setpendingTicket(res.data)
        resolve(res)
      } catch (error) {
        console.log(`Home: getPending error: ${error}`)
        reject(error)
      }

    })
  }
  console.log(`isLoading: ${isLoading}`)
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Home is loading...</Text>
      </View>
    )
  } else if (curpjcode == null) {
    return (
      <View>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text>No Active Project Code</Text>
        </View>
      </View>
    )
  } else {
    return (
      <View style={{ flex: 1, marginHorizontal: 16 }}>
        <View style={{ alignItems: 'center', paddingVertical: 30 }}>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('NewTicket', {
              code: curpjcode,
            })}>Add New Ticket</Button>
        </View>
        <Separator />
        <View style={{ paddingTop: 20, paddingBottom: 100 }}>
          <FlatList style={{ paddingBottom: 0 }}
            data={pendingTicket}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => navigation.navigate('Ticket', {
                  tc_id: item.tc_id
                })}
                style={{ ...styles.item, backgroundColor: item.tc_status == 'IN PROGRESS' ? '#f4b120' : 'white' }}>
                <Text style={styles.title}>{item.tc_title}</Text>
              </TouchableOpacity>
            )}
            keyExtractor={(item) => item.tc_id}
            refreshing={true}
          />
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
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#ffffff',
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 50
  },
});

export default Home
