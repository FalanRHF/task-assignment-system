import React, { Component, useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';

//import firebase from 'firebase/app';
import auth from '@react-native-firebase/auth';
import { ActivityIndicator, DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import { configureStore } from "@reduxjs/toolkit";
import { Provider, useSelector, useDispatch } from "react-redux"
import currentUserReducer, { resetUser } from "./redux/currentUser"


import LoadingScreen from './components/Loading';

//Auth Screens
import PreRegisterScreen from './components/Auth/PreRegister';
import ClientRegisterScreen from './components/Auth/ClientRegister';
import EmployeeRegisterScreen from './components/Auth/EmployeeRegister';
import PostRegisterScreen from './components/Auth/PostRegister';
import LoginScreen from './components/Auth/Login';

//Client Screens
import ClientMainScreen from './components/ClientMain';
import NewTicketScreen from './components/tickets/NewTicket';
import TicketScreen from './components/tickets/Ticket';
import UpdateTicketScreen from './components/tickets/UpdateTicket';
import EditProfileScreen from './components/ClientMain/EditProfile';

//Employee Screens
import EmployeeMainScreen from './components/EmployeeMain';
import TaskScreen from './components/tasks/Task';


const Stack = createStackNavigator();

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    // primary: '#3498db',
    // accent: '#f1c40f',
    primary: '#f4b210', //netsinity code: f4b210
    accent: '#232323',
    surface: '#232323'
  },
};

//redux
const store = configureStore({
  reducer: {
    currentUser: currentUserReducer,
  }
})

const NetsinityApp = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const currentUser = useSelector(state => state.currentUser.value)
  const dispatch = useDispatch()


  useEffect(() => {
    console.log(`App.useEffect: rendering...`)
    if (!currentUser.loggedin) {
      const user = auth().currentUser;
      if (user) {
        auth()
          .signOut()
        // .then(() => console.log('App.signOut: User signed out!'))
        dispatch(resetUser())
      }
      else {
        // console.log(`No users currently logged in...`)
      }
    }
    setIsLoaded(true)
  }, [])


  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#232323' }}>
        <Text style={{ marginBottom: 20, color: '#f4b210' }}>Loading...</Text>
        <ActivityIndicator animating={true} color={"#f4b210"} />
      </View>
    )
  }

  if (!currentUser.loggedin) {
    return (
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PreRegister" component={PreRegisterScreen} options={{ headerTitle: 'Category', headerTitleStyle: { color: 'white' }, headerTitleAlign: 'center', headerTransparent: true, headerShown: false }} />
        <Stack.Screen name="ClientRegister" component={ClientRegisterScreen} options={{ headerTitle: 'Client Registration' }} />
        <Stack.Screen name="EmployeeRegister" component={EmployeeRegisterScreen} options={{ headerTitle: 'Employee Registration' }} />
        <Stack.Screen name="PostRegister" component={PostRegisterScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    )
  }

  if (currentUser.type == 'client') {
    return (
      <Stack.Navigator initialRouteName="ClientMain">
        <Stack.Screen name="ClientMain" component={ClientMainScreen} options={{ headerShown: false, headerTitleAlign: 'center' }} />
        <Stack.Screen name="NewTicket" component={NewTicketScreen} options={{ title: 'Add New Ticket', headerTitleAlign: 'center' }} />
        <Stack.Screen name="Ticket" component={TicketScreen} options={{ title: 'Ticket', headerTitleAlign: 'center' }} />
        <Stack.Screen name="UpdateTicket" component={UpdateTicketScreen} options={{ title: 'Update Ticket', headerTitleAlign: 'center' }} />
        <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile', headerTitleAlign: 'center' }} />
      </Stack.Navigator>
    )
  }
  return (
    <Stack.Navigator>
      <Stack.Screen name="EmployeeMain" component={EmployeeMainScreen} options={{ headerShown: false, headerTitleAlign: 'center' }} />
      <Stack.Screen name="Task" component={TaskScreen} options={{ title: 'Task', headerTitleAlign: 'center' }} />
      <Stack.Screen name="Ticket" component={TicketScreen} options={{ title: 'Ticket', headerTitleAlign: 'center' }} />
    </Stack.Navigator>
  )
}

const App = () => {
  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <NetsinityApp />
        </NavigationContainer>
      </PaperProvider>
    </Provider>
  )
}

export default App
