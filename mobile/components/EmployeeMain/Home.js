import axios from 'axios';
import React, { useState, useEffect } from 'react'
import { StyleSheet, Button, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { RadioButton, Divider } from 'react-native-paper';

import firebase from 'firebase';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';


const Home = ({ navigation }) => {

  const [checked, setChecked] = useState('first')

  return (
    <View style={{ flex: 1 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', margin: 10 }}>
        <RadioButton
          color="#f4b210"
          uncheckedColor='#f4b210'
          value="first"
          status={checked === 'first' ? 'checked' : 'unchecked'}
          onPress={() => setChecked('first')}
        />
        <Text>All</Text>
        <RadioButton
          color="#f4b210"
          uncheckedColor='#f4b210'
          value="second"
          status={checked === 'second' ? 'checked' : 'unchecked'}
          onPress={() => setChecked('second')}
        />
        <Text>assigned to me</Text>
      </View>
      <Divider style={{ marginHorizontal: 10 }} />
      <View>
        {/* <FlatList style={{ paddingBottom: 0 }}
          data={pendingTicket}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => navigation.navigate('Ticket', {
                tc_id: item.tc_id
              })}
              style={{ ...styles.item, backgroundColor: item.tc_status == 'IN PROGRESS' ? '#f4b120' : 'white' }}>
              <Text style={styles.title}>{item.tc_title}</Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.tc_id}
          refreshing={true}
        /> */}
      </View>
    </View>
  );
}

export default Home
