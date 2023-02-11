import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";
import axios from 'axios';

export const getKegiatan = createAsyncThunk("kegiatan/getKegiatan", async () => {
  const response = await axios({
    method: 'get',
    url: 'http://10.0.2.2:8000/api/kegiatan'
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
      console.log(action.payload, "<<<<<");
      kegiatanEntity.setAll(state, action.payload);
    }
  }
});

export const kegiatanSelector = kegiatanEntity.getSelectors(state => state.kegiatan);
export default kegiatanSlice.reducer