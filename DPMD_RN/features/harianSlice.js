import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export const getHarian = createAsyncThunk("harian/getHarian", async (kecamatantugas_id) => {
  const token = await SecureStore.getItemAsync('access_token');
  const response = await axios({
    method: 'get',
    url: 'https://dpmd-bengkalis.com/api/daftarharian',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    params: { kecamatantugas_id: kecamatantugas_id }
  })
  return response.data.data.harian;
})

const harianEntity = createEntityAdapter({
  selectId: (harian) => harian.id
})

export const harianSlice = createSlice({
  name: 'harian',
  initialState: harianEntity.getInitialState(),
  extraReducers: {
    [getHarian.fulfilled]: (state, action) => {
      harianEntity.setAll(state, action.payload);
    }
  }
});

export const harianSelector = harianEntity.getSelectors(state => state.harian);
export default harianSlice.reducer