
import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import { colors } from '../theme';
import styles from '../styles/loginStyles';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../slices/authSlice';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const status = useSelector(state => state.auth.status);

  const handleLogin = async () => {
    try {
      await dispatch(login({ username, password })).unwrap();
    } catch (err) {
      Alert.alert('Error', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ingreso</Text>
      <TextInput
        placeholder="Usuario"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button
        title={status === 'loading' ? 'Cargando...' : 'Entrar'}
        onPress={handleLogin}
        color={colors.primary}
      />
    </View>
  );
}

