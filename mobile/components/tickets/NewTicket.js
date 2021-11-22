import React, { Component, useState, useEffect } from 'react';
import { View } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { DropdownMenu } from 'react-native-dropdown-menu';

import auth from '@react-native-firebase/auth';
import axios from 'axios';


import firestore from '@react-native-firebase/firestore';


const NewTicket = ({ route, navigation }) => {
  const [title, settitle] = useState('')
  const [detail, setdetail] = useState('')
  const [pjcode, setpjcode] = useState(route.params.code)
  const [ticket, setTicket] = useState([])

  // useEffect(() => {
  //   return () => {}
  // }, [])

  const setTicketData = (key, value) => {
    var data = {};
    data[key] = value;
    setTicket({
      ...ticket,
      ...data,
    })
  }

  const getCurrentDate = () => {
    console.log(`NewTicket.onSubmitTicket.getCurrentDate: called`)
    return new Promise((resolve, reject) => {
      var now = new Date()
      now.setTime(now.getTime() + 8 * 60 * 60 * 1000)
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

  const getLatestTicketID = (projectID) => {
    console.log(`NewTicket.onSubmitTicket.getLatestTicketID(${projectID}): called`)
    return new Promise(async (resolve, reject) => {
      try {
        const axiosGetResponse = await axios.get(`http://localhost:5050/helpdesk/lastid/${projectID}`)

        console.log(`NewTicket.onSubmitTicket.getLatestTicketID(${projectID}).axiosGetResponse: ${JSON.stringify(axiosGetResponse.data)}`)
        if (axiosGetResponse.data == "") {
          //console.log("00")
          resolve("00")
        } else {
          //console.log(axiosGetResponse.data[0].tc_id.substr(-2, 2))
          resolve(axiosGetResponse.data[0].tc_id.substr(-2, 2))
        }
      } catch (error) {
        reject(error)
      }
    })
  }

  const createNewTicket = (ticketID, date) => {
    console.log(`NewTicket.onSubmitTicket.createNewTicket: called`)
    return new Promise(async (resolve, reject) => {
      try {
        const axiosPostResponse = await axios.post(`http://localhost:5050/helpdesk/postnewticket`, {
          tc_id: ticketID,
          tc_pjcode: pjcode,
          tc_title: title,
          tc_detail: detail,
          tc_createdat: date,
          tc_status: 'PENDING',
        })
        resolve(axiosPostResponse)
      } catch (error) {
        reject(error)
      }
    })
  }

  const onSubmitTicket = async () => {
    console.log(`NewTicket.onSubmitTicket: called`)
    try {
      const date = await getCurrentDate()
      console.log(`NewTicket.onSubmitTicket: date=${date}`)
      var ticketID = pjcode + date.substr(0, 8)
      var latestID = await getLatestTicketID(ticketID)
      console.log(`NewTicket.onSubmitTicket: latestID=${latestID}`)
      ticketID = ticketID + (++latestID < 10 ? '0' : '') + latestID
      console.log(`NewTicket.onSubmitTicket: next projectID=${ticketID}`)
      const nice = await createNewTicket(ticketID, date)
      navigation.popToTop()
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <View>
      <TextInput
        placeholder="Title"
        mode='outlined'
        onChangeText={(title) => settitle(title)}
      />
      <TextInput
        placeholder="Detail"
        mode='outlined'
        onChangeText={(detail) => setdetail(detail)}
      />
      <Button
        mode="contained"
        onPress={() => onSubmitTicket()}
      >Submit</Button>
    </View>
  )
}

export default NewTicket
