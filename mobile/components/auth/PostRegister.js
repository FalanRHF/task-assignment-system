import React from 'react';
import { View, Text } from 'react-native';
import { Button } from 'react-native-paper';


const PostRegister = ({ navigation }) => {

  const toLogin = () => {
    navigation.popToTop()
  }

  return (
    <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 10, backgroundColor: '#232323', alignItems: 'center' }}>
      <View style={{ marginVertical: 10 }}>
        <Text style={{ color: 'white' }}>YOU HAVE REGISTERED!</Text>
      </View>
      <View style={{ marginVertical: 5 }}>
        <Button
          mode="contained"
          onPress={() => toLogin()}
        >BACK TO LOGIN</Button>
      </View>
    </View>
  )
}

export default PostRegister
