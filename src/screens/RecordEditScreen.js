import React, { useState } from 'react';
import { View, Text } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { updateRecord } from '../slices/recordsSlice';
import styles from '../styles/recordEditStyles';

export default function RecordEditScreen({ route, navigation }) {
  const { record } = route.params;
  const [codcliente, setCodcliente] = useState(record.codcliente.toString());
  const [cod_articulo, setCodArticulo] = useState(record.cod_articulo.toString());
  const [qty, setQty] = useState(record.qty.toString());
  const dispatch = useDispatch();

  const handleSave = () => {
    dispatch(updateRecord({ id: record.id, codcliente, cod_articulo, qty })).then(() => {
      navigation.goBack();
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Cliente</Text>
      <TextInput value={codcliente} onChangeText={setCodcliente} style={styles.input} />
      <Text style={styles.label}>Artículo</Text>
      <TextInput value={cod_articulo} onChangeText={setCodArticulo} style={styles.input} />
      <Text style={styles.label}>Cantidad</Text>
      <TextInput value={qty} onChangeText={setQty} style={styles.input} keyboardType="numeric" />
      <Button mode="contained" onPress={handleSave} style={styles.button}>
        Guardar
      </Button>
    </View>
  );
}
