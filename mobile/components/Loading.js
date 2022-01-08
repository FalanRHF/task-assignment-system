import React from 'react'

import { Text, View } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

const Loading = ({ navigation }) => {
  console.log(`Loading...`)
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
      <Text style={{ marginBottom: 20, color: '#f4b210' }}>Loading...</Text>
      <ActivityIndicator animating={true} color={"#f4b210"} />
    </View>
  );
}

export default Loading
