
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchClients = createAsyncThunk('clients/fetch', async (token) => {
  const { data } = await axios.get('https://dicsapps.space:3005/api/clients', {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
});

const clientsSlice = createSlice({
  name: 'clients',
  initialState: {
    list: [],
    status: 'idle',
    error: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchClients.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default clientsSlice.reducer;
