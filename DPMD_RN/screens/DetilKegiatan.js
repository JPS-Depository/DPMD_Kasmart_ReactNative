import { Text, StyleSheet, ScrollView, View, ToastAndroid, Image, Dimensions } from "react-native";
import {
  Select,
  SelectItem,
  useStyleSheet,
  Button,
  Spinner,
  Card,
  Modal
} from '@ui-kitten/components';
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getKecamatan, kecamatanSelector } from "../features/kecamatanSlice";
import { StackActions, useFocusEffect } from "@react-navigation/native";
import queryString from 'querystring';
import moment from "moment";
import 'moment/locale/id';
moment.locale('id');
import Lightbox from "react-native-lightbox";
import { getAbsensi, absensiSelector } from "../features/absensiSlice";
import { getKegiatan } from "../features/kegiatanSlice";

const { height } = Dimensions.get('window');

export default function KegiatanScreen({ navigation, route }) {
  const { kegiatan } = route.params;
  const [loading, setLoading] = useState(false);
  const [person, setPerson] = useState();
  const styles = useStyleSheet(themedStyles);
  const [visible, setVisible] = useState(false);
  const dispatch = useDispatch();

  const absensi = useSelector(absensiSelector.selectAll);

  const showToast = (notice) => {
    ToastAndroid.show(notice, ToastAndroid.CENTER, ToastAndroid.BOTTOM, ToastAndroid.SHORT);
  }

  useFocusEffect(
    useCallback(() => {
      async function loadAbsensi() {
        setLoading(true);
        dispatch(getAbsensi(kegiatan.id));
        setLoading(false);
      }
      loadAbsensi();
    }, [])
  );

  const Header = (props) => (
    <View {...props}
      style={styles.profile}
    >
      <Text style={{ color: '#6C2A0C', fontWeight: '900', maxWidth: '60%' }} >{kegiatan.kegiatan}</Text>
      <Text style={{ color: '#6C2A0C', maxWidth: '40%' }}>{kegiatan.created_by}</Text>
    </View>
  );

  const ModalHeader = () => (
    <View
      style={styles.profile}
    >
      <Text style={{ color: '#6C2A0C', fontWeight: '900', maxWidth: '60%' }} >{person.fullname}</Text>
      <Text
        style={{
          color: person.in_out === 0 ? "#B7385A" : '#389B45'
          , maxWidth: '40%', fontWeight: '900'
        }}>{
          person.in_out === 0 ? 'Keluar' : 'Masuk'
        }
      </Text>
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
                  <Text style={{ color: '#6C2A0C' }} >{kegiatan.kelurahan}</Text>
                </View>
              </View>
              <View
                style={{ marginBottom: 10 }}
              >
                <Text style={{ color: '#6C2A0C', fontWeight: '900', marginTop: 5 }} >Alamat Kegiatan :</Text>
                <Text style={{ color: '#6C2A0C', marginLeft: 10 }} >{kegiatan.alamat_kegiatan}</Text>
                <Text style={{ color: '#6C2A0C', fontWeight: '900', marginTop: 5 }} >Detil Kegiatan :</Text>
                <Text style={{ color: '#6C2A0C', marginLeft: 10, marginBottom: 5 }} >{kegiatan.detil_kegiatan}</Text>
              </View>
              <View>
                <Lightbox underlayColor="color-primary-300">
                  <Image
                    style={{ height: 200, resizeMode: 'center' }}
                    source={{ uri: `https://dpmd-bengkalis.com/storage/${kegiatan.image}` }}
                  />
                </Lightbox>
              </View>
            </Card>
            <View
              style={{ marginBottom: 25 }}
            >
              <Text
                style={{ textAlign: 'center', fontWeight: '900', marginVertical: 5, color: '#6C2A0C' }}
              >
                Daftar Absensi Kegiatan
              </Text>
              <ScrollView>
                {
                  absensi.length != 0 ?
                    absensi.map(el => {
                      return (
                        <Card
                          style={styles.userCard}
                          key={el.id}
                          onPress={() => {
                            setVisible(true);
                            setPerson(el);
                          }}
                        >
                          <View
                            style={styles.userText}
                          >
                            <Text style={{ color: '#6C2A0C', fontWeight: '900', maxWidth: '60%' }} >{el.fullname}</Text>
                            <Text
                              style={{
                                color: el.in_out === 0 ? "#B7385A" : '#389B45'
                                , maxWidth: '40%', fontWeight: '900'
                              }}>{
                                el.in_out === 0 ? 'Keluar' : 'Masuk'
                              }
                            </Text>
                          </View>
                        </Card>
                      )
                    }) :
                    <Card style={styles.card}>
                      <Text style={{ color: '#6C2A0C', fontWeight: '900', textAlign: 'center' }}>Belum ada Absensi</Text>
                    </Card>
                }
              </ScrollView>
              {
                person ?
                  <Modal
                    visible={visible}
                    backdropStyle={styles.backdrop}
                    style={{ maxWidth: '97%' }}
                    onBackdropPress={() => setVisible(false)}>
                    <Card
                      disabled={true}
                      style={styles.card}
                      header={ModalHeader}
                    >
                      <View
                        style={{ flexDirection: 'row' }}
                      >
                        <View
                          style={{ flexDirection: 'column', marginEnd: 5 }}
                        >
                          <Text style={{ color: '#6C2A0C', fontWeight: '900' }}>Tanggal Absensi</Text>
                          <Text style={{ color: '#6C2A0C', fontWeight: '900' }}>Keterangan Absensi</Text>
                        </View>
                        <View
                          style={{ flexDirection: 'column', color: '#6C2A0C', fontWeight: '900', marginEnd: 5 }}
                        >
                          <Text style={{ color: '#6C2A0C', fontWeight: '900' }}>:</Text>
                          <Text style={{ color: '#6C2A0C', fontWeight: '900' }}>:</Text>
                        </View>
                        <View
                          style={{ flexDirection: 'column' }}
                        >
                          <Text style={{ color: '#6C2A0C' }}>{moment(person.created_at).format('Do MMMM YYYY, h:mm')}</Text>
                          <Text style={{ color: '#6C2A0C', maxWidth: '98%' }}>{person.keterangan}</Text>
                        </View>
                      </View>
                      <Text style={{ color: '#6C2A0C', fontWeight: '900' }}>Disini Koordinat :</Text>
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
                          <Text style={{ color: '#6C2A0C' }}>{person.latitude}</Text>
                          <Text style={{ color: '#6C2A0C' }}>{person.longitude}</Text>
                        </View>
                      </View>
                      <View>
                        <Lightbox underlayColor="color-primary-300">
                          <Image
                            style={{ height: 200, resizeMode: 'center' }}
                            source={{ uri: `https://dpmd-bengkalis.com/storage/${person.image}` }}
                          />
                        </Lightbox>
                      </View>
                    </Card>
                  </Modal> :
                  <Text></Text>
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