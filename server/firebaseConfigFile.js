import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
 
const firebaseConfig = {
  apiKey: "AIzaSyDCMhP_sJmfgzb8PTQYKaAFmbBz5P5UhXQ",
  authDomain: "redmps-schedular.firebaseapp.com",
  projectId: "redmps-schedular",
  storageBucket: "redmps-schedular.appspot.com",
  messagingSenderId: "903831392092",
  appId: "1:903831392092:web:5af86ca9a88af28a8b7b99",
  measurementId: "G-B5MLRBFTY9"
};
 
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
 
export { db };