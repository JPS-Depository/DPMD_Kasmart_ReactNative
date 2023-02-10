import { createSlice, createAsyncThunk, createEntityAdapter } from "@reduxjs/toolkit";

const userEntity = createEntityAdapter({
  selectId: (user) => user.id
})

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    id: '',
    username: '',
    fullname: '',
    noreg: '',
    bidang: '',
    tambah_poin: ''
  },
  reducers: {
    update: (state, action) => {
      state.id = action.payload.id
      state.username = action.payload.username
      state.fullname = action.payload.fullname
      state.noreg = action.payload.noreg
      state.bidang = action.payload.bidang
      state.tambah_poin = action.payload.tambah_poin
    }
  }
});

export const { update } = userSlice.actions
export default userSlice.reducer