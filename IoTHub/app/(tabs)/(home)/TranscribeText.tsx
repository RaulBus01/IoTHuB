import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Audio } from 'expo-av';
import Toast from 'react-native-toast-message';
import { toastConfig } from '../../../toastConfig';
import { getStorage, ref, uploadBytes,getDownloadURL,listAll,deleteObject } from "firebase/storage";
import transcribeAudio from '../../../providers/DeepgramProvider';
import FileSaverText from '../../../providers/FileSaverText';
import FileSaverAudio from '../../../providers/FileSaverAudio';
import { router } from 'expo-router';
import TextScreen from './TextScreen';


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
   

    const [recording, setRecording] = React.useState<Audio.Recording | undefined>();
    const [recordings, setRecordings] = React.useState<RecordingType[]>([]);
    const [transcriptions, setTranscriptions] = React.useState<TranscriptionType[]>([]);
    async function startRecording() {
        try {
            await Audio.requestPermissionsAsync();
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
            });
            const { recording } = await Audio.Recording.createAsync({...Audio.RecordingOptionsPresets.HIGH_QUALITY,
                
            }
            );
            
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

   

    async function playRecording(index: number) {
        
        const status = await transcriptions[index].sound?.getStatusAsync();
        if (status?.isLoaded) {
            transcriptions[index].sound?.setOnPlaybackStatusUpdate(playbackStatus => {
                if (playbackStatus.isLoaded) {
                    setTranscriptions(prev => prev.map((item, i) => i === index ? { ...item, playing: !playbackStatus.didJustFinish } : item));
                }
            });
            transcriptions[index].sound?.replayAsync();
        } else {
            console.error('Sound file not loaded');
        }
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
           
           if(type === "record")
            {
                Toast.show({
                    type: 'info',
                    text1: '🗨️ Transcribing audio',
                    text2: 'The audio is being transcribed',
                });
                
                results = await transcribeAudio(recording,"Android");
                
               
            }
           FileSaverAudio(recording).then(async (file) => {
            await uploadAudio(file, 'audio.mp3');});

           
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
                text1: '❌ Error creating transcription',
                text2: 'An error occurred while creating the transcription',
            });
        }
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
                text1: '🗑️ Transcriptions deleted',
                text2: 'All transcriptions have been successfully deleted',
                });
                
            }).catch((error) => {
                Toast.show({
                    type: 'error',
                    text1: '❌ Error listing folders',
                    text2: 'An error occurred while listing folders',
                }
              );
            });
          } catch (error) {
           
            Toast.show({
                type: 'error',
                text1: 'Error deleting items',
                text2: 'An error occurred while deleting items',
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
                text1: ' 🗑️ Transcription deleted',
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
    
    
    async function uploadAudio(blob:Blob, fileName: string) {
        const storage = getStorage();
        
        const storageRef = ref(storage, `transcriptions/${transcriptions.length + 1}/${fileName}`);
        
        await uploadBytes(storageRef, blob);
      
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
          if (audioPath === '') {
            return;
          }
          await sound.loadAsync({ uri: await getDownloadURL(ref(storage, audioPath)) });
        
          newTranscriptions.push({
            title: `Transcription ${folderRef.name}`,
            lang: 'en-US',
            date: new Date().toISOString().split('T')[0],
            sound: sound,
            transcription: transcriptionText,
            
        });
        }
        setTranscriptions(newTranscriptions);
    }
    const navigateTo = (screen: string,text:any) => {
        
        router.push({ pathname: screen, params:{
            textString:text

        }});
      }
      const refresh = async() =>
        {   
           
            if (recording) {
                await recording.stopAndUnloadAsync();
                setRecording(undefined);
            }
            await listFiles();
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
                
            </View>
            <View style={styles.buttonContainer}>
            <Button mode="contained" onPress={deleteAllTranscriptionsDB}>
                Clear Transcriptions
            </Button>
            <Button mode="contained" onPress={refresh}>
                Refresh
            </Button>
            </View>
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
                                <Icon name="delete" size={18}  />
                            </Button>

                            <Button onPress={() =>{item.playing ? stopPlayback(index):playRecording(index)}}>
                                <Icon name={item.playing?"stop-circle":"play-circle"} size={18} />

                            </Button>
                            { item.playing ?
                            <Button onPress={() =>{item.paused? resumePlayback(index):pausePlayback(index)}}>
                                <Icon name={item.paused?"play":"pause"} size={18} />
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
        marginVertical:10,
        height:80,
        width: '100%',
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
        fontSize: 16,
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
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});

export default TranscribeScreen;
