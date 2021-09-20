import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDOKn88vEsYjhvNerE-oadm8NmJ48pMTyM",
    authDomain: "task-assignment-aef22.firebaseapp.com",
    databaseURL: "https://task-assignment-aef22-default-rtdb.firebaseio.com",
    projectId: "task-assignment-aef22",
    storageBucket: "task-assignment-aef22.appspot.com",
    messagingSenderId: "922945396063",
    appId: "1:922945396063:web:3b4b35e9a2c12684ea6aea",
    measurementId: "G-H8DCPGGHF4"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage };
