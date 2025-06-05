import queueReducer, { addPendingRequest } from '../src/slices/queueSlice';

describe('queueSlice', () => {
  it('adds a pending request with an id', () => {
    const initialState = { pending: [], isConnected: true };
    const action = addPendingRequest({ codcliente: '1', cod_articulo: 'A', qty: 1, photoUri: 'uri', photoName: 'n', photoType: 't' });
    const state = queueReducer(initialState, action);
    expect(state.pending).toHaveLength(1);
    expect(state.pending[0]).toHaveProperty('id');
  });
});
