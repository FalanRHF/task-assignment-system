import axios from 'axios';
import React, { Component, useState, useEffect } from 'react'
import { StyleSheet, Button, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchClient } from '../../oldredux/actions';

import firebase from 'firebase';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const Separator = () => (
  <View style={styles.separator} />
);

let completedTicket = []


const Home = ({ navigation }) => {
  const [curpjcode, setcurpjcode] = useState('')
  const [isLoading, setisLoading] = useState(true)
  const [completedTicket, setcompletedTicket] = useState([])

  useEffect(() => {
    navigation.setOptions({ title: 'Resolved Tickets' })
    console.log(`Completed.js: useEffect() activated`)
    const unsubscribe = navigation.addListener('focus', () => {
      console.log(`Completed.useEffect.addListener.focus triggered`)
      init()
    });

    return unsubscribe;
  }, [navigation]);

  // const init = async () => {
  //   getCurrentPjcode().then()
  //   await getPending()
  // }

  const init = async () => {
    console.log(`Completed.init: called`)
    try {
      const pjcode = await getCurrentPjcode()
      if (pjcode != null) {
        navigation.setOptions({ title: `Resolved (${pjcode})` })
        const res = await getCompleted(pjcode)
      }
      else {
        navigation.setOptions({ title: `Resolved` })
      }
      //console.log(`Home.init: pendingticket=${completedTicket}`)
    } catch (error) {
      console.log(error)
    }
    console.log(`setting isLoading to false...`)
    setisLoading(false)
  }

  const getCurrentPjcode = () => {
    console.log(`Completed.init.getCurrentPjcode: called`)
    return new Promise(async (resolve, reject) => {
      const uid = auth().currentUser.uid
      try {
        const axiosGetResponse = await axios.get(`http://localhost:5050/auth/getdata/client/${uid}`)
        console.log(`${JSON.stringify(axiosGetResponse.data)}`)
        const { cl_curpj } = axiosGetResponse.data[0]
        setcurpjcode(cl_curpj)
        console.log(`Completed.init.getCurrentPjcode: calling resolve(${cl_curpj})...`)
        resolve(cl_curpj)
      } catch (error) {
        reject(error)
      }
    })
  }

  const getCompleted = (pjcode) => {
    console.log(`Completed.init.getCompleted: called`)
    return new Promise(async (resolve, reject) => {
      try {
        console.log(`Project Code: ${pjcode}`)
        const res = await axios.get(`http://localhost:5050/helpdesk/completedticket/${pjcode}`)
        // let pendingarray = []
        // res.forEach(ticket => {
        //   pendingarray.push(ticket.data())
        // })
        console.log(`Resolved Tickets Data: ${JSON.stringify(res.data)}`)
        setcompletedTicket(res.data)
        resolve(res)
      } catch (error) {
        console.log(`Completed.getCompleted: reject(error)`)
        reject(error)
      }

    })
  }
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Completed is loading...</Text>
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
        <View style={{ paddingTop: 20, paddingBottom: 100 }}>
          <FlatList style={{ paddingBottom: 0 }}
            data={completedTicket}
            renderItem={({ item }) => (
              <TouchableOpacity
                onPress={() => navigation.navigate('Ticket', {
                  tc_id: item.tc_id
                })}
                style={{ ...styles.item, backgroundColor: 'green' }}>
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
