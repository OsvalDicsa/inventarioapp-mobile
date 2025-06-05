// src/slices/queueSlice.js
import { createSlice, nanoid } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../config';

// Creamos el slice "queue"
const queueSlice = createSlice({
  name: 'queue',
  initialState: {
    pending: [],      // Array de peticiones pendientes
    isConnected: true // Bandera de conexión
  },
  reducers: {
    setConnection(state, action) {
      state.isConnected = action.payload;
    },
    addPendingRequest: {
      reducer(state, action) {
        state.pending.push(action.payload);
      },
      prepare(payload) {
        // payload debería ser un objeto con { codcliente, cod_articulo, qty, photoUri, photoName, photoType }
        return { payload: { id: nanoid(), ...payload } };
      }
    },
    removePendingRequest(state, action) {
      state.pending = state.pending.filter((req) => req.id !== action.payload);
    }
  }
});

// Exportamos las acciones normales
export const { setConnection, addPendingRequest, removePendingRequest } = queueSlice.actions;

// Thunk para vaciar la cola (flushQueue)
// NOTA: Usamos getState en lugar de importar store directamente.
export const flushQueue = () => async (dispatch, getState) => {
  const state = getState();
  const token = state.auth?.token;         // Asumimos que tenés un slice "auth" con token
  const pending = state.queue.pending;
  const isConnected = state.queue.isConnected;

  if (!isConnected || !token || pending.length === 0) {
    return;
  }

  // Creamos instancia de axios con el token
  const api = axios.create({
    baseURL: BASE_URL,
    headers: { Authorization: `Bearer ${token}` }
  });

  for (const item of pending) {
    try {
      const formData = new FormData();
      formData.append('codcliente', item.codcliente);
      formData.append('cod_articulo', item.cod_articulo);
      formData.append('qty', item.qty.toString());
      formData.append('photo', {
        uri: item.photoUri,
        name: item.photoName,
        type: item.photoType
      });

      // Enviamos cada petición al endpoint /records
      await api.post('/records', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      // Si fue exitosa, removemos de la cola
      dispatch(removePendingRequest(item.id));
    } catch (err) {
      console.log('Error enviando item de la cola, se reintentará más tarde:', err.message);
      // Si falla uno, detenemos el loop y esperamos a reintentar luego
      break;
    }
  }
};

export default queueSlice.reducer;
