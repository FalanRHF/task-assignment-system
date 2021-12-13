import React from 'react'

import { Text, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

const Loading = ({ navigation }) => {
  console.log(`Loading.js render...`)
  return (
    <View style={{ flex: 1, alignContent: 'center', backgroundColor: '#232323' }}>
      <Text style={{ alignSelf: 'center', marginBottom: 20, color: '#f4b210' }}>Loading...</Text>
      <ActivityIndicator animating={true} color={"#f4b210"} />
    </View>
  );
}

export default Loading
