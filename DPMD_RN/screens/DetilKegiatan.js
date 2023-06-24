import { Text, StyleSheet, ScrollView, View, ToastAndroid, Image, Dimensions } from "react-native";
import {
  useStyleSheet,
  Spinner,
  Card
} from '@ui-kitten/components';
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { StackActions, useFocusEffect } from "@react-navigation/native";
import queryString from 'querystring';
import moment from "moment";
import 'moment/locale/id';
moment.locale('id');
import Lightbox from "react-native-lightbox-v2";
import { getKegiatan } from "../features/kegiatanSlice";

const { height } = Dimensions.get('window');

export default function KegiatanScreen({ navigation, route }) {
  const { kegiatan } = route.params;
  const [loading, setLoading] = useState(false);
  const styles = useStyleSheet(themedStyles);
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();


  const showToast = (notice) => {
    ToastAndroid.show(notice, ToastAndroid.CENTER, ToastAndroid.BOTTOM, ToastAndroid.SHORT);
  }

  useFocusEffect(
    useCallback(() => {
      // async function loadAbsensi() {
      //   setLoading(true);
      //   dispatch(getAbsensi(kegiatan.id));
      //   setLoading(false);
      // }
      // loadAbsensi();
    }, [])
  );

  const Header = (props) => (
    <View {...props}
      style={styles.profile}
    >
      <Text style={{ color: '#6C2A0C', fontWeight: '900', maxWidth: '60%' }} >{kegiatan.kegiatan}</Text>
      <Text style={{ color: '#6C2A0C', maxWidth: '40%' }}>{kegiatan.user.pendamping.fullname}</Text>
    </View>
  );

  const catatanHeader = (judul, username) => (
    <View
      style={styles.profile}
    >
      <Text style={{ color: '#6C2A0C', fontWeight: '900' }} >{judul}</Text>
    </View>
  );

  return (

    <ScrollView
      style={styles.container}
    >
      {
        loading ?
          <View
            style={{ alignItems: 'center', height: '100%', justifyContent: 'center' }}
          >
            <Spinner />
          </View> :
          <View
          >
            <Card style={styles.card}
              header={Header}
            >
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <View
                  style={{ marginRight: 5 }}
                >
                  <Text style={{ color: '#6C2A0C', fontWeight: '900' }} >Tanggal Kegiatan</Text>
                </View>
                <View
                  style={{ marginRight: 5 }}
                >
                  <Text style={{ color: '#6C2A0C', fontWeight: '900' }} >:</Text>
                </View>
                <View>
                  <Text style={{ color: '#6C2A0C' }} >{moment(kegiatan.created_at).format('LL')}</Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                }}>
                <View
                  style={{ marginRight: 5 }}
                >
                  <Text style={{ color: '#6C2A0C', fontWeight: '900' }} >Kelurahan</Text>
                </View>
                <View
                  style={{ marginRight: 5 }}
                >
                  <Text style={{ color: '#6C2A0C', fontWeight: '900' }} >:</Text>
                </View>
                <View>
                  <Text style={{ color: '#6C2A0C' }} >{kegiatan.kelurahan.nama}</Text>
                </View>
              </View>
              <View>
                <Text style={{ color: '#6C2A0C', fontWeight: '900', marginTop: 5 }} >Alamat Kegiatan :</Text>
                <Text style={{ color: '#6C2A0C', marginLeft: 10 }} >{kegiatan.alamat_kegiatan}</Text>
                <Text style={{ color: '#6C2A0C', fontWeight: '900', marginTop: 5 }} >Detil Kegiatan :</Text>
                <Text style={{ color: '#6C2A0C', marginLeft: 10, marginBottom: 5 }} >{kegiatan.detil_kegiatan}</Text>

                {
                  kegiatan.jenis == 'Harian' || kegiatan.jenis == 'Rutin' ?
                    <>
                      <Text style={{ color: '#6C2A0C', fontWeight: '900', marginTop: 5 }} >Visum Kegiatan :</Text>
                      {
                        kegiatan.visum ?
                          <Text style={{ color: '#6C2A0C', marginLeft: 10, marginBottom: 5 }} >{kegiatan.visum.hasil_kegiatan}</Text> :
                          <Text style={{ color: '#6C2A0C', marginLeft: 10, marginBottom: 5 }} >Belum ada Visum Kegiatan</Text>
                      }
                    </> :
                    <></>
                }
              </View>
              {
                kegiatan.visum && (kegiatan.jenis == 'Harian' || kegiatan.jenis == 'Rutin') ?
                  <>
                    <View
                      style={{
                        flexDirection: 'row',
                      }}>
                      <View
                        style={{ marginRight: 5 }}
                      >
                        <Text style={{ color: '#6C2A0C', fontWeight: '900' }} >Tanggal Visum</Text>
                      </View>
                      <View
                        style={{ marginRight: 5 }}
                      >
                        <Text style={{ color: '#6C2A0C', fontWeight: '900' }} >:</Text>
                      </View>
                      <View>
                        <Text style={{ color: '#6C2A0C' }} >{moment(kegiatan.visum.created_at).format('LL')}</Text>
                      </View>
                    </View>
                    <Text style={{ color: '#6C2A0C', fontWeight: '900' }}>Lokasi Visum :</Text>
                    <View
                      style={{ paddingLeft: 15, flexDirection: 'row', marginBottom: 10 }}
                    >
                      <View style={{ flexDirection: 'column', marginEnd: 5 }}>
                        <Text style={{ color: '#6C2A0C', fontWeight: '900' }}>Lintang</Text>
                        <Text style={{ color: '#6C2A0C', fontWeight: '900' }}>Bujur</Text>
                      </View>
                      <View style={{ flexDirection: 'column', marginEnd: 5 }}>
                        <Text style={{ color: '#6C2A0C', fontWeight: '900' }}>:</Text>
                        <Text style={{ color: '#6C2A0C', fontWeight: '900' }}>:</Text>
                      </View>
                      <View style={{ flexDirection: 'column' }}>
                        <Text style={{ color: '#6C2A0C' }}>{kegiatan.visum.latitude}</Text>
                        <Text style={{ color: '#6C2A0C' }}>{kegiatan.visum.longitude}</Text>
                      </View>
                    </View>
                    <View>
                      <Lightbox underlayColor="color-primary-300">
                        <Image
                          style={{ height: 200, resizeMode: 'center' }}
                          source={{ uri: `https://dpmd-bengkalis.com/storage/${kegiatan.visum.image}` }}
                        />
                      </Lightbox>
                    </View>
                  </> : <View></View>
              }
            </Card>
            <View
              style={{ marginBottom: 25 }}
            >
              {
                (kegiatan.jenis == `Pembangunan` || kegiatan.jenis == `Pemberdayaan`) ?
                  <>
                    <Text
                      style={{ textAlign: 'center', fontWeight: '900', marginVertical: 5, color: '#6C2A0C' }}
                    >
                      Catatan Kelanjutan Kegiatan
                    </Text>
                    <ScrollView>
                      {
                        kegiatan.pembangunan.length != 0 ?
                          kegiatan.pembangunan.map(el => {

                            return (
                              <Card style={styles.card}
                                key={el.id}
                                header={catatanHeader(el.lanjutan_kegiatan, el.created_by)}
                              >
                                <View
                                  style={{
                                    flexDirection: 'row',
                                  }}>
                                  <View
                                    style={{ marginRight: 5 }}
                                  >
                                    <Text style={{ color: '#6C2A0C', fontWeight: '900' }} >Tanggal Visum</Text>
                                  </View>
                                  <View
                                    style={{ marginRight: 5 }}
                                  >
                                    <Text style={{ color: '#6C2A0C', fontWeight: '900' }} >:</Text>
                                  </View>
                                  <View>
                                    <Text style={{ color: '#6C2A0C' }} >{moment(el.created_at).format('LL')}</Text>
                                  </View>
                                </View>
                                <View>
                                  <Text style={{ color: '#6C2A0C', fontWeight: '900', marginTop: 5 }} >Visum Kegiatan :</Text>
                                  {
                                    el.visum ?
                                      <>
                                        <Text style={{ color: '#6C2A0C', marginLeft: 10, marginBottom: 5 }} >{el.visum.hasil_kegiatan}</Text>
                                        <Text style={{ color: '#6C2A0C', fontWeight: '900' }}>Lokasi Visum :</Text>
                                        <View
                                          style={{ paddingLeft: 15, flexDirection: 'row', marginBottom: 10 }}
                                        >
                                          <View style={{ flexDirection: 'column', marginEnd: 5 }}>
                                            <Text style={{ color: '#6C2A0C', fontWeight: '900' }}>Lintang</Text>
                                            <Text style={{ color: '#6C2A0C', fontWeight: '900' }}>Bujur</Text>
                                          </View>
                                          <View style={{ flexDirection: 'column', marginEnd: 5 }}>
                                            <Text style={{ color: '#6C2A0C', fontWeight: '900' }}>:</Text>
                                            <Text style={{ color: '#6C2A0C', fontWeight: '900' }}>:</Text>
                                          </View>
                                          <View style={{ flexDirection: 'column' }}>
                                            <Text style={{ color: '#6C2A0C' }}>{kegiatan.visum.latitude}</Text>
                                            <Text style={{ color: '#6C2A0C' }}>{kegiatan.visum.longitude}</Text>
                                          </View>
                                        </View>
                                        <View>
                                          <Lightbox underlayColor="color-primary-300">
                                            <Image
                                              style={{ height: 200, resizeMode: 'center' }}
                                              source={{ uri: `https://dpmd-bengkalis.com/storage/${el.visum.image}` }}
                                            />
                                          </Lightbox>
                                        </View>
                                      </> :
                                      <Text style={{ color: '#6C2A0C', marginLeft: 10, marginBottom: 5 }} >Belum ada Visum Kegiatan</Text>
                                  }
                                </View>
                              </Card>
                            )
                          }) :
                          <Card style={styles.card}>
                            <Text style={{ color: '#6C2A0C', fontWeight: '900', textAlign: 'center' }}>Belum ada Catatan Kelanjutan Kegiatan</Text>
                          </Card>
                      }
                    </ScrollView>
                  </> :
                  <></>
              }
            </View >
          </View >
      }
    </ScrollView >

  )
}

const themedStyles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: 'color-primary-200',
    height: height,
    padding: 15
  }, card: {
    flex: 1,
    margin: 5,
    backgroundColor: 'color-primary-300'
  }, profile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10
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
  }, backdrop: {
    backgroundColor: 'rgba(0,0,0,0.5)'
  }
});