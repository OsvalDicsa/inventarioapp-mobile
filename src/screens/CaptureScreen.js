// src/screens/CaptureScreen.js
import React, { useState, useEffect } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  SafeAreaView,
  Platform,
  View,
  Text,
  Image,
  FlatList,
  TouchableOpacity
} from 'react-native';
import { TextInput, Button, Modal, Portal } from 'react-native-paper';
import styles from '../styles/captureStyles';
import * as ImagePicker from 'expo-image-picker';
import { useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { addPendingRequest, flushQueue } from '../slices/queueSlice';

const SIN_ACTIVOS = { cod_articulo: 1, articulo: 'SIN ACTIVOS' };

export default function CaptureScreen({ navigation }) {
  const route = useRoute();
  const { client } = route.params;
  const articulos = useSelector(state => state.articulos.list || []);
  const dispatch = useDispatch();

  const [qty, setQty] = useState('');
  const [photo, setPhoto] = useState(null);

  // Para el dropdown de artículos:
  const [selectedArticulo, setSelectedArticulo] = useState(null); // objeto completo: { cod_articulo, articulo }
  const [modalVisible, setModalVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredArticulos, setFilteredArticulos] = useState([]);

  // Cuando cambie articulos o searchTerm, actualizar el filtrado
  useEffect(() => {
    const term = searchTerm.trim().toLowerCase();
    if (term === '') {
      setFilteredArticulos(articulos);
    } else {
      const filtered = articulos.filter(a =>
        a.articulo.toLowerCase().includes(term) ||
        a.cod_articulo.toString().includes(term)
      );
      setFilteredArticulos(filtered);
    }
  }, [searchTerm, articulos]);

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permiso denegado', 'Necesitamos acceso a la cámara');
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.7,
      allowsEditing: false
    });
    if (!result.canceled) {
      const asset = result.assets[0];
      setPhoto({
        uri: asset.uri,
        name: asset.uri.split('/').pop(),
        type: 'image/jpeg'
      });
    }
  };

  const clearFields = () => {
    setQty('');
    setPhoto(null);
    setSelectedArticulo(null);
  };

  const handleSinActivos = () => {
    setSelectedArticulo(SIN_ACTIVOS);
    setQty('0');
  };

  const handleSave = () => {
    if (!selectedArticulo) {
      Alert.alert('Error', 'Falta seleccionar artículo');
      return;
    }

    if (selectedArticulo.cod_articulo !== SIN_ACTIVOS.cod_articulo && (!qty || !photo)) {
      Alert.alert('Error', 'Faltan datos: cantidad o foto');
      return;
    }

    const newRequest = {
      codcliente: client.codcliente,
      cod_articulo: selectedArticulo.cod_articulo,
      qty
    };

    if (photo) {
      Object.assign(newRequest, {
        photoUri: photo.uri,
        photoName: photo.name,
        photoType: photo.type
      });
    }

    dispatch(addPendingRequest(newRequest));
    dispatch(flushQueue());
    Alert.alert('Registro guardado', 'Se guardó el registro.');
    clearFields();
  };

  // Render de cada ítem en el dropdown
  const renderArticuloItem = ({ item }) => (
    <TouchableOpacity
      style={styles.articuloItem}
      onPress={() => {
        setSelectedArticulo(item);
        setModalVisible(false);
      }}
    >
      <Text style={styles.articuloText}>{item.articulo} (#{item.cod_articulo})</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          {/* Encabezado */}
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}>Registro para:</Text>
            <Text style={styles.clientName}>{client.razonsocial}</Text>
          </View>

          {/* SECCIÓN: Dropdown de Artículo con búsqueda */}
          <View style={[styles.sectionCard, !selectedArticulo && styles.sectionError]}>
            <Text style={styles.sectionLabel}>Artículo</Text>
            <TouchableOpacity
              style={styles.dropdownInput}
              onPress={() => setModalVisible(true)}
            >
              <Text style={selectedArticulo ? styles.dropdownText : styles.dropdownPlaceholder}>
                {selectedArticulo ? selectedArticulo.articulo : '-- Seleccione un artículo --'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.sinActivosWrapper}>
            <Button mode="outlined" onPress={handleSinActivos}>
              Sin activos
            </Button>
          </View>

          {/* Modal para buscar y seleccionar artículo */}
          <Portal>
            <Modal visible={modalVisible} onDismiss={() => setModalVisible(false)}>
              <SafeAreaView style={styles.modalContainer}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Buscar artículo</Text>
                  <TouchableOpacity
                    onPress={() => setModalVisible(false)}
                    style={styles.modalCloseButton}
                  >
                    <Text style={styles.modalCloseText}>Cerrar</Text>
                  </TouchableOpacity>
                </View>
                <TextInput
                  placeholder="Escriba nombre o código..."
                  placeholderTextColor="#999"
                  value={searchTerm}
                  onChangeText={setSearchTerm}
                  style={styles.modalSearchInput}
                  autoFocus
                />
                <FlatList
                  data={filteredArticulos}
                  keyExtractor={item => item.cod_articulo.toString()}
                  renderItem={renderArticuloItem}
                  ListEmptyComponent={
                    <View style={styles.modalEmpty}>
                      <Text style={styles.modalEmptyText}>No se encontraron artículos.</Text>
                    </View>
                  }
                  keyboardShouldPersistTaps="handled"
                />
              </SafeAreaView>
            </Modal>
          </Portal>

          {/* SECCIÓN: Cantidad */}
          <View style={[
            styles.sectionCard,
            !qty && selectedArticulo?.cod_articulo !== SIN_ACTIVOS.cod_articulo && styles.sectionError
          ]}>
            <Text style={styles.sectionLabel}>Cantidad</Text>
            <TextInput
              placeholder="Ingrese cantidad"
              placeholderTextColor="#999"
              value={qty}
              onChangeText={setQty}
              keyboardType="numeric"
              style={styles.textInput}
              editable={selectedArticulo?.cod_articulo !== SIN_ACTIVOS.cod_articulo}
            />
          </View>

          {/* SECCIÓN: Foto */}
          <View style={[
            styles.sectionCard,
            !photo && selectedArticulo?.cod_articulo !== SIN_ACTIVOS.cod_articulo && styles.sectionError
          ]}>
            <Text style={styles.sectionLabel}>Foto del producto</Text>
            {photo ? (
              <Image source={{ uri: photo.uri }} style={styles.photoPreview} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Text style={styles.photoPlaceholderText}>Sin foto</Text>
              </View>
            )}
            <View style={styles.photoButtonWrapper}>
              <Button mode="contained" onPress={takePhoto}>
                Tomar Foto
              </Button>
            </View>
          </View>

          {/* Botón Guardar */}
          <View style={styles.saveButtonWrapper}>
            <Button mode="contained" onPress={handleSave}>
              Guardar
            </Button>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

