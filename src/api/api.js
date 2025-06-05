
import axios from 'axios';
import { store } from '../store';
import { addPendingRequest } from '../slices/queueSlice';
import { BASE_URL } from '../config';

const api = axios.create({ baseURL: BASE_URL });

api.interceptors.request.use(config => {
  const token = store.getState().auth.token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const uploadData = async ({ codcliente, cod_articulo, qty, photo }) => {
  const isConnected = store.getState().queue.isConnected;
  if (!isConnected) {
    store.dispatch(addPendingRequest({
      codcliente,
      cod_articulo,
      qty,
      photoUri: photo.uri,
      photoName: photo.name,
      photoType: photo.type
    }));
    return { queued: true };
  }
  const formData = new FormData();
  formData.append('codcliente', codcliente);
  formData.append('cod_articulo', cod_articulo);
  formData.append('qty', qty.toString());
  formData.append('photo', photo);
  await api.post('/records', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return { queued: false };
};
