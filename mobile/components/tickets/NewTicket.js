import React, { Component, useState, useEffect } from 'react';
import { View, Image } from 'react-native';
import { TextInput, Button, Text, Chip } from 'react-native-paper';

import auth from '@react-native-firebase/auth';
import axios from 'axios';

import ImagePicker, { launchCamera, launchImageLibrary } from 'react-native-image-picker'

const NewTicket = ({ route, navigation }) => {
  const [title, settitle] = useState('')
  const [detail, setdetail] = useState('')
  const { cmcode } = route.params
  // const [ticket, setTicket] = useState([])
  // const [imageExist, setImageExist] = useState(false)
  const [imageAsset, setImageAsset] = useState({ imageExist: false })
  // const [uri, setUri] = useState('')
  // const [uploadedFile, setUploadedFile] = useState(null)

  // useEffect(() => {
  //   return () => {}
  // }, [])

  // const setTicketData = (key, value) => {
  //   var data = {}
  //   data[key] = value
  //   setTicket({
  //     ...ticket,
  //     ...data,
  //   })
  // }
  const submitButton = () => {
    if (title.trim() != '' && detail.trim() != '') {
      return (
        <View>
          <Button
            mode="contained"
            onPress={() => onSubmitTicket()}
          >Submit</Button>
        </View>
      )
    } else {
      return (
        <View>
          <Button
            mode="contained"
            onPress={() => onSubmitTicket()}
            disabled='true'
          >Submit</Button>
        </View>
      )
    }
  }


  const uploadImage = (imageURI, ticketID) => {
    console.log(`NewTicket.uploadImage: called`)
    console.log(`imageURI: ${imageURI}`)
    let fd = new FormData()
    const fileName = ticketID + '.jpg'
    fd.append('ticketImage', { uri: imageURI, type: 'image/jpg', name: fileName })
    return new Promise(async (resolve, reject) => {
      try {
        const { data } = await axios.post(`http://localhost:5050/api/mobile/helpdesk/uploadfile`, fd)
        console.log(`NewTicket.uploadImage: success`)
        // console.log(JSON.stringify(res))
        resolve(data.data.path)
        resolve(null)
      } catch (error) {
        console.log(`NewTicket.uploadImage: error= ${error}`)
        reject(error)
      }
    })
  }

  const pickImageHandler = async () => {
    // ImagePicker.showImagePicker({ title: 'Pick an Image', maxWidth: 800, maxHeight: 600 },
    //   response => {
    //     if (response.error) {
    //       console.log("image error");
    //     } else {
    //       console.log("Image: " + response.uri)
    //     }
    //   }
    // )
    try {
      const res = await launchImageLibrary()
      console.log(`result: ${JSON.stringify(res.assets[0])}`)
      // const res = await launchImageLibrary()
      // console.log(`result: ${JSON.stringify(res)}`)
      setImageAsset({
        ...res.assets[0],
        imageExist: true
      })
      // setUri(res.assets[0].uri)
      // setUploadedFile(res)
      // setUri('meow')
      // setImageExist(true)
    } catch (error) {
      console.log(error)
    }
  }

  const showImage = () => {
    if (imageAsset.imageExist) {
      return (
        <View style={{ flex: 1 }}>
          {/* <Chip
            style={{ backgroundColor: 'red', paddingTop: 30, margin: 0, height: 90, borderColor: 'yellow', borderWidth: 2 }}
            // key={ }
            mode='outlined'
            // selected={ }
            // disabled={ }
            // onPress={ }
            onClose={() => console.log('closing?')}
          > */}
          <View style={{ flex: 1, borderColor: 'black', borderWidth: 0 }}>
            <Image
              style={{ flex: 1 }}
              resizeMode='contain'
              source={{
                uri: imageAsset.uri
              }}
            />
          </View>
          {/* </Chip> */}
        </View>
      )
    }
    else {
      return (
        <View>
        </View>
      )
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

  const getLatestTicketID = (ticketID) => {
    console.log(`NewTicket.onSubmitTicket.getLatestTicketID(${ticketID}): called`)
    return new Promise(async (resolve, reject) => {
      try {
        const axiosGetResponse = await axios.get(`http://localhost:5050/api/mobile/helpdesk/lastid/${ticketID}`)

        console.log(`NewTicket.onSubmitTicket.getLatestTicketID(${ticketID}).axiosGetResponse: ${JSON.stringify(axiosGetResponse.data)}`)
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
        const axiosPostResponse = await axios.post(`http://localhost:5050/api/mobile/helpdesk/postnewticket`, {
          tc_id: ticketID,
          tc_cmcode: cmcode,
          tc_title: title.trim().toUpperCase(),
          tc_detail: detail.trim(),
          tc_createdat: date,
          tc_status: 'PENDING'
        })

        resolve(axiosPostResponse)
      } catch (error) {
        reject(error)
      }
    })
  }

  const createNewTicketWithImage = (ticketID, date, filePath) => {
    console.log(`NewTicket.onSubmitTicket.createNewTicket: called`)
    return new Promise(async (resolve, reject) => {
      try {
        const axiosPostResponse = await axios.post(`http://localhost:5050/api/mobile/helpdesk/postnewticketwithimage`, {
          tc_id: ticketID,
          tc_cmcode: cmcode,
          tc_title: title.trim().toUpperCase(),
          tc_detail: detail.trim(),
          tc_createdat: date,
          tc_status: 'PENDING',
          tc_filepath: filePath
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
      var ticketID = cmcode + date.substr(0, 8)
      var latestID = await getLatestTicketID(ticketID)
      console.log(`NewTicket.onSubmitTicket: latestID=${latestID}`)
      ticketID = ticketID + (++latestID < 10 ? '0' : '') + latestID
      console.log(`NewTicket.onSubmitTicket: next ticketID=${ticketID}`)
      if (imageAsset.imageExist) {
        const filePath = await uploadImage(imageAsset.uri, ticketID)
        const nice = await createNewTicketWithImage(ticketID, date, filePath)
      } else {
        const nice = await createNewTicket(ticketID, date)
      }
      navigation.popToTop()
    } catch (error) {
      console.log(error)
    }
  }


  return (
    <View style={{ flex: 1, margin: 10 }}>
      <View style={{ marginVertical: 5 }}>
        <TextInput
          label='TITLE'
          placeholder="TITLE"
          mode='outlined'
          onChangeText={(title) => settitle(title)}
        />
      </View>
      <View style={{ marginVertical: 5 }}>
        <TextInput
          label='DETAILS'
          placeholder="DETAILS"
          mode='outlined'
          style={{ height: 135 }}
          onChangeText={(detail) => setdetail(detail)}
        />
      </View>
      <View style={{ marginVertical: 10, flexDirection: 'row', alignItems: 'center' }}>
        <View style={{ marginRight: 10 }}>
          <Button style={{ marginVertical: 5 }} onPress={() => pickImageHandler()}
            mode='contained'>UPLOAD IMAGE</Button>
          <Button style={{ backgroundColor: 'red', marginVertical: 5 }} onPress={() => setImageAsset({ imageExist: false })}
            mode='contained'>REMOVE IMAGE</Button>
        </View>
        <View style={{ borderColor: 'grey', borderWidth: 1, flex: 1, padding: 5, height: 135 }}>
          {showImage()}
        </View>
      </View>
      <View style={{ marginVertical: 10 }}>
        {submitButton()}
      </View>
      {/* <View style={{ marginVertical: 10 }}>
        <Button
          mode="contained"
          onPress={() => uploadImage(imageAsset.uri)}
        >UPLOAD FILE</Button>
      </View> */}
    </View>
  )
}

export default NewTicket
