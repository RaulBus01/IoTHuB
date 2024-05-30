
const FileSaverText = async(data:any) => {
    try {
        const transcript = data.channels[0].alternatives[0].transcript;
        
        
        if (transcript === '') {
            throw new Error('No transcript found');
        }
        const blob = new Blob([transcript], { type: 'text/plain', lastModified: Date.now() });

        return blob;
    } catch (error) {
        console.error(error);
    }
}

export default FileSaverText;