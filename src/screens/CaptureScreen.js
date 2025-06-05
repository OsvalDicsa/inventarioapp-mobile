// src/screens/CaptureScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  Image,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  SafeAreaView,
  Platform,
  TouchableOpacity,
  Modal,
  FlatList
} from 'react-native';
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

          {/* Modal para buscar y seleccionar artículo */}
          <Modal
            visible={modalVisible}
            animationType="slide"
            transparent={false}
            onRequestClose={() => setModalVisible(false)}
          >
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

          {/* SECCIÓN: Cantidad */}
          <View style={[styles.sectionCard, !qty && styles.sectionError]}>
            <Text style={styles.sectionLabel}>Cantidad</Text>
            <TextInput
              placeholder="Ingrese cantidad"
              placeholderTextColor="#999"
              value={qty}
              onChangeText={setQty}
              keyboardType="numeric"
              style={styles.textInput}
            />
          </View>

          {/* SECCIÓN: Foto */}
          <View style={[styles.sectionCard, !photo && styles.sectionError]}>
            <Text style={styles.sectionLabel}>Foto del producto</Text>
            {photo ? (
              <Image source={{ uri: photo.uri }} style={styles.photoPreview} />
            ) : (
              <View style={styles.photoPlaceholder}>
                <Text style={styles.photoPlaceholderText}>Sin foto</Text>
              </View>
            )}
            <View style={styles.photoButtonWrapper}>
              <Button title="Tomar Foto" onPress={takePhoto} color="#333" />
            </View>
          </View>

          {/* Botón Guardar */}
          <View style={styles.saveButtonWrapper}>
            <Button title="Guardar" onPress={handleSave} color="#1f2937" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f3f4f6'
  },
  flex: {
    flex: 1
  },
  container: {
    padding: 16,
    paddingBottom: 32
  },
  headerContainer: {
    marginBottom: 24
  },
  headerText: {
    fontSize: 16,
    color: '#4b5563'
  },
  clientName: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1f2937',
    marginTop: 4
  },

  // Dropdown “artículo”
  sectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#e5e7eb'
  },
  sectionError: {
    borderColor: '#dc2626'
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8
  },
  dropdownInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fafafa'
  },
  dropdownText: {
    fontSize: 15,
    color: '#111827'
  },
  dropdownPlaceholder: {
    fontSize: 15,
    color: '#999'
  },

  // Modal
  modalContainer: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1f2937'
  },
  modalCloseButton: {
    padding: 8
  },
  modalCloseText: {
    fontSize: 16,
    color: '#2563eb'
  },
  modalSearchInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    margin: 16,
    paddingVertical: 8,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#fafafa',
    color: '#111827'
  },
  articuloItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb'
  },
  articuloText: {
    fontSize: 16,
    color: '#111827'
  },
  modalEmpty: {
    marginTop: 32,
    alignItems: 'center'
  },
  modalEmptyText: {
    fontSize: 16,
    color: '#6b7280'
  },

  // Resto del formulario
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 15,
    backgroundColor: '#fafafa',
    color: '#111827'
  },
  photoPreview: {
    width: '100%',
    height: 200,
    borderRadius: 6,
    marginBottom: 12,
    backgroundColor: '#e5e7eb'
  },
  photoPlaceholder: {
    width: '100%',
    height: 200,
    borderRadius: 6,
    marginBottom: 12,
    backgroundColor: '#e5e7eb',
    justifyContent: 'center',
    alignItems: 'center'
  },
  photoPlaceholderText: {
    color: '#6b7280',
    fontSize: 16
  },
  photoButtonWrapper: {
    width: '50%',
    alignSelf: 'flex-start'
  },
  saveButtonWrapper: {
    marginTop: 10,
    marginHorizontal: 40
  }
});
