import { Text, StyleSheet, ScrollView, View, ToastAndroid, Image } from "react-native";
import {
  Select,
  SelectItem,
  useStyleSheet,
  Button,
  Spinner,
  Card,
  Modal,
  Avatar
} from '@ui-kitten/components';
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getKecamatan, kecamatanSelector } from "../features/kecamatanSlice";
import { StackActions, useFocusEffect } from "@react-navigation/native";
import queryString from 'querystring';
import moment from "moment";
import 'moment/locale/id';
import Lightbox from "react-native-lightbox";
import { getAnggota, anggotaSelector } from "../features/anggotaSlice";
moment.locale('id');

export default function AbsensiScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [person, setPerson] = useState();
  const [visible, setVisible] = useState(false);
  const styles = useStyleSheet(themedStyles);

  const dispatch = useDispatch();

  const [kecamatan, setKecamatan] = useState('');

  const anggota = useSelector(anggotaSelector.selectAll);
  const kecamatanData = useSelector(kecamatanSelector.selectAll);

  const showToast = (notice) => {
    ToastAndroid.show(notice, ToastAndroid.CENTER, ToastAndroid.BOTTOM, ToastAndroid.SHORT);
  }

  const { username, role, kecamatantugas_id } = useSelector(state => state.user);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      dispatch(getKecamatan())
        .then(result => {
          if (role == 'SuperUserKecamatan') {
            result.payload.forEach(element => {
              if (element.id == kecamatantugas_id) {
                setKecamatan(element);
              }
            });
          }
          setLoading(false);
        });
    }, [])
  );

  useEffect(() => {
    setLoading(true);
    dispatch(getAnggota(kecamatan.id))
      .then(result => {
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
      })
  }, [kecamatan]);


  const ModalHeader = () => (
    <View
      style={styles.profile}
    >
      <Avatar size='large' source={require('../assets/avatar.png')} />
      <Text style={{ color: '#6C2A0C', fontWeight: '900', maxWidth: '60%', marginLeft: 10 }} >{person.fullname}</Text>
    </View>
  );

  return (
    <View
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        {
          role == 'SuperUserKecamatan' ?
            <Select
              label={() => <Text style={styles.label}>Kecamatan Tugas</Text>}
              style={styles.formInput}
              value={kecamatan.nama}
              disabled={true}
            /> :
            <Select
              label={() => <Text style={styles.label}>Kecamatan Tugas</Text>}
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
        }
        {
          loading ?
            <View
              style={{ alignItems: 'center' }}
            >
              <Spinner />
            </View> :
            kecamatan ?
              <>
                <View
                  style={styles.listHeader}
                >
                  <Text style={{ color: '#6C2A0C', fontWeight: '900', maxWidth: '50%' }} >Nama</Text>
                  <Text style={{ color: '#6C2A0C', maxWidth: '50%' }}>
                    Total Bobot Nilai
                  </Text>
                </View>
                <ScrollView>
                  {
                    anggota.map(el => {
                      return (
                        <Card style={styles.card}
                          key={el.id}
                          onPress={() => {
                            setVisible(true);
                            setPerson(el);
                          }}
                        >
                          <View
                            style={styles.main}
                          >
                            <View
                              style={{ flexDirection: 'row', maxWidth: '60%', alignItems: 'center' }}
                            >
                              <Avatar size='large' source={require('../assets/avatar.png')} />
                              <Text style={{ color: '#6C2A0C', fontWeight: '900', marginLeft: 10 }} >{el.fullname}</Text>
                            </View>
                            <Text style={{ color: '#6C2A0C', fontWeight: '400', maxWidth: '40%' }}>{el.score}</Text>
                          </View>
                        </Card>
                      )
                    })
                  }
                </ScrollView>
              </>
              :
              <View
                style={{ alignItems: 'center', justifyContent: 'center' }}
              >
                <Text style={{ color: '#6C2A0C', fontWeight: '900' }}>Data Tidak ditemukan</Text>
              </View>
        }
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
                    style={{ flexDirection: 'column' }}
                  >
                    <Text style={{ color: '#6C2A0C', fontWeight: '900' }}>Nomor Registrasi</Text>
                    <Text style={{ color: '#6C2A0C', fontWeight: '900' }}>Kelurahan Tugas</Text>
                    <Text style={{ color: '#6C2A0C', fontWeight: '900' }}>Abensi Harian</Text>
                    <Text style={{ color: '#6C2A0C', fontWeight: '900' }}>Jumlah Visum</Text>
                    <Text style={{ color: '#6C2A0C', fontWeight: '900' }}>Absensi Kegiatan</Text>
                    <Text style={{ color: '#6C2A0C', fontWeight: '900' }}>Bobot Nilai</Text>
                  </View>
                  <View
                    style={{ flexDirection: 'column', color: '#6C2A0C', fontWeight: '900', marginHorizontal: 5 }}
                  >
                    <Text style={{ color: '#6C2A0C', fontWeight: '900' }}>:</Text>
                    <Text style={{ color: '#6C2A0C', fontWeight: '900' }}>:</Text>
                    <Text style={{ color: '#6C2A0C', fontWeight: '900' }}>:</Text>
                    <Text style={{ color: '#6C2A0C', fontWeight: '900' }}>:</Text>
                    <Text style={{ color: '#6C2A0C', fontWeight: '900' }}>:</Text>
                    <Text style={{ color: '#6C2A0C', fontWeight: '900' }}>:</Text>
                  </View>
                  <View
                    style={{ flexDirection: 'column' }}
                  >
                    <Text style={{ color: '#6C2A0C' }}>{person.noreg}</Text>
                    <Text style={{ color: '#6C2A0C' }}>{person.kelurahanTugas}</Text>
                    <Text style={{ color: '#6C2A0C' }}>{person.countDaily}</Text>
                    <Text style={{ color: '#6C2A0C' }}>{person.countActivities}</Text>
                    <Text style={{ color: '#6C2A0C' }}>{person.countVisum}</Text>
                    <Text style={{ color: '#6C2A0C' }}>{person.score}</Text>
                  </View>
                </View>
              </Card>
            </Modal> :
            <Text></Text>
        }
      </View>
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
    marginBottom: 20,
  }, label: {
    marginBottom: 3,
    color: 'color-primary-900',
    fontWeight: 'bold',
    fontSize: 12
  }, card: {
    flex: 1,
    backgroundColor: 'color-primary-300'
  }, backdrop: {
    backgroundColor: 'rgba(0,0,0,0.5)'
  }, profile: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10
  }, main: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }, listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 15
  }
});