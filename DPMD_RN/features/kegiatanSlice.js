import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export const getKegiatan = createAsyncThunk("kegiatan/getKegiatan", async (parameter) => {
  const token = await SecureStore.getItemAsync('access_token');
  try {
    let params = {
      kecamatantugas_id: parameter.kecamatantugas_id,
    }
    if (parameter.role_id) {
      params.role = parameter.role_id
    }
    if (parameter.jenis) {
      params.jenis = parameter.jenis
    }
    if (parameter.visum) {
      params.visum = parameter.visum
    }
    const response = await axios({
      method: 'get',
      url: 'https://dpmd-bengkalis.com/api/kegiatan',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      params: params
    })
    console.log(response.data);
    return response.data
  } catch (error) {
  }
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