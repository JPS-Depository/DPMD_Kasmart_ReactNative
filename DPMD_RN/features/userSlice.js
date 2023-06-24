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
    avatar: '',
    absen: '',
    harian: ''
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
        absen: action.payload.absen,
        harian: action.payload.harian,
        avatar: action.payload.avatar,
      }
    }
  }
});

export const { inputIdUsername, inputOther } = userSlice.actions
export default userSlice.reducer