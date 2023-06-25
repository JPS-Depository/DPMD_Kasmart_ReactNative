import { StyleSheet, ScrollView, View, ToastAndroid, TouchableOpacity, Image } from "react-native";
import {
  Select,
  SelectItem,
  useStyleSheet,
  Input,
  Button, Text, Spinner, Card
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
  const [pembangunan, setPembangunan] = useState([]);
  const [visumToggle, setVisumToggle] = useState(false);
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
          jenis: 2,
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

  const addVisum = async () => {
    console.log(pembangunan[pembangunan.length - 1].id);
    setVisumToggle(true);
  }

  const addPembangunan = async () => {
    try {
      const token = await SecureStore.getItemAsync('access_token');
      if (pembangunan[pembangunan.length - 1].visum != null) {
        await axios({
          method: 'post',
          url: 'https://dpmd-bengkalis.com/api/inputpembangunan',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          data: queryString.stringify(
            {
              'kegiatan_id': kegiatan.id,
              'lanjutan_kegiatan': `Catatan Kegiatan ${kegiatan.kegiatan} ${pembangunan.length + 1}`,
              'username': username
            }
          )
        })
        const response = await axios({
          method: 'get',
          url: 'https://dpmd-bengkalis.com/api/pembangunan',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          params: {
            'kegiatan_id': kegiatan.id
          }
        })
        setPembangunan(response.data.pembangunan);
      } else {
        showToast('Input visum pada catatan terakhir sebelum melanjutkan');
      }
    } catch (error) {
      console.log(error.response.data);
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
            'pembangunan_id': pembangunan[pembangunan.length - 1].id,
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
            onSelect={(index) => {
              setKegiatan(kegiatanData[index.row]);
              setPembangunan(kegiatanData[index.row].pembangunan);
              setVisumToggle(false);
            }}
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
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
            <Text style={styles.catatanDetail}>Catatan Kelanjutan Kegiatan</Text>
            <TouchableOpacity
              style={styles.button}
              disabled={kegiatan ? false : true}
              onPress={addPembangunan}
            >
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                <Image
                  style={{ width: 18, height: 18 }}
                  source={require('../assets/plus-outline.png')}
                  resizeMode='center'
                />
                <Text style={styles.pembangunanButton}>Tambah</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        {
          kegiatan ?
            <ScrollView>
              {
                pembangunan.length != 0 ?
                  pembangunan.map(el => {
                    return (
                      <Card
                        style={styles.userCard}
                        key={el.id}
                      >
                        <View
                          style={styles.userText}
                        >
                          <View style={{ maxWidth: '60%' }}>
                            <Text style={{ color: '#6C2A0C', fontWeight: '900', fontSize: 13 }} >{el.lanjutan_kegiatan}</Text>
                          </View>
                          {
                            el.visum ? <View></View> : <TouchableOpacity
                              style={styles.addVisumbutton}
                              disabled={kegiatan ? false : true}
                              onPress={addVisum}
                            >
                              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
                                <Image
                                  style={{ width: 18, height: 18 }}
                                  source={require('../assets/plus-outline.png')}
                                  resizeMode='center'
                                />
                                <Text style={styles.pembangunanButton}>Visum</Text>
                              </View>
                            </TouchableOpacity>
                          }
                        </View>
                      </Card>
                    )
                  }) :
                  <Card style={styles.card}>
                    <Text style={{ color: '#6C2A0C', fontWeight: '900', textAlign: 'center' }}>Belum ada Catatan</Text>
                  </Card>
              }
            </ScrollView> : <View>
              <Card style={styles.card}>
                <Text style={{ color: '#6C2A0C', fontWeight: '900', textAlign: 'center' }}>Silahkan Pilih Kegiatan</Text>
              </Card>
            </View>
        }
        {
          visumToggle ?
            <View>
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
            </View> :
            <View />
        }
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
  }, userCard: {
    flex: 1,
    margin: 2,
    backgroundColor: 'color-primary-300'
  }, userText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 2,
    paddingVertical: 2
  }, card: {
    flex: 1,
    margin: 5,
    backgroundColor: 'color-primary-300'
  }, catatanDetail: {
    marginTop: 20,
    textAlign: 'center',
    fontSize: 13,
    fontWeight: 'bold',
    color: 'color-primary-900'
  }, button: {
    height: 25,
    width: 100,
    marginHorizontal: 10,
    marginVertical: 15,
    backgroundColor: 'color-primary-500',
    borderRadius: 5,
  }, addVisumbutton: {
    height: 25,
    width: 75,
    backgroundColor: 'color-primary-500',
    borderRadius: 5,
  }, pembangunanButton: {
    textAlign: 'center',
    fontSize: 13,
    marginLeft: 2,
    fontWeight: 'bold',
    color: 'white'
  }
});