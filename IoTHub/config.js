import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyClJx2fI_rOqSg8iIrugdBoePhpImoy0rA",
  authDomain: "iothub-e48d1.firebaseapp.com",
  projectId: "iothub-e48d1",
  storageBucket: "iothub-e48d1.appspot.com",
  messagingSenderId: "369399481903",
  appId: "1:369399481903:web:c9266314b9d6d11a48e8da",
  measurementId: "G-0C17RTMK5Y"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export {auth,app}