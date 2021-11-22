import React, { useEffect } from 'react'

import { Text, View } from 'react-native';
import { Button } from "react-native-paper";

const Landing = ({ navigation }) => {

  useEffect(() => {
    console.log(`Landing.js mounted...`)
    return () => {
      console.log(`Landing.js mounted...`)

    }
  }, [navigation])

  {/* navigation passed from App.js */ }
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <Button mode="contained" onPress={() => navigation.navigate("Register")}>
        Register
      </Button>
      <Button mode="outlined" onPress={() => navigation.navigate("Login")}>
        Login
      </Button>
      {/* <Button style={{ margin: 2 }}
        title="Register"
        onPress={() => navigation.navigate("Register")} />
      <Button style={{ marginTop: 20, padding: 15 }}
        title="Login"
        onPress={() => navigation.navigate("Login")}
        color="#f194ff"
      /> */}
    </View>
  );
}

export default Landing
