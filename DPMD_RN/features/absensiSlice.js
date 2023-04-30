import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export const getAbsensi = createAsyncThunk("absensi/getKegiatan", async (kegiatan_id) => {
  const token = await SecureStore.getItemAsync('access_token');
  const response = await axios({
    method: 'get',
    url: 'https://dpmd-bengkalis.com/api/absensi',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    params: { kegiatan_id: kegiatan_id }
  })
  return response.data.data.absensi;
})

const absensiEntity = createEntityAdapter({
  selectId: (absensi) => absensi.id
})

export const absensiSlice = createSlice({
  name: 'absensi',
  initialState: absensiEntity.getInitialState(),
  extraReducers: {
    [getAbsensi.fulfilled]: (state, action) => {
      absensiEntity.setAll(state, action.payload);
    }
  }
});

export const absensiSelector = absensiEntity.getSelectors(state => state.absensi);
export default absensiSlice.reducer