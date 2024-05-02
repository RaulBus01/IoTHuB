import {BaseToast,ErrorToast} from 'react-native-toast-message';
export const toastConfig = {
    success: (props) => (
      <BaseToast
        {...props}
        style={{ borderColor: 'green' ,backgroundColor: 'lightgreen'}}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 14,
          color: 'white'
        }}
        />),
    error: (props) => (
      <ErrorToast
        {...props}
        style={{ borderLeftColor: 'red' ,backgroundColor: 'lightcoral'}}
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
        style={{ borderColor: 'blue' ,backgroundColor: 'lightblue'}}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          fontSize: 14,
          color: 'white'
        }}

        />)
  };