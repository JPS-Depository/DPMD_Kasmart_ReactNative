import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../features/userSlice';
import kecamatanReducer from '../features/kecamatanSlice';
import kelurahanDesaReducer from "../features/kelurahanDesaSlice";
import kegiatanReducer from "../features/kegiatanSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    kecamatan: kecamatanReducer,
    kelurahandesa: kelurahanDesaReducer,
    kegiatan: kegiatanReducer
  },
})