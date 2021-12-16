import firestore from '@react-native-firebase/firestore';

import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Button } from 'react-native-paper';

const Ticket = ({ route, navigation }) => {
  const { tc_id } = route.params
  const [ticket, setTicket] = useState({ isLoading: true })
  const [rerender, setrerender] = useState(false)
  //console.log(`Rerender: ${rerender}`)

  const init = (ticket) => {
    setId(ticket.tc_id)
    setPjcode(ticket.tc_pjcode)
    setTitle(ticket.tc_title)
    setDetail(ticket.tc_detail)
    setCreatedat(ticket.tc_createdat)
    setStatus(ticket.tc_status)
    console.log(`init() called`)
  }

  // useEffect(() => {
  //   loadTicket()
  //   navigation.setOptions({ title: route.params.tc_id })
  //   return () => {
  //     setTicket({ isLoading: true })
  //     console.log(`Ticket.js unmounted`)
  //   }
  // }, [navigation])

  useEffect(() => {
    navigation.setOptions({
      title: route.params.tc_id, headerTitleStyle: {
        fontSize: 16
      },
    })
    const unsubscribe = navigation.addListener('focus', loadTicket);

    return unsubscribe;
  }, [navigation]);

  const loadTicket = async () => {
    console.log(`Ticket.loadTicket: ticketID=${tc_id}`)
    try {
      const axiosGetResponse = await axios.get(`http://localhost:5050/helpdesk/getticketdata/${tc_id}`)
      console.log(`Ticket Data: \n${JSON.stringify(axiosGetResponse.data[0])}`)
      setTicket({
        ...ticket,
        ...axiosGetResponse.data[0],
        isLoading: false,
      })
      //init(res.data)
      console.log(`Ticket.js > useEffect(): Successful`)
    } catch (error) {
      console.log(`Ticket.js > useEffect(): Error: ${error}`)
    }
  }

  const changeTicketStatus = async (update) => {
    console.log(`Ticket.changeTicketStatus: called`)
    console.log(`Ticket.changeTicketStatus: updating status to ${update}...`)
    try {
      // const res = (await firestore().collection('Ticket').where('tc_id', '==', tc_id).get()).docs[0].ref.update({
      //   'tc_status': update,
      // })
      const res = await axios.post(`http://localhost:5050/helpdesk/updateticketstatus`, {
        tc_id: tc_id,
        newStatus: update,
      })
      loadTicket()

      console.log('Ticket.js > changeTicketStatus(): Successful')
    } catch (error) {
      console.log(`Ticket.js > changeTicketStatus(): Error: ${error}`)
    }
    //rerender ? setrerender(false) : setrerender(true)
  }

  const renderButton = () => {
    if (ticket.tc_status == 'PENDING') {
      return (
        <View>
          <Button
            mode="contained"
            onPress={() => {
              console.log('Ticket.renderButton: navigating to UpdateTicket.js...');
              navigation.navigate('UpdateTicket', {
                tc_id: ticket.tc_id,
              });
            }}
          >Edit Ticket</Button>
          <Button
            mode="outlined"
            onPress={() => { console.log('Change pressed'); changeTicketStatus('IN PROGRESS'); }}
          >Change Status to "In Progress"</Button>
        </View>
      )
    }
    else if (ticket.tc_status == 'IN PROGRESS') {
      return (
        <View>
          <Button
            mode="outlined"
            onPress={() => { console.log('Change pressed'); changeTicketStatus('PENDING'); }}
          >Change Status to "Pending"</Button>
          <Button
            mode="outlined"
            onPress={() => { console.log('Change pressed'); changeTicketStatus('RESOLVED'); }}
          >Change Status to "RESOLVED"</Button>
        </View>
      )
    }
    return (
      <View>
        <Button color='green' title='RESOLVED' onPress={() => { console.log('Change pressed'); }} />
      </View>
    )
  }

  if (ticket.isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Ticket data is loading...</Text>
      </View>
    )
  }

  return (
    <View style={{ margin: 10 }}>
      <View style={{ borderWidth: 0.5, borderRadius: 5, borderColor: 'grey', marginVertical: 5 }}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ ...styles.tableItem, flex: 1, borderTopLeftRadius: 5 }}>TICKET ID</Text>
          <Text style={{ ...styles.tableItem, flex: 2, borderTopRightRadius: 5 }}>{ticket.tc_id}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Text style={{ ...styles.tableItem, flex: 1 }}>PROJECT CODE</Text>
          <Text style={{ ...styles.tableItem, flex: 2 }}>{ticket.tc_pjcode}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ ...styles.tableItem, flex: 1 }}>TITLE</Text>
          <Text style={{ ...styles.tableItem, flex: 2 }}>{ticket.tc_title}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ ...styles.tableItem, flex: 1 }}>DETAILS</Text>
          <Text style={{ ...styles.tableItem, flex: 2 }}>{ticket.tc_detail}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ ...styles.tableItem, flex: 1 }}>CREATED AT</Text>
          <Text style={{ ...styles.tableItem, flex: 2 }}>{ticket.tc_createdat.substr(6, 2)}/{ticket.tc_createdat.substr(4, 2)}/{ticket.tc_createdat.substr(0, 4)} {ticket.tc_createdat.substr(8, 2)}:{ticket.tc_createdat.substr(10, 2)}:{ticket.tc_createdat.substr(12, 2)}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ ...styles.tableItem, flex: 1, borderBottomLeftRadius: 5 }}>STATUS</Text>
          <Text style={{ ...styles.tableItem, flex: 2, borderBottomRightRadius: 5 }}>{ticket.tc_status}</Text>
        </View>
      </View>
      <View style={{ marginVertical: 10 }}>
        {renderButton()}
      </View>
    </View>
  )
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
  tableItem: {
    padding: 5,
    borderColor: 'grey',
    borderWidth: 0.5,
    fontSize: 12,
  },
  button: {
    marginVertical: 20,
    paddingVertical: 10,
  },
});


export default Ticket
