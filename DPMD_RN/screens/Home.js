import { Button, Card, Layout, Text, useStyleSheet, Avatar, Modal, Spinner } from '@ui-kitten/components';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity, ToastAndroid } from 'react-native';
import { StackActions, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { inputOther } from '../features/userSlice';
import * as ImagePicker from 'expo-image-picker';
import * as Camera from 'expo-camera';
import queryString from 'querystring';
import moment from "moment";

export default function HomeScreen({ navigation }) {
  const styles = useStyleSheet(themedStyles);

  const LogoutEvent = async () => {
    try {
      const token = await SecureStore.getItemAsync('access_token');
      await SecureStore.deleteItemAsync('access_token')
      await axios({
        method: 'post',
        url: 'http://10.0.2.2:8000/api/logout',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      navigation.dispatch(StackActions.replace('Login'));
    } catch (error) {
      console.log(error);
    }
  }

  const { username, role, fullname, bidang, tambah_poin, kecamatantugas_id, noreg, harian, absen, jabatan, avatar } = useSelector(state => state.user);
  const [loading, setLoading] = useState(true);
  const [image, setImage] = useState('');
  const [visible, setVisible] = useState(false);

  const dispatch = useDispatch();
  useFocusEffect(
    useCallback(() => {
      async function getProfile() {
        try {
          setLoading(true);
          const token = await SecureStore.getItemAsync('access_token');
          const response = await axios({
            'method': 'get',
            'url': 'http://10.0.2.2:8000/api/pendamping',
            'headers': {
              'Authorization': `Bearer ${token}`
            }
          })
          const user = response.data.pendamping;
          const profil = {
            fullname: user.fullname,
            noreg: user.noreg,
            bidang: user.bidang,
            tambah_poin: user.tambah_poin,
            jabatan: user.jabatan,
            kecamatantugas_id: user.kecamatantugas_id,
            avatar: user.image,
          }

          if (user.users.absen.length == 0) {
            profil.absen = 0;
          } else {
            profil.absen = user.users.absen[0].total_absen;
          }

          if (user.users.harians.length == 0) {
            profil.harian = 0;
          } else {
            profil.harian = user.users.harians[0].total_harian
          }
          dispatch(inputOther(profil));
          setLoading(false);
        } catch (error) {
          console.log(error);
          showToast('Terjadi Kesalahan. Hubungi Contact Person');
          setLoading(false);
        }
      }
      getProfile();
    }, [])
  );

  const showToast = (text) => {
    ToastAndroid.show(text, ToastAndroid.CENTER, ToastAndroid.BOTTOM, ToastAndroid.SHORT);
  }

  const getCamera = async () => {
    try {
      setLoading(true);
      let { status: audioStatus } = await Camera.requestMicrophonePermissionsAsync();
      let { status: cameraStatus } = await Camera.requestCameraPermissionsAsync();
      if (audioStatus == 'granted' && cameraStatus == 'granted') {
        let result = await ImagePicker.launchCameraAsync({
          base64: true
        });
        setImage(result.assets[0].base64);
      } else {
        showToast('Izinkan aplikasi menggunakan kamera');
      }
    } catch (error) {
      setImage('');
    } finally {
      setLoading(false);
    }
  }

  const absensi = () => {
    getCamera()
      .then(result => {
        setLoading(true)
        return SecureStore.getItemAsync('access_token')
      }).then(token => {
        const tanggal = new Date();
        const formattedDate = moment(tanggal).format('YYYY-MM-DD');
        return axios({
          method: 'post',
          url: 'http://10.0.2.2:8000/api/harian',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json'
          },
          data: queryString.stringify(
            {
              'tanggal_absensi': formattedDate,
              'username': username,
              'fullname': fullname,
              'kecamatan_id': kecamatantugas_id,
              'image': image,
              'noreg': noreg
            }
          )
        })
      }).then(response => {
        if (response.data.meta.message == 'Anda telah absen hari ini') {
          showToast('Anda telah absen hari ini');
        } else if (response.data.data.absen) {
          setVisible(true);
        }
      }).catch(error => {
        console.log(error);
        showToast('Gagal Absen silahkan coba lagi')
      }).finally(() => {
        setLoading(false);
      })
  }

  const Header = (props) => (
    <View {...props}
      style={styles.profile}
    >
      <Modal
        visible={visible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setVisible(false)}>
        <Card disabled={true}>
          <Image
            style={{ width: 200, height: 100, justifyContent: 'center', alignSelf: 'center' }}
            source={require('../assets/absen_success.gif')}
            resizeMode='cover'
          />
          <Text style={styles.modalText}>Absensi Harian Berhasil</Text>
        </Card>
      </Modal>
      <View
        style={{ flex: 1, flexDirection: 'row' }}
      >
        {
          avatar ?
            <Avatar size='large' source={{ uri: `https://dpmd-bengkalis.com/storage/${avatar}` }} /> :
            <Avatar size='large' source={require('../assets/avatar.png')} />
        }
        <View
          style={{ marginLeft: 5, marginTop: 3, maxWidth: '60%' }}
        >
          <Text category='s1' style={{ color: '#6C2A0C', fontWeight: '900' }}>{fullname}</Text>
          <Text category='s2' style={{ color: '#6C2A0C' }}>{bidang}</Text>
        </View>
      </View>
      <View>
        <Button
          size="small"
          onPress={LogoutEvent}
          style={{ marginBottom: 8 }}
        >Logout</Button>
        {
          role == 7 || role == 8 ?
            <Button
              size="small"
              onPress={absensi}
            >Absen Harian</Button> :
            <View>
            </View>
        }
      </View>
    </View>
  );
  if (loading) {
    return (
      <View style={styles.container}>
        <View style={{ alignSelf: 'center', justifyContent: 'center', height: '100%' }} >
          <Spinner />
        </View>
      </View>
    )
  } else {
    return (
      <View style={styles.container}>
        <Layout style={styles.topContainer} level='4'>
          <Card style={styles.card} header={Header}>
            <View style={{ flexDirection: 'row' }}>
              <Text style={{ color: '#6C2A0C', fontWeight: '900' }}>Jabatan : </Text>
              <Text style={{ color: '#6C2A0C' }}>{jabatan}</Text>
            </View>
            {
              role == 7 || role == 8 || role == 9 ?
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ color: '#6C2A0C', fontWeight: '900', marginRight: 5 }}>Nilai bulan ini :</Text>
                  <Text style={{ color: '#6C2A0C' }}>{tambah_poin + (parseFloat(harian) > 30 ? 30 : parseFloat(harian)) + (parseFloat(absen) > 40 ? 40 : parseFloat(absen))} poin</Text>
                </View> :
                <View></View>
            }
          </Card>
        </Layout>
        <Layout style={styles.content}>
          {
            role == 7 || role == 8 || role == 9 ?
              <View>
                <View style={{ alignSelf: 'center' }}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Kegiatan')}
                  >
                    <Image
                      style={{ width: 45, height: 45, justifyContent: 'center', alignSelf: 'center' }}
                      source={require('../assets/kegiatan_icon.png')}
                      resizeMode='center'
                    />
                    <Text
                      style={{ color: 'white', textAlign: 'center', marginTop: 4 }}
                    >Kegiatan</Text>
                  </TouchableOpacity>
                </View>
                <Card style={styles.visum}>
                  <Text category='s1' style={{ color: '#6C2A0C', fontWeight: '900', textAlign: 'center' }}>Visum Kegiatan</Text>
                  <View style={{ flex: 1, flexDirection: 'row' }}>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => navigation.navigate('Rutin')}
                    >
                      <Image
                        style={{ width: 45, height: 45, justifyContent: 'center', alignSelf: 'center' }}
                        source={require('../assets/clock-outline.png')}
                        resizeMode='center'
                      />
                      <Text
                        style={{ color: 'white', textAlign: 'center', marginTop: 4, fontSize: 14 }}>Rutin / Harian</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.button}
                      onPress={() => navigation.navigate('Bermasa')}
                    >
                      <Image
                        style={{ width: 45, height: 45, justifyContent: 'center', alignSelf: 'center' }}
                        source={require('../assets/calendar-outline.png')}
                        resizeMode='center'
                      />
                      <Text
                        style={{ color: 'white', textAlign: 'center', marginTop: 4 }}>Bermasa</Text>
                    </TouchableOpacity>
                  </View>
                </Card>
              </View> :
              <View>
                <View style={styles.icons}>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Daftar Anggota')}
                  >
                    <Image
                      style={{ width: 30, height: 30, justifyContent: 'center', alignSelf: 'center' }}
                      source={require('../assets/anggota_icon.png')}
                      resizeMode='center'
                    />
                    <Text
                      style={{ color: 'white', textAlign: 'center', marginTop: 4 }}>Daftar Anggota</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Daftar Kegiatan')}
                  >
                    <Image
                      style={{ width: 30, height: 30, justifyContent: 'center', alignSelf: 'center' }}
                      source={require('../assets/kegiatan_icon.png')}
                      resizeMode='center'
                    />
                    <Text
                      style={{ color: 'white', textAlign: 'center', marginTop: 4 }}
                    >Daftar Kegiatan</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Daftar Absensi')}
                  >
                    <Image
                      style={{ width: 30, height: 30, justifyContent: 'center', alignSelf: 'center' }}
                      source={require('../assets/harian_icon.png')}
                      resizeMode='center'
                    />
                    <Text
                      style={{ color: 'white', textAlign: 'center', marginTop: 4 }}>Absensi Harian</Text>
                  </TouchableOpacity>
                </View>
              </View>
          }
        </Layout >
      </View >
    )
  }
}

const themedStyles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: 'color-primary-300'
  }, card: {
    flex: 1,
    margin: 5,
    backgroundColor: 'color-primary-300'
  }, topContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'color-primary-200'
  }, content: {
    flex: 1,
    flexGrow: 3,
    alignSelf: 'stretch',
    backgroundColor: 'color-primary-100'
  }, profile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingTop: 15,
    paddingBottom: 15,
  }, icons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'center',
    margin: 15
  }, button: {
    padding: 10,
    height: 100,
    width: 100,
    marginHorizontal: 10,
    marginVertical: 15,
    backgroundColor: 'color-primary-500',
    borderRadius: 10,
  }, iconKegiatan: {
    width: 300,
    height: 240
  }, backdrop: {
    backgroundColor: 'rgba(0,0,0,0.5)'
  }, modalText: {
    textAlign: 'center',
    color: 'color-primary-800'
  }, visum: {
    margin: 20,
    height: 170,
    alignItems: 'center',
    backgroundColor: 'color-primary-300'
  }
})