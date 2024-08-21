import { getDatabase, ref, onValue, set, get } from "firebase/database";
import { database } from './firebaseConfig.js';

const INTERVAL = 60000;

const dbRef = ref(database, `/${process.env.KEY}/lastPing`);

setInterval(() => {
    const ping = (new Date()).getTime();
    console.log("Pinging at ", ping)
    
    set(dbRef, ping);
}, INTERVAL)
