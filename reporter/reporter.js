import { getDatabase, ref, onValue, set, get } from "firebase/database";
import { database } from './firebaseConfig.js';
const INTERVAL = 60000;

const lastPingRef = ref(database, `/${process.env.KEY}/lastPing`)
const entriesRef = ref(database, `/${process.env.KEY}/entries`)

if((!(await get(entriesRef)).val()) || !(await get(lastPingRef)).val()){
    const rootRef = ref(database, `/${process.env.KEY}`);
    set(rootRef, { 
        "entries":
            [
                {
                    "isPowerCut": true,
                    "time": 0
                }                
            ],
        "lastPing": 0
    })
}else{    
    const lastPing = (await get(lastPingRef)).val();
    const entries = (await get(entriesRef)).val();
    const newPing = (new Date()).getTime();

    console.log("Registering powercut at ", lastPing)
    console.log("Registering power coming back at ", newPing)

    await set(lastPingRef, newPing);

    await set(entriesRef, [...entries, {
        "isPowerCut": true,
        time: lastPing
    },
    {
        "isPowerCut": false,
        time: newPing
    }])
}

setInterval(async () => {
    const ping = (new Date()).getTime();
    console.log("Pinging at ", ping)
    
    await set(lastPingRef, ping);
}, INTERVAL)
