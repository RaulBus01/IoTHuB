const FileSaverAudio = async(data:any) => {
    try {
       
        

        const response = await fetch(data);
        const audioData = await response.blob();

        return audioData;

    } catch (error) {
        console.error(error);
    }
}

export default FileSaverAudio;
