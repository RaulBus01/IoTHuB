import { StyleSheet } from 'react-native';
export const stylesProfile = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '',
        alignItems: 'center',
  
    },

    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        width: '100%',
  
      
    },
    content: {
        
        marginTop:30,
        
        borderRadius: 10,
        
        height: 420,
        alignItems: 'center',
        backgroundColor: '#63c5e2',
        width: 400,
      
    },
    contentFeedback:{
        marginTop:30,
        borderRadius: 10,
        height: 620,
        alignItems: 'center',
        backgroundColor: '#63c5e2',
        width: 400,
    },
    
    buttonLeft: {
        backgroundColor: '#67C6E3',
        padding: 10,
        marginLeft: 10,
        borderTopLeftRadius: 10,
        width: 180,
        alignItems: 'center',
        
    },
    buttonLeftActive: {
        backgroundColor: '#6788E3',
        padding: 10,
        marginLeft: 10,
        borderTopLeftRadius: 10,
        width: 180,
        alignItems: 'center',
        
    },
    buttonRight: {
        backgroundColor: '#67C6E3',
        padding: 10,
        marginLeft: 10,
        marginRight: 10,
        borderTopRightRadius: 10,
        width: 200,
        alignItems: 'center',
        
    },
    buttonRightActive: {
        backgroundColor: '#6788E3',
        padding: 10,
        marginLeft: 10,
        marginRight: 10,
        borderTopRightRadius: 10,
        width: 200,
        alignItems: 'center',
        
    },
    buttonText: {
        color: 'white',
        fontSize: 20,
    },
    textProfile: {
        fontSize: 20,
        textAlign: 'center',
        marginVertical: 20,
        color: 'white',
    },
    googleButton: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#63E2C0',
        padding: 10,
        width: 200,
        borderRadius: 10,
        marginBottom: 10,
    },
    logoGoogle: {
        marginRight: 10,
        color: 'white',
    },
    loginText: {
        color: 'white',
        fontSize: 16,
    },
    inputContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        width: 240,
        height: 40,
        padding: 10,
        borderRadius: 10,
        marginBottom: 10,
        marginVertical: 10,
    },
    input :{
      flex: 1,
       
      backgroundColor: '#fff',
      paddingVertical: 10, 
      paddingRight: 10, 
      fontSize: 16, 
      
    },
    passwordContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center',
    
    
  },
  eyeIcon: {
      justifyContent: 'center',
      position: 'absolute',
      right: 12,
      
  },
    linkContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 200,
    },
    forgotPasswordLink: {
        marginTop: 10,
        width: 200,
    },
    forgotPasswordText: {
        color: 'white',
        textAlign: 'right',
        fontSize: 16,
    },
    bottomButton: {
        flex: 1,
        marginBottom: 30,
        justifyContent: 'flex-end',
        alignItems: 'center',
        width: '100%',
    },
    actionButton: {
        backgroundColor: '#63E2C0',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
        width: 300,
    },
    actionButtonDisabled: {
        backgroundColor: '#63E2C0',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
        width: 300,
        opacity: 0.5,
    },
    textAreaInput: {
        backgroundColor: '#fff',
        
        textAlign: 'left',
        textAlignVertical:'bottom',
        padding: 10,
        borderRadius: 10,
        marginVertical: 10,
        width: 300,
        height: 240,
    },
    sliderStyle:{
        width: 300,
        marginVertical: 10,
    
    },
    iconsSlider:
    {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 200,
        marginBottom: 10,
    },
  });