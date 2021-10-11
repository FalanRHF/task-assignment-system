import React, { Component, useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';

//import firebase from 'firebase/app';
import auth from '@react-native-firebase/auth';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

//import { Provider } from "react-redux";
import { createStore, applyMiddleware } from "redux";
import rootReducer from './redux/reducers'
import thunk from 'redux-thunk'
const store = createStore(rootReducer, applyMiddleware(thunk))

import LandingScreen from './components/auth/Landing';
import ClientRegisterScreen from './components/auth/ClientRegister';
import PreRegisterScreen from './components/auth/PreRegister';
import LoginScreen from './components/auth/Login';
import MainScreen from './components/Main';
import NewTicketScreen from './components/tickets/NewTicket';
import TicketScreen from './components/tickets/Ticket';
import UpdateTicketScreen from './components/tickets/UpdateTicket';
import EditProfileScreen from './components/main/EditProfile';


const Stack = createStackNavigator();

const theme = {
  ...DefaultTheme,
  roundness: 2,
  colors: {
    ...DefaultTheme.colors,
    // primary: '#3498db',
    // accent: '#f1c40f',
    primary: '#f4b210', //netsinity code: f4b210
    accent: '232323',
    surface: '232323'
  },
};

const App = () => {
  const [loaded, setLoaded] = useState(false)
  const [loggedIn, setLoggedIn] = useState(false)

  console.log(`App.js render...`)

  useEffect(() => {
    auth().onAuthStateChanged((user) => {
      if (!user) {
        setLoaded(true)
        setLoggedIn(false)
      } else {
        setLoaded(true)
        setLoggedIn(true)
      }
    });
  }, [])

  if (!loaded) {
    console.log("App.loaded==false")
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text>Loading</Text>
      </View>
    )
  }
  if (!loggedIn) {
    console.log("App.loggedIn==false")
    return (
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="ClientRegister" component={ClientRegisterScreen} options={{ headerTitle: 'Client Registration' }} />
            <Stack.Screen name="PreRegister" component={PreRegisterScreen} options={{ headerTitle: 'Category' }} />
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            {/* <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} /> */}
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    );
  }
  console.log("App.loggedIn==true")
  console.log(`${auth().currentUser.email} logged in!`)
  return (
    <PaperProvider theme={theme}>
      {/* <Provider store={store}> */}
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Main">
          <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false, headerTitleAlign: 'center' }} />
          <Stack.Screen name="NewTicket" component={NewTicketScreen} options={{ title: 'Add New Ticket', headerTitleAlign: 'center' }} />
          <Stack.Screen name="Ticket" component={TicketScreen} options={{ title: 'Ticket', headerTitleAlign: 'center' }} />
          <Stack.Screen name="UpdateTicket" component={UpdateTicketScreen} options={{ title: 'Update Ticket', headerTitleAlign: 'center' }} />
          <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile', headerTitleAlign: 'center' }} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  )
}

// export class meow extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       loaded: false,
//     }
//   }

//   componentDidMount() {
//     auth().onAuthStateChanged((user) => {
//       if (!user) {
//         this.setState({
//           loggedIn: false,
//           loaded: true
//         })
//       } else {
//         this.setState({
//           loggedIn: true,
//           loaded: true
//         });
//       }
//     });
//   }

//   render() {
//     const { loggedIn, loaded } = this.state;
//     if (!loaded) {
//       return (
//         <View style={{ flex: 1, justifyContent: 'center' }}>
//           <Text>Loading</Text>
//         </View>
//       )
//     }
//     if (!loggedIn) {
//       return (
//         <PaperProvider theme={theme}>
//           <NavigationContainer>
//             <Stack.Navigator initialRouteName="Landing">
//               <Stack.Screen name="Register" component={RegisterScreen} />
//               <Stack.Screen name="Login" component={LoginScreen} />
//               <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
//             </Stack.Navigator>
//           </NavigationContainer>
//         </PaperProvider>
//       );
//     }
//     return (
//       // <Provider store={store}>
//       <NavigationContainer>
//         <Stack.Navigator initialRouteName="Main">
//           <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false, headerTitleAlign: 'center' }} />
//           <Stack.Screen name="NewTicket" component={NewTicketScreen} options={{ title: 'Add New Ticket', headerTitleAlign: 'center' }} />
//           <Stack.Screen name="Ticket" component={TicketScreen} options={{ title: 'Ticket', headerTitleAlign: 'center' }} />
//           <Stack.Screen name="UpdateTicket" component={UpdateTicketScreen} options={{ title: 'Update Ticket', headerTitleAlign: 'center' }} />
//           <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Edit Profile', headerTitleAlign: 'center' }} />
//         </Stack.Navigator>
//       </NavigationContainer>
//       //</Provider>
//     )
//   }
// }

export default App


/**
 * npm i react-native-screens
 * npm i @react-native-community/masked-view
 * npm i react-native-gesture-handler
 */


