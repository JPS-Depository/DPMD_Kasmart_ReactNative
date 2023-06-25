import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export const getKelurahanDesa = createAsyncThunk("kelurahandesa/getKelurahanDesa", async (kecamatan_id) => {
  const token = await SecureStore.getItemAsync('access_token');
  const response = await axios({
    method: 'get',
    url: 'https://dpmd-bengkalis.com/api/kelurahan',
    headers: {
      'Authorization': `Bearer ${token}`
    },
    params: { kecamatan_id: kecamatan_id }
  })
  return response.data.kelurahan;
})

const kelurahanEntity = createEntityAdapter({
  selectId: (keldes) => keldes.id
})

export const kelurahanDesaSlice = createSlice({
  name: 'kelurahandesa',
  initialState: kelurahanEntity.getInitialState(),
  extraReducers: {
    [getKelurahanDesa.fulfilled]: (state, action) => {
      kelurahanEntity.setAll(state, action.payload);
    }
  }
});

export const kelurahanSelector = kelurahanEntity.getSelectors(state => state.kelurahandesa);
export default kelurahanDesaSlice.reducer