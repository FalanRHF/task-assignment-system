import React, { useEffect, useState } from 'react';
import { View, Button, Image, Text } from 'react-native';

import { utils } from '@react-native-firebase/app';
import storage from '@react-native-firebase/storage'
import ImagePicker, { launchCamera, launchImageLibrary } from 'react-native-image-picker'

const Completed = () => {
  // create bucket storage reference to not yet existing image
  const reference = storage().ref('black-t-shirt-sm.png');
  const [imageExist, setImageExist] = useState(false)
  const [uri, setUri] = useState('')


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
      const { assets } = await launchImageLibrary()
      console.log(`result: ${JSON.stringify(assets[0])}`)
      setUri(assets[0].uri)
      setImageExist(true)
    } catch (error) {
      console.log(error)
    }
  }

  const showImage = () => {
    if (imageExist) {
      return (
        <View>
          <Text>{uri}</Text>
          <Image
            style={{
              width: 50,
              height: 50
            }}
            source={{
              uri: uri
            }}
          />
        </View>
      )
    }
    else {
      return (
        <View>
          <Text>Nothing</Text>
        </View>
      )
    }
  }

  return (
    <View>
      <Button title="Pick Image" onPress={pickImageHandler} />
      {showImage()}
    </View>
  )
}

export default Completed