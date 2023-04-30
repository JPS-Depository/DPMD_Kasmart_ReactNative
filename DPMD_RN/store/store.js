import { configureStore } from "@reduxjs/toolkit";
import userReducer from '../features/userSlice';
import kecamatanReducer from '../features/kecamatanSlice';
import kelurahanDesaReducer from "../features/kelurahanDesaSlice";
import kegiatanReducer from "../features/kegiatanSlice";
import absensiReducer from "../features/absensiSlice";
import harianReducer from "../features/harianSlice";
import anggotaReducer from '../features/anggotaSlice';
import visumReducer from '../features/visumSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    kecamatan: kecamatanReducer,
    kelurahandesa: kelurahanDesaReducer,
    kegiatan: kegiatanReducer,
    absensi: absensiReducer,
    harian: harianReducer,
    anggota: anggotaReducer,
    visum: visumReducer
  },
})