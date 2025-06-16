
import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from './slices/authSlice';
import queueReducer from './slices/queueSlice';
import clientsReducer from './slices/clientsSlice';
import articulosReducer from './slices/articulosSlice';
import recordsReducer from './slices/recordsSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  queue: queueReducer,
  clients: clientsReducer,
  articulos: articulosReducer,
  records: recordsReducer,
});

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth', 'queue', 'clients', 'articulos', 'records']
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
