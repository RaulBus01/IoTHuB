import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Audio } from 'expo-av';
import * as DocumentPicker from 'expo-document-picker';
import Toast from 'react-native-toast-message';
import { toastConfig } from '../../../toastConfig';
import { getStorage, ref, uploadBytes,getDownloadURL,listAll,deleteObject } from "firebase/storage";
import transcribeAudio from '../../../providers/DeepgramProvider';
import FileSaverText from '../../../providers/FileSaverText';
import FileSaverAudio from '../../../providers/FileSaverAudio';
import { router } from 'expo-router';
const TranscribeScreen = () => {
  

    type TranscriptionType = {
        title: string,
        lang: string,
        date: string,
        sound: Audio.Sound | null,
        
        playing?: boolean,
        paused?: boolean,
        transcription?: string,
    };

    type RecordingType = {
        sound: Audio.Sound | null,
        duration: string,
        file: string | null,
    };
    const FileType = {
        MP3: 'audio/mp3',
        WAV: 'audio/wav',
        FLAC: 'audio/flac',
        M4A: 'audio/m4a',
        MP4: 'video/mp4',
        MOV: 'video/quicktime',
        AVI: 'video/x-msvideo',
        WMV: 'video/x-ms-wmv',
        FLV: 'video/x-flv',
      };

    const [recording, setRecording] = React.useState<Audio.Recording | undefined>();
    const [recordings, setRecordings] = React.useState<RecordingType[]>([]);
    const [transcriptions, setTranscriptions] = React.useState<TranscriptionType[]>([]);

    const [loading, setLoading] = React.useState(false);
    
    async function startRecording() {
        try {
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });
            const { recording } = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HighQuality);
            setRecording(recording);
        } catch (err) {
            console.error(err);
        }
    }

    async function stopRecording() {
        if (!recording) return;
        setRecording(undefined);

        await recording.stopAndUnloadAsync();
    
        const result = await recording.getStatusAsync();
        const { sound } = await recording.createNewLoadedSoundAsync();
        const newRecording = {
            sound: sound || null,
            duration: getDurationFormatted(result.durationMillis),
            file: recording.getURI(),
        };
        setRecordings(prev => [...prev, newRecording]);
        
        
        await createTranscription(newRecording.file,newRecording,"record");
    }

    function getDurationFormatted(milliseconds: any) {
        const minutes = Math.floor(milliseconds / 1000 / 60);
        const seconds = Math.round((milliseconds / 1000) % 60);
        return seconds < 10 ? `${minutes}:0${seconds}` : `${minutes}:${seconds}`;
    }

   

    function playRecording(index: number) {
        transcriptions[index].sound?.setOnPlaybackStatusUpdate(playbackStatus => {
            if (playbackStatus.isLoaded) {
                setTranscriptions(prev => prev.map((item, i) => i === index ? { ...item, playing: !playbackStatus.didJustFinish } : item));
            }
        });
        transcriptions[index].sound?.replayAsync();
    }
    async function stopPlayback(index: number) {
        transcriptions[index].sound?.stopAsync();
        setTranscriptions(prev => prev.map((item, i) => i === index ? { ...item, playing: false } : item));
    }
    async function pausePlayback(index: number) {
        transcriptions[index].sound?.pauseAsync();
        setTranscriptions(prev => prev.map((item, i) => i === index ? { ...item, paused: true } : item));


    }
    async function resumePlayback(index: number) {
        transcriptions[index].sound?.playAsync();
        setTranscriptions(prev => prev.map((item, i) => i === index ? { ...item, paused: false } : item));
    }

    async function createTranscription(recording: any, recordingFile: any, type: string) {
      
    
        try {
            let results;
            if(type === "import"){
                Toast.show({
                    type: 'info',
                    text1: '🗨️ Transcribing audio',
                    text2: 'The audio is being transcribed',
                });

                results = await transcribeAudio(recording.assets[0].uri,"WEB");
                FileSaverAudio(recording.assets[0].uri).then(async (file) => {
                
                    await uploadFile(file, 'audio.mp3');}
                );
            }
            else if(type === "record")
            {
                Toast.show({
                    type: 'info',
                    text1: '🗨️ Transcribing audio',
                    text2: 'The audio is being transcribed',
                });
                results = await transcribeAudio(recording,"WEB");
                FileSaverAudio(recording).then(async (file) => {
                
                    await uploadFile(file, 'audio.mp3');}
                );
              
            }
           
            
            FileSaverText(results).then(async (file) => {
                await uploadFile(file, 'transcription.txt');});
                

        
            setTranscriptions(prev => [
                ...prev,
                {
                    title: `Transcription ${transcriptions.length + 1}`,
                    lang: 'en-US',
                    date: new Date().toISOString().split('T')[0],
                    sound: recordingFile.sound,
                    transcription: results.channels[0].alternatives[0].transcript
                  
                }
            ]);
    
            Toast.show({
                type: 'success',
                text1: '📘 Transcription created',
                text2: 'The transcription has been successfully created',
            });
        } catch (error) {
            console.error('Error creating transcription:', error);
    
            Toast.show({
                type: 'error',
                text1: '❌Error creating transcription',
                text2: 'An error occurred while creating the transcription',
            });
        }
    }
    async function deleteTranscriptionDB(index: number) {
        try {
          const storage = getStorage();
          const folderRef = ref(storage, `transcriptions/${index + 1}`);
      
          const res = await listAll(folderRef);
          for (const itemRef of res.items) {
            await deleteObject(itemRef);
            Toast.show
            ({
                type: 'success',
                text1: '🗑️ Transcription deleted',
                text2: 'The transcription has been successfully deleted',
            });
           
          }
        } catch (error) {
            console.error(error);
            Toast.show
            ({
                type: 'error',
                text1: '❌ Error deleting transcription',
                text2: 'An error occurred while deleting the transcription',
            });
        }
      }
    async function importRecording() {
        let result = await DocumentPicker.getDocumentAsync({});
        
        if (result.canceled === false) {
            if (!Object.values(FileType).includes(result.output[0].type)) {
                
                Toast.show({
                    type: 'error',
                    text1: '❌ Invalid file type',
                    text2: 'Please select a valid audio file',
                });
                return;
                
            } 
            else{
                const sound = new Audio.Sound();
                await sound.loadAsync({ uri: result.assets[0].uri});
                const duration = await sound.getStatusAsync();
            
                const newRecording = {
                    sound: sound,
                    duration: getDurationFormatted(duration),
                    file: result.assets[0].uri,
                };
                setRecordings(prev => [...prev, newRecording]);
                
                

                await createTranscription(result,newRecording,"import");
            }
        }
    }
    async function uploadFile(blob: Blob, fileName: string) {
        const storage = getStorage();
        const storageRef = ref(storage, `transcriptions/${transcriptions.length + 1}/${fileName}`);
        
    

        await uploadBytes(storageRef, blob);
      
    }
    async function listFiles() {
        const storage = getStorage();
        const storageRef = ref(storage, 'transcriptions/');
        const newTranscriptions: TranscriptionType[] = [];
        const res = await listAll(storageRef);
        for (const folderRef of res.prefixes) {
          const folderRes = await listAll(folderRef);
          let transcriptionText = '';
          let audioPath = '';
    
          for (const itemRef of folderRes.items) {
            if (itemRef.name.includes('.txt')) {
              const response = await fetch(await getDownloadURL(itemRef));
              transcriptionText = await response.text();
            }
            else {
              audioPath = itemRef.fullPath;
          
            }
            
          }
        
          const sound = new Audio.Sound();
          try {

            await sound.loadAsync({uri: await getDownloadURL(ref(storage, audioPath))});
          }
            catch (error) {
                console.error('Error loading sound:', error);
            }
            newTranscriptions.push({
                title: `Transcription ${newTranscriptions.length + 1}`,
                lang: 'en-US',
                date: new Date().toISOString().split('T')[0],
                sound,
                transcription: transcriptionText,
            });

        }
        setTranscriptions(newTranscriptions);

          
         
        
          
    }
    function deleteAllTranscriptionsDB() 
    {
        try {
            const storage = getStorage();
            const folderRef = ref(storage, `transcriptions/`);
            listAll(folderRef).then((res) => {
              res.prefixes.forEach((folderRef) => {
                listAll(folderRef).then((folderRes) => {
                  folderRes.items.forEach((itemRef) => {
                    deleteObject(itemRef);
                   
                  });
                }).catch((error) => {
                
                  Toast.show({
                    type: 'error',
                    text1: '❌Error deleting items',
                    text2: 'An error occurred while deleting items',
                  });
                });
              });
              Toast.show({
                type: 'success',
                text1: '🗑️Transcriptions deleted',
                text2: 'All transcriptions have been successfully deleted',
                });
                
            }).catch((error) => {
                Toast.show({
                    type: 'error',
                    text1: '❌Error listing folders',
                    text2: 'An error occurred while listing folders',
                }
              );
            });
          } catch (error) {
           
            Toast.show({
                type: 'error',
                text1: '❌ Error deleting items',
                text2: 'An error occurred while deleting items',
            });
          }
    }
     const navigateTo = (screen: string,text:any) => {
        
        router.push({ pathname: screen, params:{
            textString:text

        }});
      }
    React.useEffect(() => {
        listFiles();
    }, []);

   

    
   
    
    



    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Transcribe</Text>
            <Text style={styles.subtitle}>Voice to text</Text>
            <View style={styles.buttonContainer}>
                <Button mode="contained" style={styles.recordButton} onPress={recording ? stopRecording : startRecording}>
                    <Icon name="microphone" size={20} color="#fff" />
                    <Text style={styles.subtitle}>{recording ? 'Stop Recording' : 'Start Recording'}</Text>
                </Button>
                <Button mode="contained" onPress={importRecording}>
                    <Icon name="import" size={20} color="#fff" />
                    <Text style={styles.subtitle}>Import</Text>
                </Button>
            </View>
            <Button mode="contained" onPress={deleteAllTranscriptionsDB}>
                Clear Recordings
            </Button>
            {transcriptions.map((item, index) => (
                <Card key={index} style={styles.card}>
                    <View style={styles.cardContent}>
                        <View style={styles.cardText}>
                            <Text style={styles.cardTitle}>{item.title}</Text>
                            <Text style={styles.cardSubtitle}>{item.lang}</Text>
                            <Text style={styles.cardDate}>{item.date}</Text>
                            
                        </View>
                        <View style={styles.cardIcons}>
                            <Button onPress={() =>navigateTo("TextScreen",item.transcription)}>
                                <Icon name="pencil" size={18}  />
                            </Button>
                            <Button onPress={() => deleteTranscriptionDB(index)}>
                                <Icon name="delete" size={24}  />
                            </Button>

                            <Button onPress={() =>{item.playing ? stopPlayback(index):playRecording(index)}}>
                                <Icon name={item.playing?"stop-circle":"play-circle"} size={24} />

                            </Button>
                            { item.playing ?
                            <Button onPress={() =>{item.paused? resumePlayback(index):pausePlayback(index)}}>
                                <Icon name={item.paused?"play":"pause"} size={24} />
                            </Button>
                            :null}
                            
                        </View>
                    </View>
                </Card>
                
            ))}
            <Toast config={toastConfig} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 16,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 8,
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 16,
    },
    recordButton: {
        backgroundColor: 'linear-gradient(90deg, rgba(255,0,255,1) 0%, rgba(255,0,0,1) 100%)',
    },
    importButton: {
        backgroundColor: 'linear-gradient(90deg, rgba(0,181,222,1) 0%, rgba(0,0,255,1) 100%)',
    },
    card: {
        marginBottom: 16,
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    cardText: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    cardSubtitle: {
        fontSize: 14,
        color: 'gray',
    },
    cardDate: {
        fontSize: 12,
        color: 'gray',
    },
    cardIcons: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});

export default TranscribeScreen;
