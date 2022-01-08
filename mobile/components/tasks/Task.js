import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { StyleSheet, View } from 'react-native';
import { Button, Text } from 'react-native-paper';
import Loading from '../Loading'

//redux
import { useSelector } from 'react-redux';


const Task = ({ route, navigation }) => {
  const currentUser = useSelector(state => state.currentUser.value)
  const taskID = route.params.ta_id
  const [task, setTask] = useState({})
  const [isLoaded, setIsLoaded] = useState(false)


  useEffect(() => {
    loadTask()
    navigation.setOptions({
      headerTitleStyle: {
        fontSize: 16
      },
    })
    return () => {
      setTask({})
      setIsLoaded(false)
    }
  }, [])

  const loadTask = async () => {
    console.log(`taskID: ${taskID}`)
    try {
      const axiosGetResponse = await axios.get(`http://localhost:5050/task/gettaskdata/${taskID}`)
      setTask({
        ...axiosGetResponse.data[0]
      })
      console.log(`Task Details: ${JSON.stringify(axiosGetResponse.data[0])}`)
      setIsLoaded(true)
      console.log(`Ticket.js > useEffect(): Successful`)
    } catch (error) {
      console.log(`Ticket.js > useEffect(): Error: ${error}`)
    }
  }

  const changeTaskStatus = async (newStatus) => {
    console.log(`changeTaskStatus(${taskID}, ${newStatus}): called`)
    try {
      const res = await axios.post(`http://localhost:5050/task/updatetaskstatus`, {
        ta_id: taskID,
        newStatus: newStatus,
      })
      loadTask()
      console.log(`changeTaskStatus(${taskID}, ${newStatus}): success`)
    } catch (error) {
      console.log(`changeTaskStatus(${taskID}, ${newStatus}): error`)
      console.log(error)
    }
  }

  const renderButton = () => {
    if (currentUser.em_fullname == task.ta_assignto) {
      if (task.ta_status == 'TO DO') {
        return (
          <View>
            <Button
              mode="contained"
              onPress={() => {
                console.log('Change pressed')
                changeTaskStatus('IN PROGRESS')
              }}
            >In Progress</Button>
          </View>
        )
      }
      else if (task.ta_status == 'IN PROGRESS') {
        return (
          <View style={{ flexDirection: 'row', justifyContent: 'space-evenly' }}>
            <Button
              mode="contained"
              style={{ backgroundColor: 'white' }}
              onPress={() => {
                console.log('Change pressed')
                changeTaskStatus('TO DO');
              }}
            >TO DO</Button>
            <Button
              mode="contained"
              style={{ backgroundColor: '#4dc43b' }}
              onPress={() => {
                console.log('Change pressed')
                changeTaskStatus('DONE')
              }}
            >DONE</Button>
          </View>
        )
      }
    }
    return (
      <View>
      </View>
    )
  }

  if (!isLoaded) {
    return (
      <Loading />
    )
  }

  return (
    <View style={{ margin: 10 }}>
      <View style={{ borderWidth: 0.5, borderRadius: 5, borderColor: 'grey', marginVertical: 5 }}>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ ...styles.tableItem, flex: 1, borderTopLeftRadius: 5 }}>TITLE</Text>
          <Text style={{ ...styles.tableItem, flex: 2, borderTopRightRadius: 5 }}>{task.ta_title}</Text>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Text style={{ ...styles.tableItem, flex: 1 }}>DESCRIPTION</Text>
          <Text style={{ ...styles.tableItem, flex: 2 }}>{task.ta_description}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ ...styles.tableItem, flex: 1 }}>ASSIGNED TO</Text>
          <Text style={{ ...styles.tableItem, flex: 2 }}>{task.ta_assignto}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ ...styles.tableItem, flex: 1 }}>CREATED AT</Text>
          <Text style={{ ...styles.tableItem, flex: 2 }}>{task.ta_createdat.substr(6, 2)}/{task.ta_createdat.substr(4, 2)}/{task.ta_createdat.substr(0, 4)} {task.ta_createdat.substr(8, 2)}:{task.ta_createdat.substr(10, 2)}:{task.ta_createdat.substr(12, 2)}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ ...styles.tableItem, flex: 1 }}>STATUS</Text>
          <Text style={{ ...styles.tableItem, flex: 2 }}>{task.ta_status}</Text>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Text style={{ ...styles.tableItem, flex: 1, borderBottomLeftRadius: 5 }}>DUE DATE</Text>
          <Text style={{ ...styles.tableItem, flex: 2, borderBottomRightRadius: 5 }}>{task.ta_duedate.substr(6, 2)}/{task.ta_duedate.substr(4, 2)}/{task.ta_duedate.substr(0, 4)} {task.ta_duedate.substr(8, 2)}:{task.ta_duedate.substr(10, 2)}:{task.ta_duedate.substr(12, 2)}</Text>
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


export default Task