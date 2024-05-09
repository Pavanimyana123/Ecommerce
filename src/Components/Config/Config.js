
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBP7aC2LtEU4tb8Qxj_IGqQZeus5Qq1GfU",
  authDomain: "ecommerce-app-with-react-6f8b8.firebaseapp.com",
  databaseURL: "https://ecommerce-app-with-react-6f8b8-default-rtdb.firebaseio.com",
  projectId: "ecommerce-app-with-react-6f8b8",
  storageBucket: "ecommerce-app-with-react-6f8b8.appspot.com",
  messagingSenderId: "69952088900",
  appId: "1:69952088900:web:9518cb5f2fbff410f94511",
  measurementId: "G-FYGY3Y6C98"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };