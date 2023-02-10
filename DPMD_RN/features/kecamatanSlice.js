import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export const getKecamatan = createAsyncThunk("kecamatan/getKecamatan", async () => {
  const token = await SecureStore.getItemAsync('access_token');
  const response = await axios({
    method: 'get',
    url: 'http://10.0.2.2:8000/api/kecamatan',
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  return response.data.data.kecamatan;
})

const kecamatanEntity = createEntityAdapter({
  selectId: (kecamatan) => kecamatan.id
})

export const kecamatanSlice = createSlice({
  name: 'kecamatan',
  initialState: kecamatanEntity.getInitialState(),
  extraReducers: {
    [getKecamatan.fulfilled]: (state, action) => {
      kecamatanEntity.setAll(state, action.payload);
    }
  }
});

export const kecamatanSelector = kecamatanEntity.getSelectors(state => state.kecamatan);
export default kecamatanSlice.reducer