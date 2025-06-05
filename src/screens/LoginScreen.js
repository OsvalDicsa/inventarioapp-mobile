
import React, { useState } from 'react';
import { Alert } from 'react-native';
import { Box, Input, Button, Text, VStack } from 'native-base';
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
    <Box flex={1} justifyContent="center" p={4} bg={colors.background}>
      <VStack space={3}>
        <Text style={styles.title}>Ingreso</Text>
        <Input
          placeholder="Usuario"
          value={username}
          onChangeText={setUsername}
          style={styles.input}
        />
        <Input
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        <Button
          onPress={handleLogin}
          bg={colors.primary}
          _text={{ color: colors.white }}
          isLoading={status === 'loading'}
        >
          Entrar
        </Button>
      </VStack>
    </Box>
  );
}

