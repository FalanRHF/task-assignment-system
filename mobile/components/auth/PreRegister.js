import React, { useEffect, useState } from 'react';
import { View } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';


const PreRegister = ({ navigation, route }) => {

  const toClientRegister = () => {
    navigation.navigate("ClientRegister")
  }

  const toEmployeeRegister = () => {
    navigation.navigate("EmployeeRegister")
  }


  return (
    <View style={{ flex: 1, justifyContent: 'center', paddingHorizontal: 10, backgroundColor: '#232323' }}>
      <View style={{ marginVertical: 5 }}>
        <Button
          mode="contained"
          onPress={() => toClientRegister()}
        >Client</Button>
      </View>
      <View style={{ marginVertical: 5 }}>
        <Button
          mode="contained"
          onPress={() => toEmployeeRegister()}
        >Employee</Button>
      </View>
    </View>
  )
}

export default PreRegister
