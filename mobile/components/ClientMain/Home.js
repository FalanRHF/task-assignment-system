import axios from 'axios';
import React, { Component, useState, useEffect } from 'react'
import { StyleSheet, View, TouchableOpacity, FlatList } from 'react-native';
import { Button, Divider, Text } from 'react-native-paper';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

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
  const isFocused = useIsFocused()
  const [curpjcode, setcurpjcode] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)
  const [pendingTicket, setpendingTicket] = useState([])
  const currentUser = useSelector(state => state.currentUser.value)

  useEffect(() => {
    // setIsLoaded(false)
    // navigation.setOptions({ title: 'Home' })
    console.log(`Home.js: useEffect() activated`)
    // const unsubscribe = navigation.addListener('focus', () => {
    //   console.log(`Home.useEffect.addListener.focus triggered`)
    getPending()
    // });

    // return unsubscribe;
  }, [isFocused]);

  // const init = async () => {
  //   console.log(`Home.init: called`)
  //   try {
  //     const pjcode = await getCurrentPjcode()
  //     navigation.setOptions({ title: `Home` })
  //     if (currentUser.cl_curpj != null) {
  //       // navigation.setOptions({ title: `Home (${pjcode})` })
  //       const res = await getPending(pjcode)
  //     }
  //     // else {
  //     //   navigation.setOptions({ title: `Home` })
  //     // }
  //   } catch (error) {
  //     console.log(`Home.init: ERROR`)
  //     console.log(error.message)
  //   }
  //   console.log(`setting isLoaded to false...`)
  //   setIsLoaded(false)
  // }

  // const getCurrentPjcode = () => {
  //   console.log(`Home.init.getCurrentPjcode: called`)
  //   return new Promise(async (resolve, reject) => {
  //     const uid = auth().currentUser.uid
  //     try {
  //       const axiosGetResponse = await axios.get(`http://localhost:5050/auth/getdata/client/${uid}`)
  //       console.log(`${JSON.stringify(axiosGetResponse.data)}`)
  //       const { cl_curpj } = axiosGetResponse.data[0]
  //       setcurpjcode(cl_curpj)
  //       console.log(`Home.init.getCurrentPjcode: calling resolve(${cl_curpj})...`)
  //       resolve(cl_curpj)
  //     } catch (error) {
  //       reject(error)
  //     }
  //   })
  // }

  const getPending = async () => {
    // console.log(`Home.getPending: called`)
    // return new Promise(async (resolve, reject) => {
    try {
      console.log(`Project Code: ${currentUser.cl_curpj}`)
      const res = await axios.get(`http://localhost:5050/helpdesk/pendingticket/${currentUser.cl_curpj}`)
      // let pendingarray = []
      // res.forEach(ticket => {
      //   pendingarray.push(ticket.data())
      // })
      console.log(`Pending Tickets Data: ${JSON.stringify(res.data)}`)
      setpendingTicket(res.data)
      setIsLoaded(true)
      // resolve(res)
    } catch (error) {
      console.log(`Home: getPending error: ${error}`)
      // reject(error)
    }

    // })
  }
  console.log(`isLoaded: ${isLoaded}`)
  if (!isLoaded) {
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
      <View style={{ flex: 1 }}>
        <View style={{ backgroundColor: '#f4b210', alignItems: 'center', paddingVertical: 2 }}>
          <Text style={{ fontSize: 12, fontWeight: 'bold' }}>Project Code: {currentUser.cl_curpj}</Text>
        </View>
        <View style={{ marginHorizontal: 16 }}>
          <View style={{ alignItems: 'center', paddingVertical: 30 }}>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('NewTicket', {
                code: curpjcode,
              })}>Add New Ticket</Button>
          </View>
          <Divider style={{ borderWidth: 0.5, borderColor: 'grey' }} />
          <View style={{ paddingTop: 20, paddingBottom: 100 }}>
            <FlatList style={{ paddingBottom: 0 }}
              data={pendingTicket}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Ticket', {
                    tc_id: item.tc_id
                  })}
                  style={{ ...styles.item, borderColor: item.tc_status == 'IN PROGRESS' ? '#f2bc46' : 'white' }}>
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
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#ffffff',
    borderWidth: 5,
    borderRadius: 10,
    elevation: 4,
  },
});

export default Home
