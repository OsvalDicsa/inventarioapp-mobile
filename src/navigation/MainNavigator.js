
import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector, useDispatch } from 'react-redux';
import LoginScreen from '../screens/LoginScreen';
import ClientListScreen from '../screens/ClientListScreen';
import CaptureScreen from '../screens/CaptureScreen';
import RecordListScreen from '../screens/RecordListScreen';
import RecordEditScreen from '../screens/RecordEditScreen';
import { isJwtExpired } from '../utils/jwt';
import { logout } from '../slices/authSlice';
import { colors } from '../theme';

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
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: colors.white
      }}
    >
      {isLoggedIn ? (
        <>
          <Stack.Screen
            name="Clients"
            component={ClientListScreen}
            options={{ title: 'Clientes' }}
          />
          <Stack.Screen
            name="Capture"
            component={CaptureScreen}
            options={{ title: 'Registro' }}
          />
          <Stack.Screen
            name="Records"
            component={RecordListScreen}
            options={{ title: 'Registros' }}
          />
          <Stack.Screen
            name="EditRecord"
            component={RecordEditScreen}
            options={{ title: 'Editar Registro' }}
          />
        </>
      ) : (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
}
