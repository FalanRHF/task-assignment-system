import React, { Component, useState, useEffect } from 'react';
import { View, Text, Button } from 'react-native';

//import firebase from 'firebase/app';
import auth from '@react-native-firebase/auth';


// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyBZipysoAUg-AtvDvtYqbiswY2G31VOAoA",
//   authDomain: "sme-test-73103.firebaseapp.com",
//   projectId: "sme-test-73103",
//   //storageBucket: "instagram-3538a.appspot.com",
//   //messagingSenderId: "973661537429",
//   appId: "1:406089536194:android:a7b196521cf6a6a4cd615b",
//   //measurementId: "G-V19917TC14"
// };

// if (firebase.apps.length === 0) {
//   firebase.initializeApp(firebaseConfig);
// }

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import LandingScreen from './components/auth/Landing';
import RegisterScreen from './components/auth/Register';
import LoginScreen from './components/auth/Login';

const Stack = createStackNavigator();

export class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
    }
  }
  logout() {
    auth()
      .signOut()
      .then(() => console.log('User signed out!'));
  }


  componentDidMount() {
    auth().onAuthStateChanged((user) => {
      if (!user) {
        this.setState({
          loggedIn: false,
          loaded: true
        })
      } else {
        this.setState({
          loggedIn: true,
          loaded: true
        });
      }
    });
  }

  render() {
    const { loggedIn, loaded } = this.state;
    if (!loaded) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text>Loading</Text>
        </View>
      )
    }
    if (!loggedIn) {
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen name="Register" component={RegisterScreen} />
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }
    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text>user is logged in</Text>
        <Button
          onPress={() => this.logout()}
          title="Log Out"
        />
      </View>
    )
  }
}

export default App

// export default function App() {
  //export default class App extends Component{
  // return (
  //   <NavigationContainer>
  //     <Stack.Navigator initialRouteName="Landing">
  //       <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
  //       <Stack.Screen name="Register" component={RegisterScreen} />
  //     </Stack.Navigator>
  //   </NavigationContainer>
  // );

  // Set an initializing state whilst Firebase connects
//   const [initializing, setInitializing] = useState(true);
//   const [user, setUser] = useState();

//   function logout() {
//     auth()
//       .signOut()
//       .then(() => console.log('User signed out!'));
//   }

//   // Handle user state changes
//   function onAuthStateChanged(user) {
//     setUser(user);
//     if (initializing) setInitializing(false);
//   }

//   useEffect(() => {
//     const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
//     return subscriber; // unsubscribe on unmount
//   }, []);

//   if (initializing) return null;

//   if (!user) {
//     return (
//       <NavigationContainer>
//         <Stack.Navigator initialRouteName="Landing">
//           <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
//           <Stack.Screen name="Register" component={RegisterScreen} />
//         </Stack.Navigator>
//       </NavigationContainer>
//     );
//   }
//   return (
//     <View>
//       <Text>Welcome {user.email}</Text>
//       <Button
//         onPress={() => this.logout()}
//         title="Log Out"
//       />

//     </View>
//   )
// }

/**
 * npm i react-native-screens
 * npm i @react-native-community/masked-view
 * npm i react-native-gesture-handler
 */


