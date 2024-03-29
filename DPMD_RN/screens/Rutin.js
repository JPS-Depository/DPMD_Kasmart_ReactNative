import { StyleSheet, ScrollView, View, ToastAndroid } from "react-native";
import {
  Select,
  SelectItem,
  useStyleSheet,
  Input,
  Button, Text, Spinner
} from '@ui-kitten/components';
import { useCallback, useState } from "react";
import { getKegiatan, kegiatanSelector } from "../features/kegiatanSlice";
import { useDispatch, useSelector } from "react-redux";
import { StackActions, useFocusEffect } from "@react-navigation/native";
import * as Location from 'expo-location';
import * as ImagePicker from 'expo-image-picker';
import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
import queryString from 'querystring';
import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import moment from "moment/moment";
import * as Camera from "expo-camera";

export default function RutinScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [kegiatan, setKegiatan] = useState('');
  const [location, setLocation] = useState({});
  const styles = useStyleSheet(themedStyles);
  const [image, setImage] = useState('');
  const [imageName, setImageName] = useState('Silahkan ambil Foto');
  const dispatch = useDispatch();

  const kegiatanData = useSelector(kegiatanSelector.selectAll);
  const { username, kecamatantugas_id } = useSelector(state => state.user);

  const showToast = (text) => {
    ToastAndroid.show(text, ToastAndroid.CENTER, ToastAndroid.BOTTOM, ToastAndroid.SHORT);
  }

  useFocusEffect(
    useCallback(() => {
      dispatch(getKegiatan(
        {
          kecamatantugas_id: kecamatantugas_id,
          jenis: 1,
          visum: true
        }));
      getCurrentLocation();
    }, [dispatch])
  );

  const getCamera = async () => {
    try {
      setLoading(true);
      let { status: audioStatus } = await Camera.requestMicrophonePermissionsAsync();
      let { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      if (audioStatus == 'granted' && cameraStatus == 'granted') {
        let result = await ImagePicker.launchCameraAsync();
        await compress(result.assets[0].uri);
        setImageName('Foto telah diambil');
      } else {
        showToast('Izinkan aplikasi menggunakan kamera');
      }
    } catch (error) {
      setImage('');
      setImageName('Silahkan ambil foto');
    } finally {
      setLoading(false);
    }
  }

  const compress = async (gambar) => {
    try {
      const manipResult = await manipulateAsync(
        gambar, [],
        { compress: 0.2, format: SaveFormat.JPEG, base64: true }
      );
      setImage(manipResult.base64);
    } catch (error) {
      console.log(error);
      setImage('');
      setImageName('Silahkan ambil foto');
    }
  };

  async function getCurrentLocation() {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status == 'granted') {
        let currentLocation = await Location.getCurrentPositionAsync();
        setLocation({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude
        });
      }
    } catch (error) {
      showToast('Gagal Mendapatkan Lokasi');
    }
  }

  const inputAbsensi = async () => {
    try {
      getCurrentLocation();
      const tanggal = new Date();
      const formattedDate = moment(tanggal).format('YYYY-MM-DD');
      const token = await SecureStore.getItemAsync('access_token');
      const response = await axios({
        method: 'post',
        url: 'https://dpmd-bengkalis.com/api/inputvisum',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        data: queryString.stringify(
          {
            'tanggal': formattedDate,
            'kegiatan_id': kegiatan.id,
            'hasil_kegiatan': multilineInputState.multi,
            'image': image,
            'created_by': username,
            'latitude': location.latitude,
            'longitude': location.longitude
          }
        )
      })
      navigation.dispatch(StackActions.replace('Home'));
    } catch (error) {
      showToast(error.response.data.message);
    } finally {
      setLoading(false);
    }
  }

  const useInputState = (initialValue = '') => {
    const [multi, setMulti] = useState(initialValue);
    return { multi: multi, onchangeText: setMulti };
  }

  const multilineInputState = useInputState();

  return (
    <View
      style={{ flex: 1 }}
    >
      <ScrollView
        style={styles.container}
      >
        {
          kegiatanData.length > 0 ? <Select
            label={() => <Text style={styles.label}>Kegiatan</Text>}
            caption={() => <Text style={styles.caption}>Silahkan pilih kegiatan</Text>}
            placeholder="Kegiatan"
            value={kegiatan.kegiatan}
            onSelect={index => setKegiatan(kegiatanData[index.row])}
          >
            {
              kegiatanData.map(kegiatan => {
                return (
                  <SelectItem title={kegiatan.kegiatan} key={kegiatan.id} />
                )
              })
            }
          </Select> :
            <Select
              label={() => <Text style={styles.label}>Kegiatan</Text>}
              caption={() => <Text style={styles.caption}>Silahkan pilih kegiatan</Text>}
              placeholder="Belum ada kegiatan"
              disabled={true}
            >
            </Select>
        }
        <View style={{ flex: 1, flexDirection: 'column', marginTop: 20 }}>
          <Text
            style={styles.headerDetail}
          >Keterangan Kegiatan</Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={styles.infoKegiatan}>Lokasi Kegiatan : </Text>
            <Text style={styles.infoKegiatan}>{kegiatan ? kegiatan.alamat_kegiatan : 'Pilih kegiatan'}</Text>
          </View>
          <View style={{ flexDirection: 'row', marginBottom: 5 }}>
            <Text style={styles.infoKegiatan}>Tanggal Kegiatan : </Text>
            <Text style={styles.infoKegiatan}>{kegiatan ? moment(kegiatan.tanggal_kegiatan).format('DD-MM-YYYY') : 'Pilih kegiatan'}</Text>
          </View>
          <Text style={styles.infoKegiatan}>Detil Kegiatan : </Text>
          <Text style={styles.infoKegiatan}>{kegiatan ? kegiatan.detil_kegiatan : 'Pilih kegiatan'}</Text>
        </View>
        <Input
          multiline={true}
          label={() => <Text style={styles.label}>Detil Visum</Text>}
          placeholder='Masukkan keterangan yang ingin anda sampaikan'
          style={styles.formInput}
          textStyle={{ minHeight: 64 }}
          {...multilineInputState}
          onChangeText={text => {
            multilineInputState.onchangeText(text);
          }}
        />
        {
          loading ?
            <View
              style={{ flex: 1, alignItems: 'center', marginVertical: 10 }}
            >
              <Spinner />
            </View> :
            <Text
              style={styles.takePicture}
            >{imageName}</Text>
        }
        <Button
          onPress={getCamera}
        > Ambil Foto
        </Button>
        <Button
          style={styles.submit}
          onPress={inputAbsensi}
          disabled={loading || kegiatanData.length == 0 ? true : false}
        >Submit Visum</Button>
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
    marginVertical: 20,
    marginBottom: 40
  }, radio: {
    margin: 2,
    color: 'color-primary-900',
  }, radioGroup: {
    marginTop: 20,
    flex: 1,
    flexDirection: 'row'
  }, infoKegiatan: {
    fontSize: 13,
    color: 'color-primary-800'
  }, headerDetail: {
    fontSize: 13,
    fontWeight: 'bold',
    color: 'color-primary-900'
  }, takePicture: {
    marginTop: 20,
    fontSize: 15,
    textAlign: 'center',
    color: 'color-primary-800'
  }
});