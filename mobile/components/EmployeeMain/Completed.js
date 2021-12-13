import axios from 'axios';
import React, { Component, useState, useEffect } from 'react'
import { StyleSheet, Button, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import firebase from 'firebase';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

const Separator = () => (
  <View style={styles.separator} />
);

let completedTicket = []

const Completed = ({ navigation }) => {

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignContent: 'center' }}>
      <Text>Employee Completed</Text>
    </View>
  );
}

export default Completed
