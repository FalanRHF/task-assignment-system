import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, TouchableOpacity, FlatList } from 'react-native';
import { Button, Divider, Text } from 'react-native-paper';

import Loading from '../Loading'

import { useIsFocused } from '@react-navigation/native';

import { utils } from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage'
import ImagePicker, { launchCamera, launchImageLibrary } from 'react-native-image-picker'

import { useSelector } from 'react-redux';

const Completed = ({ navigation }) => {
  // create bucket storage reference to not yet existing image
  const reference = storage().ref('black-t-shirt-sm.png');
  const [imageExist, setImageExist] = useState(false)
  const [uri, setUri] = useState('')

  const currentUser = useSelector(state => state.currentUser.value)

  const isFocused = useIsFocused()
  const [isLoaded, setIsLoaded] = useState(false)
  const [completedTask, setCompletedTask] = useState({})

  // const pickImageHandler = async () => {
  // ImagePicker.showImagePicker({ title: 'Pick an Image', maxWidth: 800, maxHeight: 600 },
  //   response => {
  //     if (response.error) {
  //       console.log("image error");
  //     } else {
  //       console.log("Image: " + response.uri)
  //     }
  //   }
  // )
  //   try {
  //     const { assets } = await launchImageLibrary()
  //     console.log(`result: ${JSON.stringify(assets[0])}`)
  //     setUri(assets[0].uri)
  //     setImageExist(true)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  // const showImage = () => {
  //   if (imageExist) {
  //     return (
  //       <View>
  //         <Text>{uri}</Text>
  //         <Image
  //           style={{
  //             width: 50,
  //             height: 50
  //           }}
  //           source={{
  //             uri: uri
  //           }}
  //         />
  //       </View>
  //     )
  //   }
  //   else {
  //     return (
  //       <View>
  //         <Text>Nothing</Text>
  //       </View>
  //     )
  //   }
  // }

  useEffect(() => {
    if (isFocused) {
      // console.log(`Employee.Completed.useEffect: called`)
      getCompletedTask()
    }
  }, [isFocused])

  const getCompletedTask = async () => {
    try {
      const res = await axios.get(`http://localhost:5050/task/completedtask/${currentUser.em_fullname}`)
      console.log(`Completed Task Data: ${JSON.stringify(res.data)}`)
      setCompletedTask(res.data)
      setIsLoaded(true)
    } catch (error) {
      console.log(`Home: getPendingTask error: ${error}`)
    }
  }

  if (!isLoaded) {
    return (
      <Loading />
    )
  } else {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ marginHorizontal: 16 }}>
          <View style={{ paddingTop: 20, paddingBottom: 100 }}>
            <FlatList style={{ paddingBottom: 0 }}
              data={completedTask}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => navigation.navigate('Task', {
                    ta_id: item.ta_id
                  })}
                  style={{ ...styles.item, borderColor: '#4dc43b' }}>
                  <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{item.ta_title}</Text>
                  <Text style={{ fontSize: 10 }}>{item.ta_createdat.substr(6, 2) + '-' + item.ta_createdat.substr(4, 2) + '-' + item.ta_createdat.substr(0, 4) + ' ' + item.ta_createdat.substr(8, 2) + ':' + item.ta_createdat.substr(10, 2)}</Text>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.ta_id}
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
    padding: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    backgroundColor: '#ffffff',
    borderWidth: 2.5,
    borderRadius: 10,
    elevation: 4,
  },
});


export default Completed