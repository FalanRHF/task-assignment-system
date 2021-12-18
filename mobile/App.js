import React, { Component, useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';

//import firebase from 'firebase/app';
import auth from '@react-native-firebase/auth';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


import { configureStore } from "@reduxjs/toolkit";
import { Provider, useSelector, useDispatch } from "react-redux"
import currentUserReducer, { resetUser } from "./redux/currentUser"

import LandingScreen from './components/auth/Landing';
import PreRegisterScreen from './components/auth/PreRegister';
import ClientRegisterScreen from './components/auth/ClientRegister';
import EmployeeRegisterScreen from './components/auth/EmployeeRegister';
import PostRegisterScreen from './components/auth/PostRegister';
import LoginScreen from './components/auth/Login';
import ClientMainScreen from './components/ClientMain';
import EmployeeMainScreen from './components/EmployeeMain';
import LoadingScreen from './components/Loading';
import NewTicketScreen from './components/tickets/NewTicket';
import TicketScreen from './components/tickets/Ticket';
import UpdateTicketScreen from './components/tickets/UpdateTicket';
import EditProfileScreen from './components/ClientMain/EditProfile';


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
  const [loaded, setLoaded] = useState(false)
  // const [loggedIn, setLoggedIn] = useState(false)
  // const [isEmployee, setisEmployee] = useState(false)

  const currentUser = useSelector(state => state.currentUser.value)
  const dispatch = useDispatch()

  console.log(`App.js render...`)
  console.log(`currentUser.loggedin= ${currentUser.loggedin}`)

  useEffect(() => {
    if (!currentUser.loggedin) {
      const user = auth().currentUser;
      if (user) {
        auth()
          .signOut()
          .then(() => console.log('App.signOut: User signed out!'))
        dispatch(resetUser())
      }
      else {
        console.log(`No users currently logged in...`)
      }
    }
    setLoaded(true)
  }, [])


  if (!loaded) {
    console.log("App.loaded==false")
    return (
      <Stack.Navigator>
        <Stack.Screen name="Loading" component={LoadingScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    )
  }

  if (!currentUser.loggedin) {
    console.log("App.loggedIn==false")
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

  console.log("App.loggedIn==true")
  console.log(`${auth().currentUser.email} logged in!`)

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
    </Stack.Navigator>
  )
}

// import userReducer from "./reduxtestfeatures/user"
// import themeReducer from "./reduxtestfeatures/theme"
// import Profile from "./reduxtestcomponents/Profile"
// import Login from "./reduxtestcomponents/Login"
// import ChangeColour from "./reduxtestcomponents/ChangeColour"

// const store = configureStore({
//   reducer: {
//     user: userReducer,
//     theme: themeReducer,
//   }
// })

// const ReduxApp = () => {
//   console.log('ReduxApp')
//   return (
//     <View style={{ backgroundColor: 'white' }}>
//       <Profile />
//       <Login />
//       <ChangeColour />
//     </View>
//   )
// }

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


/**
 * npm i react-native-screens
 * npm i @react-native-community/masked-view
 * npm i react-native-gesture-handler
 */


