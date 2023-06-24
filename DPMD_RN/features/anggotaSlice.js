import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export const getAnggota = createAsyncThunk("anggota/getAnggota", async (params) => {
  try {
    const token = await SecureStore.getItemAsync('access_token');
    const response = await axios({
      method: 'get',
      url: 'http://10.0.2.2:8000/api/getPendamping',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      params: { kecamatantugas_id: params.kecamatan_id, role: params.role }
    });
    return response.data;
  } catch (error) {
  }
})

const anggotaEntity = createEntityAdapter({
  selectId: (anggota) => anggota.id
})

export const anggotaSlice = createSlice({
  name: 'anggota',
  initialState: anggotaEntity.getInitialState(),
  extraReducers: {
    [getAnggota.fulfilled]: (state, action) => {
      anggotaEntity.setAll(state, action.payload.pendampings);
    }
  }
});

export const anggotaSelector = anggotaEntity.getSelectors(state => state.anggota);
export default anggotaSlice.reducer