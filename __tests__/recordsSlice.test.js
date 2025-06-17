jest.mock('../src/api/api', () => ({}));
import recordsReducer, { fetchRecords } from '../src/slices/recordsSlice';

describe('recordsSlice reducer', () => {
  it('handles fetchRecords.fulfilled', () => {
    const initialState = { list: [], status: 'idle', error: null };
    const action = { type: fetchRecords.fulfilled.type, payload: [{ id: 1 }] };
    const state = recordsReducer(initialState, action);
    expect(state.status).toBe('succeeded');
    expect(state.list).toHaveLength(1);
  });
});
