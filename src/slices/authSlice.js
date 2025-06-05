
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { isJwtExpired } from '../utils/jwt';

const API = axios.create({ baseURL: API_BASE_URL });

export const login = createAsyncThunk('auth/login', async ({ username, password }) => {
  const { data } = await API.post('/auth/login', { username, password });
  return data.token;
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    token: null,
    status: 'idle',
    error: null
  },
  reducers: {
    logout(state) {
      state.token = null;
    }
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        if (isJwtExpired(action.payload)) {
          state.error = 'Token expirado';
          state.token = null;
        } else {
          state.token = action.payload;
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
