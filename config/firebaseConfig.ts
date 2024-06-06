import { initializeApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyDFyGlAayz39RN6w7kb9rQqH-Z8zP20nPs",
  authDomain: "ebuddy-a1655.firebaseapp.com",
  projectId: "ebuddy-a1655",
  storageBucket: "ebuddy-a1655.appspot.com",
  messagingSenderId: "291153110770",
  appId: "1:291153110770:web:480659261fc99e5a5c926b",
  measurementId: "G-681QNQ3LCG"
};

const firebase = initializeApp(firebaseConfig);

export default firebase;