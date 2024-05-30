import { HOST,PORT } from "../serverconfig";
const transcribeAudio = async (recording:any,platform:any) => {
  try {
    let fileUri = '';
    let formData = new FormData();
    let response;
    if(platform === 'Android'){
     
      fileUri = recording
      
    
      formData.append('audio',
        {
          uri: fileUri,
          type: 'audio/mp3',
          name: 'audio.mp3'
        });
        
      response = await fetch(`http://${HOST}:${PORT}/transcribe`, {
        method: 'POST',
        body: formData,
      });
    }
    else{
      fileUri = recording
      const file = await fetch(fileUri);
      const blob = await file.blob();
      formData.append('audio', blob);
      response = await fetch(`http://${HOST}:${PORT}/transcribe`, {
        method: 'POST',
        body: formData,
    });
    }
  
  
    
    
    
    const data = await response.json();
   
    if (!response.ok) {
        throw new Error(data.error);
    }
    
    return data.results;
  }
  catch (error) {
    console.error(error);
  }
}


export default transcribeAudio;