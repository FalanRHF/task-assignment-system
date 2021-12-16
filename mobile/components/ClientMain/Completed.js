import axios from 'axios';
import React, { Component, useState, useEffect } from 'react'
import { StyleSheet, View, TouchableOpacity, FlatList } from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchClient } from '../../oldredux/actions';

import firebase from 'firebase';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import { Button, Divider, Text } from 'react-native-paper';

//redux
import { useSelector } from 'react-redux';
import { current } from '@reduxjs/toolkit';


const Separator = () => (
  <View style={styles.separator} />
);

let completedTicket = []


const Home = ({ navigation }) => {
  const isFocused = useIsFocused()
  const [curpjcode, setcurpjcode] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)
  const [completedTicket, setCompletedTicket] = useState([])
  const currentUser = useSelector(state => state.currentUser.value)


  useEffect(() => {
    // setIsLoaded(false)
    navigation.setOptions({ title: 'Resolved Tickets' })
    // console.log(`Completed.js: useEffect() activated`)
    // const unsubscribe = navigation.addListener('focus', () => {
    //   console.log(`Completed.useEffect.addListener.focus triggered`)
    //   init()
    // });

    getCompleted()

    // return unsubscribe;
  }, [isFocused]);

  // const init = async () => {
  //   getCurrentPjcode().then()
  //   await getPending()
  // }

  // const init = async () => {
  //   console.log(`Completed.init: called`)
  //   try {
  //     const pjcode = await getCurrentPjcode()
  //     if (pjcode != null) {
  //       navigation.setOptions({ title: `Resolved (${pjcode})` })
  //       const res = await getCompleted(pjcode)
  //     }
  //     else {
  //       navigation.setOptions({ title: `Resolved` })
  //     }
  //     //console.log(`Home.init: pendingticket=${completedTicket}`)
  //   } catch (error) {
  //     console.log(error)
  //   }
  //   console.log(`setting isLoading to false...`)
  //   setisLoading(false)
  // }

  // const getCurrentPjcode = () => {
  //   console.log(`Completed.init.getCurrentPjcode: called`)
  //   return new Promise(async (resolve, reject) => {
  //     const uid = auth().currentUser.uid
  //     try {
  //       const axiosGetResponse = await axios.get(`http://localhost:5050/auth/getdata/client/${uid}`)
  //       console.log(`${JSON.stringify(axiosGetResponse.data)}`)
  //       const { cl_curpj } = axiosGetResponse.data[0]
  //       setcurpjcode(cl_curpj)
  //       console.log(`Completed.init.getCurrentPjcode: calling resolve(${cl_curpj})...`)
  //       resolve(cl_curpj)
  //     } catch (error) {
  //       reject(error)
  //     }
  //   })
  // }

  const getCompleted = async () => {
    console.log(`Completed.getCompleted: called`)
    // return new Promise(async (resolve, reject) => {
    try {
      console.log(`Project Code: ${currentUser.cl_curpj}`)
      const res = await axios.get(`http://localhost:5050/helpdesk/completedticket/${currentUser.cl_curpj}`)
      // let pendingarray = []
      // res.forEach(ticket => {
      //   pendingarray.push(ticket.data())
      // })
      console.log(`Resolved Tickets Data: ${JSON.stringify(res.data)}`)
      setCompletedTicket(res.data)
      setIsLoaded(true)
      // resolve(res)
    } catch (error) {
      console.log(`Completed.getCompleted: reject(error)`)
      // reject(error)
    }

    // })
  }
  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Completed is loading...</Text>
      </View>
    )
  } else if (currentUser.cl_curpj == null) {
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
          <View style={{ paddingTop: 20, paddingBottom: 100 }}>
            <FlatList style={{ paddingBottom: 0 }}
              data={completedTicket}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Ticket', {
                    tc_id: item.tc_id
                  })}
                  style={{ ...styles.item, borderColor: 'green' }}>
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
    borderWidth: 5,
    borderRadius: 10,
    elevation: 4,
  },
});

export default Home
