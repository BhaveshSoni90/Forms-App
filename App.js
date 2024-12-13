// App.js
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './AuthContext'; // Import the AuthProvider
import FormsScreen from './screens/FormsScreen'; // Home screen
import ViewFormsScreen from './screens/ViewFormsScreen'; // View forms screen
import AuthScreen from './screens/AuthScreen'; // Auth screen
import { MaterialIcons } from 'react-native-vector-icons'; // Icons for tab navigation

const Tab = createBottomTabNavigator();

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarStyle: { backgroundColor: '#33ffff' },
            tabBarActiveTintColor: 'black',
            tabBarInactiveTintColor: 'gray',
          }}
        >
          {/* Forms Tab */}
          <Tab.Screen
            name="Forms"
            component={FormsScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="description" color={color} size={size} />
              ),
            }}
          />

          {/* View Forms Tab */}
          <Tab.Screen
            name="View Forms"
            component={ViewFormsScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="visibility" color={color} size={size} />
              ),
            }}
          />

          {/* Login/Signup Tab */}
          <Tab.Screen
            name="Login/Signup"
            component={AuthScreen}
            options={{
              tabBarIcon: ({ color, size }) => (
                <MaterialIcons name="account-circle" color={color} size={size} />
              ),
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
