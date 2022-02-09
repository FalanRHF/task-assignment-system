import firestore from '@react-native-firebase/firestore';
import { current } from '@reduxjs/toolkit';

import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { Button } from 'react-native-paper'

//redux
import { useSelector } from 'react-redux'

import env from 'mobile/env.json'
const SERVER_DOMAIN = env.SERVER_DOMAIN

const Ticket = ({ route, navigation }) => {
  const { tc_id } = route.params
  const currentUser = useSelector(state => state.currentUser.value)
  const [ticket, setTicket] = useState({})
  const [imagePath, setImagePath] = useState('')
  const [isLoaded, setIsLoaded] = useState(false)
  const [image, setImage] = useState('')

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
    try {
      const filepath = await getTicket(tc_id)
      if (filepath != '' && filepath != null) {
        // const res = await getImage(filepath)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const getCurrentDate = () => {
    console.log(`NewTicket.onSubmitTicket.getCurrentDate: called`)
    return new Promise((resolve, reject) => {
      var now = new Date()
      var additionalHours = 0
      now.setTime(now.getTime() + (additionalHours * 60 * 60 * 1000))
      var y = now.getFullYear()
      var m = now.getMonth() + 1
      var d = now.getDate()
      var hh = now.getHours()
      var mm = now.getMinutes()
      var ss = now.getSeconds()
      var date = '' + y + (m < 10 ? '0' : '') + m + (d < 10 ? '0' : '') + d + (hh < 10 ? '0' : '') + hh + (mm < 10 ? '0' : '') + mm + (ss < 10 ? '0' : '') + ss
      if (date.length == 14) {
        console.log(`NewTicket.onSubmitTicket.getCurrentDate: resolve(${date})`)
        resolve(date)
      } else {
        reject(new Error('date.length != 14'))
      }
    })
  }


  const getTicket = (ticketID) => {
    console.info(`Ticket.getTicket(): called`)
    console.log(`ticketID=${ticketID}`)
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(`${SERVER_DOMAIN}/api/mobile/helpdesk/getticketdata/${ticketID}`)
        console.log(`Ticket Data: \n${JSON.stringify(res.data[0])}`)
        setTicket({
          ...ticket,
          ...res.data[0]
        })
        setIsLoaded(true)
        console.info(`Ticket.getTicket(): success`)
        resolve(res.data[0].tc_filepath)
      } catch (error) {
        console.error(`Ticket.getTicket(): ERROR`)
        reject(error)
      }
    })
  }


  const changeTicketStatus = async (update) => {
    console.log(`Ticket.changeTicketStatus: called`)
    console.log(`Ticket.changeTicketStatus: updating status to ${update}...`)

    try {
      let date = ''
      if (update == 'RESOLVED') {
        date = await getCurrentDate()
        console.log('date: ', date)
      }
      const res = await axios.post(`${SERVER_DOMAIN}/api/mobile/helpdesk/updateticketstatus`, {
        tc_id: tc_id,
        newStatus: update,
        tc_completeddate: date
      })
      loadTicket()

      console.log('Ticket.js > changeTicketStatus(): Successful')
    } catch (error) {
      console.log(`Ticket.js > changeTicketStatus(): Error: ${error}`)
    }
  }

  const renderButton = () => {
    if (currentUser.type == 'client') {
      if (ticket.tc_status == 'PENDING') {
        return (
          <View>
            <Button
              mode="contained"
              onPress={() => {
                console.log('Ticket.renderButton: navigating to UpdateTicket.js...')
                navigation.navigate('UpdateTicket', {
                  tc_id: ticket.tc_id,
                })
              }}
            >Edit Ticket</Button>
          </View>
        )
      }
      return (
        <View></View>
      )
    }
    if (ticket.tc_assignedto == currentUser.em_fullname) {
      if (ticket.tc_status == 'PENDING') {
        return (
          <View>
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
              onPress={() => { console.log('Change pressed'); changeTicketStatus('RESOLVED'); }}
            >Change Status to "RESOLVED"</Button>
          </View>
        )
      } return (
        <View>
          <Button color='green' title='RESOLVED' onPress={() => { console.log('Change pressed') }} />
        </View>
      )
    }
    return (
      <View></View>
    )

  }

  const hasImage = () => {
    if (ticket.tc_filepath == null || ticket.tc_filepath == "") {
      return (
        <View></View>
      )
    } else {
      console.log(ticket.tc_filepath)
      return (
        <View style={{ height: 200, padding: 0 }}>
          <Image
            source={{ uri: `${SERVER_DOMAIN}/${ticket.tc_filepath}` }}
            style={{ aspectRatio: 1, resizeMode: 'contain', maxHeight: 200 }}
          />
        </View>
      )
    }
  }

  const extraDetails = () => {
    if (currentUser.type == 'client') {
      return (
        <View></View>
      )
    }
    return (
      <View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ ...styles.tableItem, flex: 1 }}>ASSIGNED TO</Text>
          <Text style={{ ...styles.tableItem, flex: 2 }}>{ticket.tc_assignedto}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ ...styles.tableItem, flex: 1 }}>DUE DATE</Text>
          <Text style={{ ...styles.tableItem, flex: 2 }}>{ticket.tc_duedate == null ? '' : ticket.tc_duedate.substr(6, 2) + '/' + ticket.tc_duedate.substr(4, 2) + '/' + ticket.tc_duedate.substr(0, 4)}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ ...styles.tableItem, flex: 1 }}>PRIORITY</Text>
          <Text style={{ ...styles.tableItem, flex: 2 }}>{ticket.tc_priority}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ ...styles.tableItem, flex: 1 }}>COMPLETED DATE</Text>
          <Text style={{ ...styles.tableItem, flex: 2 }}>{ticket.tc_completeddate == null ? '' : ticket.tc_completeddate.substr(6, 2) + '/' + ticket.tc_completeddate.substr(4, 2) + '/' + ticket.tc_completeddate.substr(0, 4)}</Text>
        </View>
      </View>
    )
  }

  if (!isLoaded) {
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
          <Text style={{ ...styles.tableItem, flex: 1 }}>FILE</Text>
          <View style={{ ...styles.tableItem, flex: 2 }}>{hasImage()}</View>
        </View>
        {extraDetails()}
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ ...styles.tableItem, flex: 1, borderBottomLeftRadius: 5 }}>STATUS</Text>
          <Text style={{ ...styles.tableItem, flex: 2, borderBottomRightRadius: 5 }}>{ticket.tc_status}</Text>
        </View>
      </View>
      {/* <Image
        source={require('../../../backend_mobile/uploads/helpdesk/fanihehe.jpg')}

      /> */}


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
