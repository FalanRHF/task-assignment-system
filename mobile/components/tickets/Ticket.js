import firestore from '@react-native-firebase/firestore';

import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { StyleSheet, View, Text, TouchableOpacity, FlatList, Image } from 'react-native';
import { Button } from 'react-native-paper';

const Ticket = ({ route, navigation }) => {
  const { tc_id } = route.params
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

  const getTicket = (ticketID) => {
    console.info(`Ticket.getTicket(): called`)
    console.log(`ticketID=${ticketID}`)
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.get(`http://localhost:5050/api/mobile/helpdesk/getticketdata/${ticketID}`)
        console.log(`Ticket Data: \n${JSON.stringify(res.data[0])}`)
        setTicket({
          ...ticket,
          ...res.data[0]
        })
        setIsLoaded(true)
        console.info(`Ticket.getTicket(): success`)
        resolve(res.data[0].tc_filepath)
      } catch (error) {
        // console.log(`Ticket.getTicket(): Error: ${error}`)
        console.error(`Ticket.getTicket(): ERROR`)
        reject(error)
      }
    })
  }

  const getImage = (filePath) => {
    console.info(`Ticket.getImage(): called`)
    console.log(`filePath=${filePath}`)
    return new Promise(async (resolve, reject) => {
      try {
        const res = await axios.post(`http://localhost:5050/api/mobile/helpdesk/getfile`, {
          filePath: filePath
        })
        console.log(`res: ${JSON.stringify(res)}`)
        setImage(res.data)
        resolve('')
      } catch (error) {
        console.error(`Ticket.getImage(): ERROR`)
        reject(error)
      }
    })
  }


  const changeTicketStatus = async (update) => {
    console.log(`Ticket.changeTicketStatus: called`)
    console.log(`Ticket.changeTicketStatus: updating status to ${update}...`)
    try {
      // const res = (await firestore().collection('Ticket').where('tc_id', '==', tc_id).get()).docs[0].ref.update({
      //   'tc_status': update,
      // })
      const res = await axios.post(`http://localhost:5050/api/mobile/helpdesk/updateticketstatus`, {
        tc_id: tc_id,
        newStatus: update,
      })
      loadTicket()

      console.log('Ticket.js > changeTicketStatus(): Successful')
    } catch (error) {
      console.log(`Ticket.js > changeTicketStatus(): Error: ${error}`)
    }
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
            source={{ uri: `http://localhost:5050/api/mobile/uploads/${ticket.tc_filepath}` }}
            style={{ aspectRatio: 1, resizeMode: 'contain', maxHeight: 200 }}
          />
        </View>
      )
    }
  }

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Ticket data is loading...</Text>
      </View>
    )
    // }
    // if (image != null) {
    //   console.log(`image type: ${image}`)
    //   return (
    //     <View>
    //       <Text>LMAO</Text>
    //       <Image
    //         source={{ uri: `http://localhost:5050/api/mobile/uploads/${ticket.tc_filepath}` }}
    //       />
    //     </View>
    //   )
    // }
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
          <Text style={{ ...styles.tableItem, flex: 1 }}>FILE</Text>
          <View style={{ ...styles.tableItem, flex: 2 }}>{hasImage()}</View>

        </View>
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
