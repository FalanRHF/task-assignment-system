import React, { useState } from 'react'
import { View, TextInput, Button } from 'react-native'
import { useDispatch } from 'react-redux'
import { changeTextColour } from '../reduxtestfeatures/theme'

const ChangeColour = () => {

  const [textColour, setTextColour] = useState('')

  const dispatch = useDispatch()
  return (
    <View>
      <TextInput
        style={{ color: 'black' }}
        onChangeText={(value) => setTextColour(value)} />
      <Button
        title='Change Text Colour'
        onPress={() => dispatch(changeTextColour(textColour))} />
    </View>
  )
}

export default ChangeColour
