import {BaseToast,ErrorToast} from 'react-native-toast-message';
import { Platform } from 'react-native';
const platform = Platform.OS;
export const toastConfig = {

    success: (props) => (
      <BaseToast
        {...props}

        style={{ borderColor: 'green' ,backgroundColor: 'lightgreen', width: platform === 'web' ? 500 : 300 }}
        contentContainerStyle={{ paddingHorizontal: 15}}
        text1Style={{
          fontSize: 14,
          color: 'white'
        }}
        text2Style={{
          color: 'white',
          fontSize: 14
        }}
        />),
    error: (props) => (
      <ErrorToast
        {...props}
        style={{ borderLeftColor: 'red' ,backgroundColor: 'lightcoral', width: platform === 'web' ? 500 : 300}}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          
          fontSize: 14,
          color: 'white'
        }}
        text2Style={{
          color: 'white',
          fontSize: 14
        }}
        />)
    ,
    info: (props) => (
      <BaseToast
        {...props}
        style={{ borderColor: 'blue' ,backgroundColor: 'lightblue', width: platform === 'web' ? 500 : 300}}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 14,
          color: 'white'
        }}

        />)
  };