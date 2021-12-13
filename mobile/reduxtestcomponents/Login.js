import React from 'react'
import { View, Button } from 'react-native'
import { useDispatch } from 'react-redux'
import { login, logout } from '../reduxtestfeatures/user'

const Login = () => {
  const dispatch = useDispatch()
  return (
    <View>
      <Button
        title={"Login"}
        onPress={() => { dispatch(login({ age: 22 })) }} />
      <Button
        title={"logout"}
        onPress={() => { dispatch(logout()) }} />
    </View>
  )
}

export default Login
