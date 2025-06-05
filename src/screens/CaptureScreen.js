// src/screens/CaptureScreen.js
import React, { useState, useEffect } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  SafeAreaView,
  Platform
} from 'react-native';
import {
  Box,
  Text,
  Input,
  Button,
  Image,
  Modal,
  FlatList,
  Pressable
} from 'native-base';
import { colors } from '../theme';
import styles from '../styles/captureStyles';
import * as ImagePicker from 'expo-image-picker';
import { useRoute } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { addPendingRequest, flushQueue } from '../slices/queueSlice';

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

  const handleSave = () => {
    if (!qty || !photo || !selectedArticulo) {
      Alert.alert('Error', 'Faltan datos: artículo, cantidad o foto');
      return;
    }

    const newRequest = {
      codcliente: client.codcliente,
      cod_articulo: selectedArticulo.cod_articulo,
      qty,
      photoUri: photo.uri,
      photoName: photo.name,
      photoType: photo.type
    };

    dispatch(addPendingRequest(newRequest));
    dispatch(flushQueue());
    Alert.alert('Registro guardado', 'Se guardó el registro.');
    clearFields();
  };

  // Render de cada ítem en el dropdown
  const renderArticuloItem = ({ item }) => (
    <Pressable
      style={styles.articuloItem}
      onPress={() => {
        setSelectedArticulo(item);
        setModalVisible(false);
      }}
    >
      <Text style={styles.articuloText}>{item.articulo} (#{item.cod_articulo})</Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={styles.container}>
          {/* Encabezado */}
          <Box style={styles.headerContainer}>
            <Text style={styles.headerText}>Registro para:</Text>
            <Text style={styles.clientName}>{client.razonsocial}</Text>
          </Box>

          {/* SECCIÓN: Dropdown de Artículo con búsqueda */}
          <Box style={[styles.sectionCard, !selectedArticulo && styles.sectionError]}>
            <Text style={styles.sectionLabel}>Artículo</Text>
            <Pressable
              style={styles.dropdownInput}
              onPress={() => setModalVisible(true)}
            >
              <Text style={selectedArticulo ? styles.dropdownText : styles.dropdownPlaceholder}>
                {selectedArticulo ? selectedArticulo.articulo : '-- Seleccione un artículo --'}
              </Text>
            </Pressable>
          </Box>

          {/* Modal para buscar y seleccionar artículo */}
          <Modal isOpen={modalVisible} onClose={() => setModalVisible(false)}>
            <SafeAreaView style={styles.modalContainer}>
              <Box style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Buscar artículo</Text>
                <Pressable
                  onPress={() => setModalVisible(false)}
                  style={styles.modalCloseButton}
                >
                  <Text style={styles.modalCloseText}>Cerrar</Text>
                </Pressable>
              </Box>
              <Input
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
                  <Box style={styles.modalEmpty}>
                    <Text style={styles.modalEmptyText}>No se encontraron artículos.</Text>
                  </Box>
                }
                keyboardShouldPersistTaps="handled"
              />
            </SafeAreaView>
          </Modal>

          {/* SECCIÓN: Cantidad */}
          <Box style={[styles.sectionCard, !qty && styles.sectionError]}>
            <Text style={styles.sectionLabel}>Cantidad</Text>
            <Input
              placeholder="Ingrese cantidad"
              placeholderTextColor="#999"
              value={qty}
              onChangeText={setQty}
              keyboardType="numeric"
              style={styles.textInput}
            />
          </Box>

          {/* SECCIÓN: Foto */}
          <Box style={[styles.sectionCard, !photo && styles.sectionError]}>
            <Text style={styles.sectionLabel}>Foto del producto</Text>
            {photo ? (
              <Image source={{ uri: photo.uri }} style={styles.photoPreview} />
            ) : (
              <Box style={styles.photoPlaceholder}>
                <Text style={styles.photoPlaceholderText}>Sin foto</Text>
              </Box>
            )}
            <Box style={styles.photoButtonWrapper}>
              <Button onPress={takePhoto} bg={colors.dark} _text={{ color: colors.white }}>
                Tomar Foto
              </Button>
            </Box>
          </Box>

          {/* Botón Guardar */}
          <Box style={styles.saveButtonWrapper}>
            <Button onPress={handleSave} bg={colors.dark} _text={{ color: colors.white }}>
              Guardar
            </Button>
          </Box>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

