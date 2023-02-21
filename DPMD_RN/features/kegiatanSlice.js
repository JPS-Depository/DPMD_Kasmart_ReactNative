import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export const getKegiatan = createAsyncThunk("kegiatan/getKegiatan", async (kecamatantugas_id) => {
  const token = await SecureStore.getItemAsync('access_token');
  const response = await axios({
    method: 'get',
    url: 'https://dpmd-bengkalis.com/api/kegiatan',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    params: { kecamatantugas_id: kecamatantugas_id }
  })
  return response.data;
})

const kegiatanEntity = createEntityAdapter({
  selectId: (kegiatan) => kegiatan.id
})

export const kegiatanSlice = createSlice({
  name: 'kegiatan',
  initialState: kegiatanEntity.getInitialState(),
  extraReducers: {
    [getKegiatan.fulfilled]: (state, action) => {
      kegiatanEntity.setAll(state, action.payload.kegiatan);
    }
  }
});

export const kegiatanSelector = kegiatanEntity.getSelectors(state => state.kegiatan);
export default kegiatanSlice.reducer