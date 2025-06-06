
import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { colors } from '../theme';
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
      <Text variant="headlineMedium" style={styles.title}>
        Ingreso
      </Text>
      <TextInput
        mode="outlined"
        label="Usuario"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
      />
      <TextInput
        mode="outlined"
        label="Contraseña"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button
        mode="contained"
        onPress={handleLogin}
        loading={status === 'loading'}
      >
        Entrar
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: colors.background
  },
  title: {
    textAlign: 'center',
    marginBottom: 20
  },
  input: {
    marginBottom: 12
  }
});

