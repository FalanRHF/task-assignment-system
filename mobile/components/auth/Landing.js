import React, { Alert } from 'react'

import { Text, View, Button } from 'react-native';

export default function Landing({ navigation }) {
  {/* navigation passed from App.js */ }
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <Button style={{ margin: 2 }}
        title="Register"
        onPress={() => navigation.navigate("Register")} />

      <Button style={{ marginTop: 20, padding: 15 }}
        title="Login"
        onPress={() => navigation.navigate("Login")}
        color="#f194ff"
      //onPress={() => Alert.alert('Button with adjusted color pressed')}
      />
    </View>
  );
}
