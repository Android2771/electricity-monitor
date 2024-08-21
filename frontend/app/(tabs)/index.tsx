import React, {useState, useEffect, useCallback} from 'react';
import { RefreshControl, ScrollView, StyleSheet, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ref, onValue } from "firebase/database";
import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import { database, firebaseConfig } from './firebaseConfig';
import ElectricityEntry from '@/components/ElectricityEntry';

const BACKGROUND_FETCH_TASK = 'background-fetch';

TaskManager.defineTask(BACKGROUND_FETCH_TASK, async () => {
    const key = await AsyncStorage.getItem("@MySuperStore:key")
    let notified = await AsyncStorage.getItem("@MySuperStore:notified");

    if(!notified){      
      await AsyncStorage.setItem("@MySuperStore:notified", "0");
      notified = "0"
    }

    const response = await fetch(`${firebaseConfig.databaseURL}/"${key.trim()}"/entries.json`);
    const snapshot = await response.json();

    if(parseInt(notified!) !== 0 && parseInt(notified!) < snapshot.length){
        await schedulePushNotification(snapshot[snapshot.length - 1]["isPowerCut"])    
    }

    await AsyncStorage.setItem("@MySuperStore:notified", snapshot.length.toString());  

    return BackgroundFetch.BackgroundFetchResult.NewData;
  });

async function registerBackgroundFetchAsync() {
  return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
    minimumInterval: 5 * 60, // 15 minutes
    stopOnTerminate: false, // android only,
    startOnBoot: true, // android only
  });
}

async function unregisterBackgroundFetchAsync() {
  return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
}

// Request permissions for notifications
async function requestUserPermission() {
  const settings = await Notifications.getPermissionsAsync();
  if (!settings.granted) {
    await Notifications.requestPermissionsAsync();
  }
}

type ElectricityEntry = {
  isPowerCut : boolean,
  time : number
}

requestUserPermission();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function scheduleCustomNotification(message : string) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: message,
      body: 'Tap for more information',
    },
    trigger: { seconds: 2 },
  });
}

async function schedulePushNotification(isPowerCut : boolean) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: isPowerCut ? "Power cut! ⚡" : "Power back! ⚡",
      body: 'Tap for more information',
    },
    trigger: { seconds: 2 },
  });
}

export default function HomeScreen() {
  const [key, setKey] = useState('');
  const [refresh, setRefresh] = useState(false);
  const [electricityEntries, setElectricityEntries] = useState([])

  console.log(key)

  useEffect(() => {
    AsyncStorage.setItem("@MySuperStore:notified", "0");
    registerBackgroundFetchAsync();
    
    let unsubscribe : any = () => {};
    AsyncStorage.getItem("@MySuperStore:key").then(key => {
      if(key){
        setKey(key);
        const dbRef = ref(database, `/${key.trim()}`);

        unsubscribe = onValue(dbRef, (snapshot) => {
            console.log(snapshot.val()["entries"]);    
            const entries = snapshot.val()["entries"].reverse().slice(0, snapshot.val()["entries"].length-1);
            if(!entries[0]["isPowerCut"]){
              const lastPing = {isPowerCut: false, time: snapshot.val()["lastPing"]};
              setElectricityEntries([lastPing, ...entries]);
            }else{
              setElectricityEntries(entries);
            }
        });

        setRefresh(false);
      }
    })
    
    return () => {
      unregisterBackgroundFetchAsync();
      unsubscribe();
    };
  }, [refresh])

  const refreshKey = async (newKey : string) => {
    setKey(newKey);
    await AsyncStorage.setItem("@MySuperStore:key", newKey);
    refreshEntries()
  }

  const refreshEntries = useCallback(() => {
    setRefresh(true);
    setElectricityEntries([])
  }, [])

  let id = 0;
  let isPowerCut = electricityEntries.length !== 0 ? electricityEntries[0]["isPowerCut"] : true;
  
  return (
    <ScrollView style={{backgroundColor: "#0a2130"}} refreshControl={<RefreshControl refreshing={refresh} onRefresh={refreshEntries}/>}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText style={{color: '#d3e3fd'}} type="title">Electricity Monitor App</ThemedText>
      </ThemedView>
      <TextInput
        style={styles.textInput}
        placeholder="Enter reporter key here"
        placeholderTextColor="#d3e3fd" 
        onChangeText={refreshKey}
        defaultValue={key}
      />
      {
        electricityEntries.map((electricityEntry : ElectricityEntry) => <ElectricityEntry key={id++} isCurrent={!isPowerCut && id === 0} time={electricityEntry.time} isPowerCut={electricityEntry.isPowerCut}></ElectricityEntry>)
      }  
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#0a2130',
    padding: 40,
    paddingBottom: 20
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
  textInput: {
    height: 40,
    color: '#d3e3fd',
    borderBottomWidth: 5,
    borderBottomColor: '#d3e3fd',
    fontSize: 18,
    marginLeft: 30,
    marginRight: 30,
    marginBottom: 15}
});
