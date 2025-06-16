// src/screens/ClientListScreen.js
import React, { useEffect, useState, useLayoutEffect } from 'react';
import { Keyboard } from 'react-native';
import { View, FlatList, Text, TextInput, TouchableOpacity } from 'react-native';
import { Badge } from 'react-native-paper';
import styles from '../styles/clientListStyles';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClients } from '../slices/clientsSlice';
import { fetchArticulos } from '../slices/articulosSlice';
import { flushQueue } from '../slices/queueSlice';

export default function ClientListScreen({ navigation }) {
  const dispatch = useDispatch();
  const token = useSelector(state => state.auth.token);
  const clients = useSelector(state => state.clients.list || []);
  const pending = useSelector(state => state.queue.pending || []);
  const isConnected = useSelector(state => state.queue.isConnected);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredClients, setFilteredClients] = useState([]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate('Records')} style={{ marginRight: 10 }}>
          <Text style={{ color: 'white' }}>Registros</Text>
        </TouchableOpacity>
      )
    });
  }, [navigation]);

  // 1) Fetch inicial (clientes, artículos, y primer intento de vaciar cola)
  useEffect(() => {
    dispatch(fetchClients(token));
    dispatch(fetchArticulos(token));
    dispatch(flushQueue());
  }, [dispatch, token]);

  // 2) Filtrado según query
  useEffect(() => {
    const query = searchQuery.trim().toLowerCase();
    if (query === '') {
      setFilteredClients(clients);
    } else {
      const filtered = clients.filter(client => {
        const nombre = client.razonsocial.toLowerCase();
        const codigo = client.codcliente.toString();
        return nombre.includes(query) || codigo.includes(query);
      });
      setFilteredClients(filtered);
    }
  }, [searchQuery, clients]);

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.item}
      onPress={() => {
        Keyboard.dismiss();
        navigation.navigate('Capture', { client: item });
      }}
    >
      <Text style={styles.itemText}>{item.razonsocial}</Text>
      <Text style={styles.itemSubText}>Código: {item.codcliente}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Encabezado con título y badge de pendientes */}
      <View style={[styles.headerRow, { flexDirection: 'row', alignItems: 'center' }]}>
        <Text style={styles.title}>Clientes</Text>
        {pending.length > 0 && (
          <Badge style={styles.badgeContainer}>{pending.length}</Badge>
        )}
      </View>

      {/* Indicador sutil de estado de red (opcional) */}
      {!isConnected && pending.length > 0 && (
        <Text style={styles.offlineText}>
          🔴 Sin conexión – registros en cola ({pending.length})
        </Text>
      )}

      {/* Campo de búsqueda */}
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Buscar por código o razón social"
          placeholderTextColor="#6b7280"
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchInput}
        />
      </View>

      {/* Lista de clientes filtrada */}
      <FlatList
        data={filteredClients}
        keyExtractor={item => item.codcliente.toString()}
        renderItem={renderItem}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>
              {clients.length === 0
                ? 'Cargando clientes...'
                : 'No se encontraron clientes.'}
            </Text>
          </View>
        }
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
}

