import firestore from '@react-native-firebase/firestore';

import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';

import { TextInput, Button } from 'react-native-paper';

const Ticket = ({ route, navigation }) => {
  const { tc_id } = route.params
  const [isLoading, setisLoading] = useState(true)
  const [title, settitle] = useState('')
  const [detail, setdetail] = useState('')


  useEffect(() => {
    loadTicket()
    navigation.setOptions({
      title: route.params.tc_id, headerTitleStyle: {
        fontSize: 16
      },
    })
    return () => {
      setisLoading(true)
    }
  }, [navigation])

  const loadTicket = async () => {
    console.log(`UpdateTicket.loadTicket: called`)
    console.log(`UpdateTicket.loadTicket: ticketID=${tc_id}`)
    try {
      const axiosGetResponse = await axios.get(`http://localhost:5050/api/mobile/helpdesk/getticketdata/${tc_id}`)
      console.log(`Ticket Data: \n${JSON.stringify(axiosGetResponse.data[0])}`)
      settitle(axiosGetResponse.data[0].tc_title)
      setdetail(axiosGetResponse.data[0].tc_detail)
      setisLoading(false)
      console.log(`UpdateTicket.loadTicket: Success`)
    } catch (error) {
      console.log(`UpdateTicket.loadTicket: [ERROR] = ${error}`)
    }
  }

  const updateTicketDetail = async () => {
    console.log(`UpdateTicket.updateTicketDetail: called`)
    try {
      const axiosPostResponse = await axios.post(`http://localhost:5050/api/mobile/helpdesk/updateticketdetails`, {
        tc_id: tc_id,
        tc_title: title.trim().toUpperCase(),
        tc_detail: detail.trim(),
      })
      console.log(`UpdateTicket.updateTicketDetail: axiosPostResponse=${axiosPostResponse.data[0]}`)
      console.log(`UpdateTicket.updateTicketDetail: success`)
    } catch (error) {
      console.log(`UpdateTicket.updateTicketDetail: [ERROR] = ${error}`)
    }
    navigation.goBack()
  }

  const deleteTicket = async () => {
    console.log(`UpdateTicket.deleteTicket: called`)
    try {
      const axiosPostResponse = await axios.post(`http://localhost:5050/api/mobile/helpdesk/deleteticket`, {
        tc_id: tc_id,
      })
      console.log(`UpdateTicket.deleteTicket: axiosPostResponse=${axiosPostResponse.data[0]}`)
      console.log(`UpdateTicket.deleteTicket: Ticket ${tc_id} deleted`)
      console.log(`UpdateTicket.deleteTicket: success`)
    } catch (error) {
      console.log(`UpdateTicket.deleteTicket: [ERROR] = ${error}`)
    }
    navigation.popToTop()
  }

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Ticket data is loading...</Text>
      </View>
    )
  } else {
    return (
      <View style={{ flex: 1, margin: 10 }}>
        <View style={{ marginVertical: 5 }}>
          <TextInput
            label='TITLE'
            placeholder='TITLE'
            mode='outlined'
            value={title}
            onChangeText={(title) => settitle(title)}
          />
        </View>
        <View style={{ marginVertical: 5 }}>
          <TextInput
            label='DETAILS'
            placeholder="DETAILS"
            mode='outlined'
            value={detail}
            onChangeText={(detail) => setdetail(detail)}
          />
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}>
          <Button
            mode="contained"
            onPress={() => updateTicketDetail()}>Update Ticket</Button>
          <Button
            mode="contained"
            style={{ backgroundColor: 'red', textColor: 'white' }}
            onPress={() => deleteTicket()}>Delete Ticket</Button></View>
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
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#ffffff',
    borderColor: '#000000',
    borderWidth: 1,
    borderRadius: 50
  },
  button: {
    marginVertical: 20,
    paddingVertical: 10,
  },
});


export default Ticket
