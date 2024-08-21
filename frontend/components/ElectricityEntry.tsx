import {View, Text, StyleSheet, ScrollView} from 'react-native';
import PrettyDate from './PrettyDate';
import { ThemedText } from './ThemedText';


type Props = {
    time : number,
    isPowerCut : boolean,
    isCurrent : boolean
}; 

export default function ElectricityEntry({time, isPowerCut, isCurrent}: Props) {  
    return <ScrollView
    style={{
      flexDirection: 'row',
      height: 100,
      padding: 17,
      paddingTop: 19,
      backgroundColor: '#00bbffaa',
      marginTop: 20,
      width: 350,
      marginLeft: 4,
      borderRadius: 5,
      borderLeftWidth: 5,
      borderColor: isCurrent ? '#00eeff' : isPowerCut ? '#d1000a' : '#00d138',
    }}>
    <PrettyDate date={time} isPowerCut={isPowerCut}></PrettyDate>
  </ScrollView>
}