import auth from '@react-native-firebase/auth'
import axios from 'axios'
import { USER_STATE_CHANGE } from '../constants/index'

export function fetchClient() {
  return ((dispatch) => {
    const uid = auth().currentUser.uid
    axios.get(`http://192.168.68.109:5050/client/${uid}`)
      .then(function (response) {
        dispatch({
          type: USER_STATE_CHANGE, currentUser: response.data
        });
        console.log('fetchClient() success');
        //console.log(response.data);
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
  })
}