
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';
import LoginScreen from '../screens/LoginScreen';
import ClientListScreen from '../screens/ClientListScreen';
import CaptureScreen from '../screens/CaptureScreen';

const Stack = createStackNavigator();

export default function MainNavigator() {
  const token = useSelector(state => state.auth.token);
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {token ? (
        <>
          <Stack.Screen name="Clients" component={ClientListScreen} />
          <Stack.Screen name="Capture" component={CaptureScreen} />
        </>
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
}
