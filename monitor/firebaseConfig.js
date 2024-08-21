// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

//INSERT FIREBASE CONFIG HERE

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);