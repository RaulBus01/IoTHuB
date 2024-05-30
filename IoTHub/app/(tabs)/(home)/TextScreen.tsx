import { View, Text } from 'react-native';
import React from 'react';
import { useRouter, useLocalSearchParams } from 'expo-router';

const TextScreen = () => {
    const params = useLocalSearchParams();
    const {textString} = params;
    
    return (
        <View>
            {textString && <Text>{textString}</Text>}
        </View>
    );
};

export default TextScreen;
