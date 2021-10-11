import auth from '@react-native-firebase/auth'
import axios from 'axios'
import { USER_STATE_CHANGE } from '../constants/index'

export function fetchClient() {
  return ((dispatch) => {
    const uid = auth().currentUser.uid
    try {
      const response = axios.get(`http://192.168.68.109:5050/client/${uid}`)
      dispatch({
        type: USER_STATE_CHANGE, currentUser: response.data
      });
      console.log('fetchClient() success');
    } catch (error) {
      console.log(error);
    }
  })
}