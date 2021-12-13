import React from 'react'
import { View, Text } from 'react-native'
import { useSelector } from 'react-redux'

const Profile = () => {
  const user = useSelector((state) => state.user.value)
  const theme = useSelector((state) => state.theme.value)
  return (
    <View>
      <Text style={{ color: theme }}>Profile Page</Text>
      <Text style={{ color: theme }}>Name: {user.name}</Text>
      <Text style={{ color: theme }}>Age: {user.age}</Text>
      <Text style={{ color: theme }}>Email: {user.email}</Text>
    </View>
  )
}

export default Profile
