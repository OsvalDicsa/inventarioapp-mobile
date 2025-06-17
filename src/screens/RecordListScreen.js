import React, { useEffect } from 'react';
import { View, FlatList, Text, TouchableOpacity, Image, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRecords, deleteRecord } from '../slices/recordsSlice';
import styles from '../styles/recordListStyles';

export default function RecordListScreen({ navigation }) {
  const dispatch = useDispatch();
  const records = useSelector(state => state.records.list || []);
  const status = useSelector(state => state.records.status);

  useEffect(() => {
    dispatch(fetchRecords());
  }, [dispatch]);

  const handleDelete = id => {
    Alert.alert('Eliminar', '¿Eliminar registro?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Eliminar', style: 'destructive', onPress: () => dispatch(deleteRecord(id)) }
    ]);
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      {item.photoUrl && (
        <Image source={{ uri: item.photoUrl }} style={styles.photo} />
      )}
      <View style={styles.info}>
        <Text style={styles.text}>Cliente: {item.codcliente}</Text>
        <Text style={styles.text}>Artículo: {item.cod_articulo}</Text>
        <Text style={styles.text}>Cantidad: {item.qty}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity
          onPress={() => navigation.navigate('EditRecord', { record: item })}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.button}>
          <Text style={styles.buttonText}>Eliminar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {status === 'loading' ? (
        <Text style={styles.loading}>Cargando...</Text>
      ) : (
        <FlatList
          data={records}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}
