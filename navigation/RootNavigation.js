import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import FormsScreen from '../screens/FormsScreen';
import ViewFormsScreen from '../screens/ViewFormsScreen';
import AuthScreen from '../screens/AuthScreen';

const Tab = createBottomTabNavigator();

const RootNavigation = () => {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Forms" component={FormsScreen} />
        <Tab.Screen name="View Forms" component={ViewFormsScreen} />
        <Tab.Screen name="Login/Signup" component={AuthScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigation;
