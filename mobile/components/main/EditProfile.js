import axios from 'axios';
import React, { Component, useState, useEffect } from 'react'
import { StyleSheet, View, TouchableOpacity, FlatList } from 'react-native';

import { TextInput, Text, Chip, FAB, Portal, Modal, Provider, Button } from 'react-native-paper';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchClient } from '../../redux/actions';

import firebase from 'firebase';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Ticket from '../tickets/Ticket';

const EditProfile = ({ route, navigation, __filename }) => {
  console.log(`EditProfile rendering...`)
  const [client, setclient] = useState({ isLoading: true })
  const [pjcode, setpjcode] = useState([])
  const uid = auth().currentUser.uid
  const [rerender, setrerender] = useState(false)
  const [modalVisible, setModalVisible] = React.useState(false);
  const [newProject, setnewProject] = useState('')

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);
  const containerStyle = { backgroundColor: 'white', padding: 10 };


  useEffect(() => {
    navigation.setOptions({ title: `@${route.params.username}` })
    const unsubscribe = navigation.addListener('focus', getUserDetails);
    return unsubscribe;
  }, [navigation]);

  const getUserDetails = async () => {
    console.log(`EditProfile.getUserDetails: called`)
    const uid = auth().currentUser.uid
    try {
      const axiosGetResponse = await axios.get(`http://localhost:5050/auth/getdata/client/${uid}`)
      console.log(`${JSON.stringify(axiosGetResponse.data[0])}`)
      setclient({
        ...client,
        ...axiosGetResponse.data[0],
        isLoading: false,
      })
      console.log(`EditProfile.getUserDetails: PJCodes=${JSON.stringify(axiosGetResponse.data[0].cl_pjcode)}`)
      setpjcode(axiosGetResponse.data[0].cl_pjcode)
      console.log(`EditProfile.getUserDetails: success`)
    } catch (error) {
      console.log(`EditProfile.getUserProfile: [ERROR] ${error}`)
    }
  }

  //console.log(`pjcode: ${JSON.stringify(pjcode)}`)

  const updateUserProfile = async () => {
    console.log(`EditProfile.updateUserProfile: called`)
    try {
      const axiosPostResponse = await axios.post(`http://localhost:5050/clientprofile/updatedetails`, {
        cl_uid: uid,
        cl_fullname: client.cl_fullname,
        cl_username: client.cl_username,
      })
      console.log(`EditProfile.updateUserProfile`)
    } catch (error) {
      console.log(`EditProfile.updateUserProfile: [ERROR] ${error}`)
    }
    navigation.goBack()
  }

  const changeCurrentPjcode = async (pjcode) => {
    console.log(`EditProfile.changeCurrentPjcode: called`)
    try {
      const axiosPostResponse = await axios.post(`http://localhost:5050/clientprofile/changeproject`, {
        cl_uid: uid,
        cl_curpj: pjcode,
      })
      console.log(`EditProfile.changeCurrentPjcode: axiosPostResponse=${axiosPostResponse.data[0]}`)
    } catch (error) {
      console.log(`EditProfile.changeCurrentPjcode: [ERROR] ${error}`)
    }
    getUserDetails()

  }

  const addNewProject = async () => {
    console.log(`EditProfile.addNewProject: called`)
    const newArrayProject = [...client.cl_pjcode, newProject]
    try {
      const axiosPostResponse = await axios.post(`http://localhost:5050/clientprofile/updateproject`, {
        cl_uid: uid,
        cl_pjcode: newArrayProject,
      })
      console.log(`EditProfile.addNewProject: axiosPostResponse=${axiosPostResponse.data[0]}`)
      setnewProject('')
    } catch (error) {
      console.log(`EditProfile.addNewProject: [ERROR] ${error}`)
    }
    hideModal()
    getUserDetails()
  }

  const name = (params) => {

  }


  const deleteProject = async (e) => {
    console.log(`EditProfile.deleteProject: called`)
    let oldArray = [...client.cl_pjcode,]
    var index = oldArray.indexOf(e)
    if (index !== -1) {
      oldArray.splice(index, 1);
      newArray = [...oldArray,]
    }
    try {
      const axiosPostResponse = await axios.post(`http://localhost:5050/clientprofile/updateproject`, {
        cl_uid: uid,
        cl_pjcode: newArray,
      })
      console.log(`EditProfile.deleteProject: axiosPostResponse=${axiosPostResponse.data[0]}`)
    } catch (error) {
      console.log(`EditProfile.deleteProject: [ERROR] ${error}`)
    }
    getUserDetails()
  }


  return (
    <Provider>
      <View>
        <View>
          <View style={styles.row}>
            <Text style={{
              flex: 2, alignSelf: 'center'
            }}>Full Name</Text>
            <TextInput
              style={{ flex: 7 }}
              placeholder="Full Name"
              mode='outlined'
              value={client.cl_fullname}
              onChangeText={(fullname) => setclient({
                ...client,
                cl_fullname: fullname,
              })}
            />
          </View>
          <View style={styles.row}>
            <Text style={{
              flex: 2, alignSelf: 'center'
            }}>Username</Text>
            <TextInput
              placeholder="Username"
              style={{ flex: 7, marginBottom: 4 }}
              mode='outlined'
              value={client.cl_username}
              onChangeText={(username) => setclient({
                ...client,
                cl_username: username,
              })}
            />
          </View>
          <View style={styles.row}>
            <Text style={{
              flex: 2, alignSelf: 'center'
            }}>Projects</Text>
            <View style={{ flex: 7, flexDirection: 'row', flexWrap: 'wrap' }}>
              {
                pjcode.map((pj, index) => {
                  return (
                    <Chip
                      style={{ ...styles.chip, alignItems: 'center' }}
                      key={index}
                      mode='flat'
                      selected={pj == client.cl_curpj}
                      disabled={pj == client.cl_curpj}
                      onPress={() => changeCurrentPjcode(pj)}
                      onClose={() => { pj == client.cl_curpj ? console.log(`close pressed`) : deleteProject(pj) }}
                    >
                      {/* <Text style={styles.chipText}>{pj}</Text> */}
                      {pj}
                    </Chip>

                  )
                })
              }

              <FAB
                style={{ ...styles.chip, ...styles.fab }}
                small icon='plus' onPress={showModal} />

            </View>
          </View>
        </View>

        <Button
          mode="contained"
          onPress={() => updateUserProfile()}>Update Profile
        </Button>
      </View>
      <Portal>
        <Modal visible={modalVisible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
          <View style={{ flexDirection: 'column' }}>
            <TextInput
              style={{ marginBottom: 10 }}
              placeholder="Project Code"
              mode='outlined'
              onChangeText={(newpj) => setnewProject(newpj)}
            />
            <Button
              mode="contained"
              onPress={() => addNewProject()}>Add Project</Button>
          </View>
        </Modal>
      </Portal>
    </Provider>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 100,
    alignItems: "center"
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12
  },
  chip: {
    borderColor: "#000000",
    borderWidth: 1,
    marginVertical: 2,
    marginHorizontal: 2
  },
  chipText: {
    color: "#000000"
  },
  fab: {
    backgroundColor: '#56b7cc',
    height: 35,
    width: 35,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default EditProfile
