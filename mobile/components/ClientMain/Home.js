import axios from 'axios';
import React, { useCallback, useState, useEffect } from 'react'
import { StyleSheet, View, SafeAreaView, TouchableOpacity, FlatList } from 'react-native';
import { Button, Divider, Text } from 'react-native-paper';
import { useFocusEffect, useIsFocused } from '@react-navigation/native';

import firebase from 'firebase';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import Loading from '../Loading'

//redux
import { useSelector } from 'react-redux'

const Separator = () => (
  <View style={styles.separator} />
)


const Home = ({ navigation }) => {
  const isFocused = useIsFocused()
  const [curpjcode, setcurpjcode] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)
  const [pendingTicket, setpendingTicket] = useState([])
  const currentUser = useSelector(state => state.currentUser.value)

  useEffect(() => {
    if (isFocused) {
      // console.log(`Client.Home.useEffect: called`)
      getPending(currentUser.cl_curpj)
    }
  }, [isFocused])

  const getPending = async (pjcode) => {
    try {
      console.log(`Project Code: ${currentUser.cl_curpj}`)
      const res = await axios.get(`http://localhost:5050/helpdesk/pendingticket/${pjcode}`)
      console.log(`Pending Tickets Data: ${JSON.stringify(res.data)}`)
      setpendingTicket(res.data)
      setIsLoaded(true)
    } catch (error) {
      console.log(`Home: getPending error: ${error}`)
    }
  }

  if (!isLoaded) {
    return (
      <Loading />
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
        <View style={{ marginHorizontal: 16, flex: 1 }}>
          <View style={{ alignItems: 'center', paddingVertical: 30 }}>
            <Button
              mode="contained"
              onPress={() => navigation.navigate('NewTicket', {
                code: currentUser.cl_curpj,
              })}>Add New Ticket</Button>
          </View>
          <Divider style={{ borderWidth: 0.5, borderColor: 'grey' }} />
          <View style={{ flex: 1, marginVertical: 0 }}>
            <FlatList style={{ flex: 1, marginBottom: 0, borderWidth: 0 }}
              data={pendingTicket}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Ticket', {
                    tc_id: item.tc_id
                  })}
                  style={{ ...styles.item, borderColor: item.tc_status == 'IN PROGRESS' ? '#f2bc46' : '#e0e0e0' }}>
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
    marginVertical: 7.5,
    marginHorizontal: 5,
    backgroundColor: '#ffffff',
    borderWidth: 2.5,
    borderRadius: 10,
    elevation: 4,
  },
});

export default Home
