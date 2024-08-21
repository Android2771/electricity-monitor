import { getDatabase, ref, onValue, set, get } from "firebase/database";
import { database } from './firebaseConfig.js';

const THRESHOLD = 300000;
const INTERVAL = 120000;

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
}

let previousPing = (await get(lastPingRef)).val();
let isPowerCut = true;

setInterval(async () => {
    const lastPing = (await get(lastPingRef)).val();
    const entries = (await get(entriesRef)).val();

    isPowerCut = entries.length !== 0 ? entries[entries.length - 1]["isPowerCut"] : true;

    console.log("Fetched last ping ", lastPing);

    if(isPowerCut){
        if(lastPing !== previousPing){
            await set(entriesRef, [...entries, {
                "isPowerCut": false,
                time: (new Date()).getTime()
            }])
        }
    }else{
        if(lastPing !== 0 && (new Date()).getTime() - lastPing > THRESHOLD){   
            await set(entriesRef, [...entries, {
                "isPowerCut": true,
                time: (new Date()).getTime()
            }])
        }
    }

    previousPing = lastPing;
}, INTERVAL)
