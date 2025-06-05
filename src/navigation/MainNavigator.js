
import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector, useDispatch } from 'react-redux';
import LoginScreen from '../screens/LoginScreen';
import ClientListScreen from '../screens/ClientListScreen';
import CaptureScreen from '../screens/CaptureScreen';
import { isJwtExpired } from '../utils/jwt';
import { logout } from '../slices/authSlice';

const Stack = createStackNavigator();

export default function MainNavigator() {
  const token = useSelector(state => state.auth.token);
  const dispatch = useDispatch();
  const isLoggedIn = token && !isJwtExpired(token);

  useEffect(() => {
    if (token && isJwtExpired(token)) {
      dispatch(logout());
    }
  }, [token, dispatch]);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isLoggedIn ? (
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
