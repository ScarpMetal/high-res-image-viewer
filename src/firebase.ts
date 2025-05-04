// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB8mqSulj028vNrktusP2l0o53We2LVKDM",
  authDomain: "matthewgraham-me.firebaseapp.com",
  databaseURL: "https://matthewgraham-me.firebaseio.com",
  projectId: "matthewgraham-me",
  storageBucket: "matthewgraham-me.appspot.com",
  messagingSenderId: "376452991752",
  appId: "1:376452991752:web:907461baa70652a552fabd",
  measurementId: "G-SZVG5EBGF5",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
