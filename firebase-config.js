
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBr6aTKXLpPbke_uwiIXHuG-OHlPvtiRls",
  authDomain: "online-charts-project.firebaseapp.com",
  projectId: "online-charts-project",
  storageBucket: "online-charts-project.appspot.com",
  messagingSenderId: "633879277935",
  appId: "1:633879277935:web:077e5a74c3ffcd2dcdf89a"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore()
