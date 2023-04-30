import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";

const userEntity = createEntityAdapter({
  selectId: (user) => user.id
})

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    id: '',
    username: '',
    role: '',
    fullname: '',
    noreg: '',
    bidang: '',
    jabatan: '',
    tambah_poin: '',
    kecamatantugas_id: '',
    daily_point: 0,
    activities_point: 0,
  },
  reducers: {
    inputIdUsername: (state, action) => {
      return {
        ...state,
        id: action.payload.id,
        role: action.payload.role,
        username: action.payload.username
      }
    },
    inputOther: (state, action) => {
      return {
        ...state,
        fullname: action.payload.fullname,
        noreg: action.payload.noreg,
        bidang: action.payload.bidang,
        tambah_poin: action.payload.tambah_poin,
        kecamatantugas_id: action.payload.kecamatantugas_id,
        jabatan: action.payload.jabatan,
        daily_point: action.payload.daily_point,
        activities_point: action.payload.activities_point
      }
    }
  }
});

export const { inputIdUsername, inputOther } = userSlice.actions
export default userSlice.reducer