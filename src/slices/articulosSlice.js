
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BASE_URL } from '../config';

export const fetchArticulos = createAsyncThunk('articulos/fetch', async (token) => {
  const { data } = await axios.get(`${BASE_URL}/articulos`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
});

const articulosSlice = createSlice({
  name: 'articulos',
  initialState: {
    list: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchArticulos.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchArticulos.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchArticulos.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default articulosSlice.reducer;
