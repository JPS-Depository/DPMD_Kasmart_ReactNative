import { Text, StyleSheet, ScrollView, View, ToastAndroid } from "react-native";
import {
  Select,
  SelectItem,
  useStyleSheet,
  Input,
  Datepicker,
  Button,
  Spinner
} from '@ui-kitten/components';
import { useCallback, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getKecamatan, kecamatanSelector } from "../features/kecamatanSlice";
import { StackActions, useFocusEffect } from "@react-navigation/native";
import { getKelurahanDesa, kelurahanSelector } from "../features/kelurahanDesaSlice";
import queryString from 'querystring';
import moment from "moment";
import { useEffect } from "react";

export default function KegiatanScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const styles = useStyleSheet(themedStyles);
  const dispatch = useDispatch();

  const [namaKegiatan, setNamaKegiatan] = useState('');
  const [lokasiKegiatan, setLokasiKegiatan] = useState('');
  const [sasaranKegiatan, setSasaranKegiatan] = useState('');
  const [jangkaKegiatan, setJangkaKegiatan] = useState('');
  const [jenisKegiatan, setJenisKegiatan] = useState('');
  const [kecamatan, setKecamatan] = useState('');
  const [kabupaten, setKabupaten] = useState('');
  const [keldes, setKeldes] = useState('');
  const [status, setStatus] = useState('');
  const [indikator, setIndikator] = useState('-');
  const [date, setDate] = useState(new Date());
  const jenisKegiatanData = ['Rutin', 'Harian', 'Pemberdayaan', 'Pembangunan'];
  const kabupatenData = ['Bengkalis'];
  const statusData = ['Dalam Proses', 'Terealisasi', 'Belum Terealisasi'];
  const indikatorData = [
    'Pelayanan Publik Berbasis Teknologi',
    'Pemberdayaan Ekonomi dan Keterlibatan Perempuan Desa',
    'Infrastruktur dan Inovasi Desa Sesuai Kebutuhan',
    'Tata Kelola Keuangan Desa dan Informasi Publik',
    'Desa Peduli Lingkungan',
    'Membangun Desa dengan kemitraan',
    'Optimaliasi Peran Anak, Remaja, dan Pemuda / Pemudi Desa Dalam Kelembagaan Desa yang Dinamis dan Budaya Desa Adaptif',
    'Kegiatan Bersifat Strategis Desa'
  ]
  const kecamatanData = useSelector(kecamatanSelector.selectAll);
  const keldesData = useSelector(kelurahanSelector.selectAll);

  const useInputState = (initialValue = '') => {
    const [multi, setMulti] = useState(initialValue);
    return { multi: multi, onchangeText: setMulti };
  }

  const multilineInputState = useInputState();

  const showToast = (notice) => {
    ToastAndroid.show(notice, ToastAndroid.CENTER, ToastAndroid.BOTTOM, ToastAndroid.SHORT);
  }

  const { username } = useSelector(state => state.user);

  async function submitKegiatan() {
    try {
      const tanggal = new Date(date);
      const formattedDate = moment(tanggal).format('YYYY-MM-DD');
      const response = await axios({
        method: 'post',
        url: 'https://dpmd-bengkalis.com/api/inputkegiatan',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        data: queryString.stringify(
          {
            'jenis': jenisKegiatan,
            'kegiatan': namaKegiatan,
            'alamat_kegiatan': lokasiKegiatan,
            'kelurahan_id': keldes.id,
            'kecamatan_id': kecamatan.id,
            'kabupaten_id': 1,
            'tanggal_kegiatan': formattedDate,
            'sasaran': sasaranKegiatan,
            'detil_kegiatan': multilineInputState.multi,
            'status': status,
            'indikator': indikator,
            'jangka_waktu': jangkaKegiatan,
            'created_by': username
          })
      })
      navigation.dispatch(StackActions.replace('Home'));
    } catch (error) {
      console.log(error.response)
      showToast(error.response.data.message);
      setLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      dispatch(getKecamatan())
        .then(result => {
          setLoading(false);
        });
    }, [])
  );

  useEffect(() => {
    dispatch(getKelurahanDesa(kecamatan.id));
  }, [kecamatan])


  return (
    <View
      style={{ flex: 1 }}
    >
      <ScrollView
        style={styles.container}
      >
        <Select
          label={() => <Text style={styles.label}>Jenis Kegiatan</Text>}
          caption={() => <Text style={styles.caption}>Silahkan pilih kegiatan</Text>}
          placeholder="Pilih Jenis Kegiatan"
          value={jenisKegiatan}
          onSelect={index => setJenisKegiatan(jenisKegiatanData[index.row])}
        >
          {
            jenisKegiatanData.map((title, index) => {
              return (
                <SelectItem title={title} key={index} />
              )
            })
          }
        </Select>
        <Input
          value={namaKegiatan}
          label={() => <Text style={styles.label}>Nama Kegiatan</Text>}
          placeholder='Silahkan input Nama Kegiatan Anda'
          onChangeText={nextValue => setNamaKegiatan(nextValue)}
          style={styles.formInput}
        />
        <Input
          value={lokasiKegiatan}
          label={() => <Text style={styles.label}>Alamat Kegiatan</Text>}
          placeholder='Silahkan Lokasi Kegiatan Anda'
          onChangeText={nextValue => setLokasiKegiatan(nextValue)}
          style={styles.formInput}
        />
        <Select
          label={() => <Text style={styles.label}>Kabupaten</Text>}
          style={styles.formInput}
          placeholder="Kabupaten"
          onSelect={index => setKabupaten(kabupatenData[index.row])}
          value={kabupaten}
        >
          {kabupatenData.map((title, index) => <SelectItem title={title} key={index} />)}
        </Select>
        <Select
          label={() => <Text style={styles.label}>Kecamatan</Text>}
          style={styles.formInput}
          placeholder="Kecamatan"
          value={kecamatan.nama}
          onSelect={index => setKecamatan(kecamatanData[index.row])}
        >
          {
            kecamatanData.map(kecamatan => {
              return (
                <SelectItem title={kecamatan.nama} key={kecamatan.id} />
              )
            })
          }
        </Select>
        <Select
          label={() => <Text style={styles.label}>Kelurahan / Desa</Text>}
          style={styles.formInput}
          value={keldes.nama}
          placeholder="Kelurahan"
          onSelect={index => setKeldes(keldesData[index.row])}
        >
          {
            keldesData.map(keldes => {
              return (
                <SelectItem title={keldes.nama} key={keldes.id} />
              )
            })
          }
        </Select>
        <Datepicker
          label={() => <Text style={styles.label}>Tanggal Kegiatan</Text>}
          caption={() => <Text style={styles.caption}>Pilih Tanggal pelaksanaan yang dijadwalkan</Text>}
          date={date}
          onSelect={nextDate => setDate(nextDate)}
          style={styles.formInput}
        />
        <Input
          value={sasaranKegiatan}
          label={() => <Text style={styles.label}>Sasaran Kegiatan</Text>}
          onChangeText={nextValue => setSasaranKegiatan(nextValue)}
          style={styles.formInput}
        />
        <Input
          multiline={true}
          label={() => <Text style={styles.label}>Detil Kegiatan</Text>}
          placeholder='Deskripsikan detil Kegiatan Anda'
          style={styles.formInput}
          textStyle={{ minHeight: 64 }}
          {...multilineInputState}
          onChangeText={text => {
            multilineInputState.onchangeText(text);
          }}
        />
        <Select
          value={statusData[status]}
          label={() => <Text style={styles.label}>Status Kegiatan</Text>}
          style={styles.formInput}
          placeholder='Pilih Status Kegiatan'
          onSelect={index => setStatus(index.row)}
        >
          {
            statusData.map((status, index) => {
              return (
                <SelectItem title={status} key={index} />
              )
            })
          }
        </Select>
        <Select
          label={() => <Text style={styles.label}>Indikator Kegiatan</Text>}
          style={styles.formInput}
          value={jenisKegiatan == 'Pembangunan' || jenisKegiatan == 'Pemberdayaan' ? indikator : '-'}
          disabled={jenisKegiatan == 'Pembangunan' || jenisKegiatan == 'Pemberdayaan' ? false : true}
          placeholder='Pilih Indikator Kegiatan'
          caption={() => <Text style={styles.caption}>Hanya untuk Jenis Kegiatan Pembangunan / Pemberdayaan</Text>}
          onSelect={index => setIndikator(indikatorData[index.row])}
        >
          {
            indikatorData.map((indikator, index) => {
              return (
                <SelectItem title={indikator} key={index} />
              )
            })
          }
        </Select>
        <Input
          value={jenisKegiatan == 'Pembangunan' || jenisKegiatan == 'Pemberdayaan' ? jangkaKegiatan : 1}
          disabled={jenisKegiatan == 'Pembangunan' || jenisKegiatan == 'Pemberdayaan' ? false : true}
          label={() => <Text style={styles.label}>Jangka Waktu Kegiatan</Text>}
          keyboardType='numeric'
          placeholder='Jangka Waktu Kegiatan ( Hari )'
          caption={() => <Text style={styles.caption}>Hanya untuk Jenis Kegiatan Pembangunan / Pemberdayaan</Text>}
          onChangeText={nextValue => setJangkaKegiatan(nextValue)}
          style={styles.formInput}
        />
        <Button
          style={styles.submit}
          onPress={submitKegiatan}
          disabled={loading ? true : false}
        >Submit</Button>
      </ScrollView >
    </View >
  )
}

const themedStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'color-primary-200',
    height: '100%',
    padding: 15,
    flexGrow: 1
  }, formInput: {
    marginTop: 20,
  }, label: {
    marginBottom: 3,
    color: 'color-primary-900',
    fontWeight: 'bold',
    fontSize: 12
  }, caption: {
    color: 'color-primary-900',
    fontSize: 12
  }, submit: {
    marginBottom: 40,
    marginTop: 20
  }
});