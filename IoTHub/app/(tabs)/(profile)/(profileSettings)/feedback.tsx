import { View, Text, TextInput, Pressable } from 'react-native'
import React from 'react'
import { stylesProfile } from '../profileStyles'
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';
import { auth } from '../../../../configFirebase';

const feedback = () => {
    const [rating, setRating] = React.useState(1);
    const [feedback, setFeedback] = React.useState('');
    
    const handleRatingChange = (value: React.SetStateAction<number> | undefined) => {
        if (value !== undefined && typeof value === 'number' ) {
            
            setRating(value);
          }
       
    }

    const handleFeedback = () => {
        // sent feedback to db 
        const user = auth.currentUser;
        const sendFeedback = {
            user: user?.displayName, // Add null check for user
            feedback: feedback,
            rating: rating,
        }
        console.log(sendFeedback);
    }

    return (
        <View style={stylesProfile.container}>
            <View style={stylesProfile.contentFeedback}>
                <Text style={stylesProfile.textProfile}>Feedback</Text>
                <Text style={stylesProfile.textProfile}>Please send us your feedback here: </Text>
                <TextInput
                    
                    style={stylesProfile.textAreaInput}
                    multiline={true}
                    numberOfLines={10}
                    placeholder='Your feedback here...'
                    onChangeText={(text) => setFeedback(text)}


                />
                <Text style={stylesProfile.textProfile}>Rating </Text>
                <Slider
                    style={stylesProfile.sliderStyle}
                    minimumValue={1}
                    maximumValue={5}
                    step={1}
                    value={rating}
                    onValueChange={(value) => handleRatingChange(value) }
                    disabled={false}
                />
                <View style={stylesProfile.iconsSlider}>
                    {[1, 2, 3, 4, 5].map((value) => (
                            <Ionicons
                                key={value}
                                name="star"
                                size={24}
                                color={value <= rating ? 'gold' : 'gray'}
                                onPress={() => handleRatingChange(value)}
                            />
                        ))}
                </View>
                 <Pressable style={stylesProfile.actionButton} onPress={handleFeedback}>
                    <Text style={stylesProfile.loginText}>Submit</Text>
                </Pressable>
            </View>
        </View>
    )
}

export default feedback;
