// screens/AuthScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import { useAuth } from '../AuthContext'; // Import the Auth context

const AuthScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const { user, login, logout } = useAuth(); // Get user data, login, and logout from context

  const handleAuth = async () => {
    setLoading(true);
    const url = isLogin
      ? 'https://forms-backend-gac5.onrender.com/api/login'
      : 'https://forms-backend-gac5.onrender.com/api/signup';

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

  const handleLogout = () => {
    logout(); // Call the logout method to clear the user's session
    Alert.alert('Logged out', 'You have been logged out successfully.');
  };

  if (user) {
    // If user is logged in, show user details and logout button
    return (
      <View style={styles.container}>
        <Text style={styles.welcomeText}>Welcome, {user.name}!</Text> {/* Show user name */}
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        style={styles.input}
      />
      <TouchableOpacity style={styles.button} onPress={handleAuth} disabled={loading}>
        <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Signup'}</Text>
      </TouchableOpacity>
      {loading && <Text style={styles.loadingText}>Loading...</Text>}
      <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.switchButton}>
        <Text style={styles.switchButtonText}>
          {isLogin ? 'Switch to Signup' : 'Switch to Login'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 20,
    color: '#333',
  },
  input: {
    width: '100%',
    padding: 15,
    marginVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    fontSize: 16,
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 8,
    marginVertical: 10,
    width: '100%',
    alignItems: 'center',
    elevation: 2, // Shadow effect for Android
    shadowColor: '#000', // Shadow effect for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#fff',
  },
  loadingText: {
    marginTop: 10,
    color: '#555',
    fontSize: 14,
  },
  switchButton: {
    marginTop: 20,
  },
  switchButtonText: {
    color: '#007BFF',
    fontSize: 16,
  },
});

export default AuthScreen;
