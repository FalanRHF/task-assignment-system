import axios from 'axios';
import React, { Component, useState, useEffect } from 'react'
import { StyleSheet, View, TouchableOpacity, FlatList, useIsFocus } from 'react-native';

import { useIsFocused } from '@react-navigation/native';

import { TextInput, Text, Chip, FAB, Portal, Modal, Provider, Button } from 'react-native-paper';

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { fetchClient } from '../../oldredux/actions';

import { useSelector, useDispatch } from 'react-redux';
import { setUser } from '../../redux/currentUser';

import firebase from 'firebase';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Ticket from '../tickets/Ticket';

const EditProfile = ({ navigation }) => {
  console.log(`EditProfile rendering...`)
  const isFocused = useIsFocused()
  const currentUser = useSelector(state => state.currentUser.value)
  const dispatch = useDispatch()
  const [loaded, setIsLoaded] = useState(false)
  const [client, setClient] = useState(currentUser)
  const [projectCodes, setProjectCodes] = useState(currentUser.cl_pjcode)
  const [currentCode, setcurrentCode] = useState(currentUser.cl_curpj)
  const [rerender, setrerender] = useState(false)
  const [modalVisible, setModalVisible] = useState(false);
  const [newProject, setNewProject] = useState('')

  const showModal = () => setModalVisible(true);
  const hideModal = () => setModalVisible(false);
  const containerStyle = { backgroundColor: 'white', padding: 10 };

  useEffect(() => {
    setIsLoaded(true)
    // navigation.setOptions({ title: `@${route.params.username}` })
    // const unsubscribe = navigation.addListener('focus', getUserDetails);
    // return setIsLoaded(false);
  }, [isFocused]);

  const getUserDetails = async () => {
    console.log(`EditProfile.getUserDetails: called`)
    const uid = auth().currentUser.uid
    try {
      const axiosGetResponse = await axios.get(`http://localhost:5050/auth/getdata/client/${uid}`)
      console.log(`${JSON.stringify(axiosGetResponse.data[0])}`)
      setClient({
        ...client,
        ...axiosGetResponse.data[0],
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
        cl_uid: client.cl_uid,
        cl_fullname: client.cl_fullname,
        cl_username: client.cl_username,
        cl_curpj: client.cl_curpj,
        cl_pjcode: `{${JSON.stringify(client.cl_pjcode).slice(1, -1)}}`
      })
      console.log(`EditProfile.updateUserProfile`)
      dispatch(setUser(client))
    } catch (error) {
      console.log(`EditProfile.updateUserProfile: [ERROR] ${error}`)
    }
    navigation.goBack()
  }

  const changeCurrentPjcode = async (pjcode) => {
    console.log(`EditProfile.changeCurrentPjcode: called`)
    setClient({
      ...client,
      cl_curpj: pjcode
    })
    // try {
    //   const axiosPostResponse = await axios.post(`http://localhost:5050/clientprofile/changeproject`, {
    //     cl_uid: uid,
    //     cl_curpj: pjcode,
    //   })
    //   console.log(`EditProfile.changeCurrentPjcode: axiosPostResponse=${axiosPostResponse.data[0]}`)
    //   dispatch(setUser({ cl_curpj: pjcode }))
    // } catch (error) {
    //   console.log(`EditProfile.changeCurrentPjcode: [ERROR] ${error}`)
    // }
    // getUserDetails()
  }

  const addNewProject = async () => {
    console.log(`EditProfile.addNewProject: called`)
    const newArray = [...client.cl_pjcode, newProject]
    newArray.sort()
    setClient({
      ...client,
      cl_pjcode: newArray
    })
    // setNewProject('')
    // try {
    //   const axiosPostResponse = await axios.post(`http://localhost:5050/clientprofile/updateproject`, {
    //     cl_uid: uid,
    //     cl_pjcode: newArrayProject,
    //   })
    //   console.log(`EditProfile.addNewProject: axiosPostResponse=${axiosPostResponse.data[0]}`)
    //   setNewProject('')
    // } catch (error) {
    //   console.log(`EditProfile.addNewProject: [ERROR] ${error}`)
    // }
    hideModal()
    // getUserDetails()
  }

  const deleteProject = async (e) => {
    console.log(`EditProfile.deleteProject: called`)
    var oldArray = [...client.cl_pjcode,]
    var newArray = []
    var index = oldArray.indexOf(e)
    if (index !== -1) {
      oldArray.splice(index, 1);
      newArray = [...oldArray,]
    }
    setClient({
      ...client,
      cl_pjcode: newArray
    })
    // try {
    //   const axiosPostResponse = await axios.post(`http://localhost:5050/clientprofile/updateproject`, {
    //     cl_uid: uid,
    //     cl_pjcode: newArray,
    //   })
    //   console.log(`EditProfile.deleteProject: axiosPostResponse=${axiosPostResponse.data[0]}`)
    //   dispatch(setUser({ cl_pjcode: newArray }))
    // } catch (error) {
    //   console.log(`EditProfile.deleteProject: [ERROR] ${error}`)
    // }
    // getUserDetails()
  }

  return (
    <View style={{ flex: 1, margin: 10 }}>
      {/* </Provider> */}
      <View>
        <View style={{ marginVertical: 5 }}>
          <TextInput
            label='FULL NAME'
            placeholder="FULL NAME"
            mode='outlined'
            value={client.cl_fullname}
            onChangeText={(fullname) => setClient({
              ...client,
              cl_fullname: fullname,
            })}
          />
        </View>
        <View style={{ marginVertical: 5 }}>
          <TextInput
            label='USERNAME'
            placeholder="USERNAME"
            mode='outlined'
            value={client.cl_username}
            onChangeText={(username) => setClient({
              ...client,
              cl_username: username,
            })}
          />
        </View>
        <View style={{ marginVertical: 10 }}><Text style={{
          alignSelf: 'center'
        }}>PROJECTS</Text>

          {/* <View style={{ ...styles.row, marginVertical: 5 }}> */}
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
            {
              client.cl_pjcode.map((pj, index) => {
                return (
                  <Chip
                    style={{ ...styles.chip }}
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
            {/* </View> */}
          </View>
        </View>
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 10 }}><Button
        mode="contained"
        onPress={() => updateUserProfile()}>Update Profile
      </Button>
      </View>


      <Portal>
        <Modal visible={modalVisible} onDismiss={hideModal} contentContainerStyle={containerStyle}>
          <View style={{ margin: 1 }}>
            <View style={{ marginVertical: 3 }}>
              <TextInput
                label='PROJECT CODE'
                placeholder="PROJECT CODE"
                mode='outlined'
                onChangeText={(newpj) => setNewProject(newpj)}
              />
            </View>
            <View style={{ marginVertical: 3 }}>
              <Button
                mode="contained"
                onPress={() => addNewProject()}>Add Project</Button>
            </View>
          </View>
        </Modal>
      </Portal>
      {/* </Provider> */}
    </View >
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
    marginVertical: 1,
    marginHorizontal: 1
  },
  chipText: {
    color: "#000000"
  },
  fab: {
    backgroundColor: '#56b700',
    height: 30,
    width: 30,
    alignItems: 'center',
    justifyContent: 'center'
  }
});

export default EditProfile
