import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fetchRecords as fetchRecordsApi, updateRecordApi, deleteRecordApi } from '../api/api';

export const fetchRecords = createAsyncThunk('records/fetch', async () => {
  const data = await fetchRecordsApi();
  return data;
});

export const updateRecord = createAsyncThunk(
  'records/update',
  async (payload, { dispatch }) => {
    await updateRecordApi(payload);
    dispatch(fetchRecords());
  }
);

export const deleteRecord = createAsyncThunk(
  'records/delete',
  async (id, { dispatch }) => {
    await deleteRecordApi(id);
    dispatch(fetchRecords());
  }
);

const recordsSlice = createSlice({
  name: 'records',
  initialState: { list: [], status: 'idle', error: null },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchRecords.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchRecords.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchRecords.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  }
});

export default recordsSlice.reducer;
