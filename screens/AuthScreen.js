// screens/AuthScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import axios from 'axios';
import { useAuth } from '../AuthContext'; // Import the Auth context

const AuthScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth(); // Get login method from context

  const handleAuth = async () => {
    setLoading(true);
    const url = isLogin
      ? 'http://localhost:5000/api/login'  // Replace with your API endpoint
      : 'http://localhost:5000/api/signup'; // Replace with your API endpoint

    try {
      const response = await axios.post(url, { email, password });

      if (isLogin) {
        console.log('Login successful:', response.data);
        Alert.alert('Success', 'Login successful!');
        login(response.data); // Call login after successful authentication
      } else {
        console.log('Signup successful:', response.data);
        Alert.alert('Success', 'Signup successful! You can now log in.');
        setIsLogin(true); // Switch to login mode after signup
      }
    } catch (error) {
      console.error('Authentication error:', error);

      if (isLogin) {
        if (error.response && error.response.data.error === 'User not found') {
          Alert.alert('Error', 'User does not exist. Please sign up.');
        } else {
          Alert.alert('Error', 'Invalid login credentials. Please try again.');
        }
      } else {
        if (error.response && error.response.data.error === 'Email already in use') {
          Alert.alert('Error', 'Email is already in use. Please log in.');
        } else {
          Alert.alert('Error', 'Something went wrong. Please try again.');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ marginBottom: 10, padding: 10, borderWidth: 1 }}
      />
      <TextInput
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        style={{ marginBottom: 10, padding: 10, borderWidth: 1 }}
      />
      <Button title={isLogin ? 'Login' : 'Signup'} onPress={handleAuth} disabled={loading} />
      {loading && <Text>Loading...</Text>}
      <Text
        onPress={() => setIsLogin(!isLogin)}
        style={{ marginTop: 10, color: 'blue', textAlign: 'center' }}
      >
        {isLogin ? 'Switch to Signup' : 'Switch to Login'}
      </Text>
    </View>
  );
};

export default AuthScreen;
