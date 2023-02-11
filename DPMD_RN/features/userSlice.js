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
    inputIdUsername: (state, action) => {
      return {
        ...state,
        id: action.payload.id,
        username: action.payload.username
      }
    },
    inputOther: (state, action) => {
      return {
        ...state,
        fullname: action.payload.fullname,
        noreg: action.payload.noreg,
        bidang: action.payload.bidang,
        tambah_poin: action.payload.tambah_poin
      }
    }
  }
});

export const { inputIdUsername, inputOther } = userSlice.actions
export default userSlice.reducer