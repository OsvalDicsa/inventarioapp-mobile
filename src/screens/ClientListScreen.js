// src/screens/ClientListScreen.js
import React, { useEffect, useState } from 'react';
import {
  View,
  FlatList,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Keyboard
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import NetInfo from '@react-native-community/netinfo';
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
      <View style={styles.headerRow}>
        <Text style={styles.title}>Clientes</Text>
        {pending.length > 0 && (
          <View style={styles.badgeContainer}>
            <Text style={styles.badgeText}>{pending.length}</Text>
          </View>
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
          clearButtonMode="while-editing"
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    padding: 16
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1f2937'
  },
  badgeContainer: {
    marginLeft: 8,
    backgroundColor: '#dc2626',
    borderRadius: 12,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 6
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600'
  },
  offlineText: {
    color: '#dc2626',
    marginBottom: 8,
    fontSize: 14
  },
  searchContainer: {
    marginBottom: 12
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    backgroundColor: '#ffffff',
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    color: '#111827'
  },
  item: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 6,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  itemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827'
  },
  itemSubText: {
    fontSize: 13,
    color: '#6b7280',
    marginTop: 4
  },
  emptyContainer: {
    marginTop: 32,
    alignItems: 'center'
  },
  emptyText: {
    fontSize: 16,
    color: '#6b7280'
  }
});
