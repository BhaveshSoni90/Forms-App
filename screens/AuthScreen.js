import React, { useState } from 'react';
import { View, TextInput, Button, Text } from 'react-native';
import axios from 'axios';

const AuthScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleAuth = () => {
    const url = isLogin
      ? 'https://your-api-url.com/login'
      : 'https://your-api-url.com/signup';

    axios.post(url, { email, password })
      .then(response => {
        console.log('User authenticated:', response.data);
      })
      .catch(error => {
        console.error('Authentication error:', error);
      });
  };

  return (
    <View>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
      />
      <Button title={isLogin ? 'Login' : 'Signup'} onPress={handleAuth} />
      <Text onPress={() => setIsLogin(!isLogin)}>
        {isLogin ? 'Switch to Signup' : 'Switch to Login'}
      </Text>
    </View>
  );
};

export default AuthScreen;
