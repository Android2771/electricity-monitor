import {View, Text} from 'react-native';
import { ThemedText } from './ThemedText';
import { TabBarIcon } from './TabBarIcon';

type Props = {
    date : number;
    isPowerCut : boolean;
};

export default function PrettyDate({date, isPowerCut} : Props){
    const dateObject = new Date(date);

    return <View style={{flexDirection: 'row'}}><ThemedText style={{fontSize: 30, paddingTop: 24, width: 10000, color: 'white'}}>{dateObject.getDate().toString().padStart(2, '0')}/{(dateObject.getMonth()+1).toString().padStart(2, '0')}/{dateObject.getFullYear()} {dateObject.getHours().toString().padStart(2, '0')}:{dateObject.getMinutes().toString().padStart(2, '0')}</ThemedText><TabBarIcon style={{marginLeft: 275, marginTop: 11, position: 'absolute', fontSize: 35}} name={isPowerCut ? 'flash-outline' : 'flash'} color={'#FFFFFF'} /></View>
}