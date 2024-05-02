import { View, Text,TextInput, Pressable } from 'react-native'
import React from 'react'
import { useState } from 'react';

const Security = () => {
  const [password, setPassword] = useState('');
  const [twoFactorAuth, setTwoFactorAuth] = useState(false);

  const handleChangePassword = () => {
    // Call API to change password
  };

  const handleEnableTwoFactorAuth = () => {
    setTwoFactorAuth(true);
    // Call API to enable two-factor authentication
  };

  return (
    <View>
      <Text>Security</Text>
      <Text>Change Password</Text>
      <TextInput
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        placeholder="New Password"
      />
      <Pressable title="Change Password" onPress={handleChangePassword} />
      <Text>Two-Factor Authentication</Text>
      <Pressable title={twoFactorAuth ? "Disable" : "Enable"} onPress={handleEnableTwoFactorAuth} />
    </View>
  );
}

export default Security