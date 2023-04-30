import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export const getVisum = createAsyncThunk("visum/getVisum", async (kegiatan_id) => {
  const token = await SecureStore.getItemAsync('access_token');
  const response = await axios({
    method: 'get',
    url: 'https://dpmd-bengkalis.com/api/visum',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Accept': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    params: { kegiatan_id: kegiatan_id }
  })
  return response.data.visum;
})

const visumEntity = createEntityAdapter({
  selectId: (visum) => visum.id
})

export const visumSlice = createSlice({
  name: 'kecamatan',
  initialState: visumEntity.getInitialState(),
  extraReducers: {
    [getVisum.fulfilled]: (state, action) => {
      visumEntity.setAll(state, action.payload);
    }
  }
});

export const visumSelector = visumEntity.getSelectors(state => state.visum);
export default visumSlice.reducer