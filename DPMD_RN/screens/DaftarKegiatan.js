import { Text, StyleSheet, ScrollView, View, ToastAndroid } from "react-native";
import {
  Select,
  SelectItem,
  useStyleSheet,
  Button,
  Spinner,
  Card
} from '@ui-kitten/components';
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { getKecamatan, kecamatanSelector } from "../features/kecamatanSlice";
import { StackActions, useFocusEffect } from "@react-navigation/native";
import queryString from 'querystring';
import moment from "moment";
import 'moment/locale/id';
import { getKegiatan, kegiatanSelector } from "../features/kegiatanSlice";
moment.locale('id');

export default function KegiatanScreen({ navigation }) {
  const [loading, setLoading] = useState(true);
  const styles = useStyleSheet(themedStyles);
  const dispatch = useDispatch();

  const { role, kecamatantugas_id } = useSelector(state => state.user);
  const [kecamatan, setKecamatan] = useState('');

  const kegiatan = useSelector(kegiatanSelector.selectAll);
  const kecamatanData = useSelector(kecamatanSelector.selectAll);

  const showToast = (notice) => {
    ToastAndroid.show(notice, ToastAndroid.CENTER, ToastAndroid.BOTTOM, ToastAndroid.SHORT);
  }

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      dispatch(getKecamatan())
        .then(result => {
          if (role == 5 || role == 6) {
            result.payload.forEach(element => {
              if (element.id == kecamatantugas_id) {
                setKecamatan(element);
              }
            });
          }
          setLoading(false);
        })
    }, [])
  );

  async function loadKegiatan() {
    setLoading(true);
    dispatch(getKegiatan({
      kecamatantugas_id: kecamatantugas_id,
      role_id: role
    }));
  }

  useEffect(() => {
    loadKegiatan();
    setLoading(false);
  }, [kecamatan]);

  const Header = (props) => (
    <View {...props}
      style={styles.profile}
    >
      <Text style={{ color: '#6C2A0C', fontWeight: '900', maxWidth: '60%' }} >{props.title}</Text>
      <Text style={{ color: '#6C2A0C', maxWidth: '40%' }}>{props.created_by}</Text>
    </View>
  );

  return (
    <View
      style={{ flex: 1 }}
    >
      <View style={styles.container}>
        {
          (role == 5 || role == 6) ?
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
            kecamatan && kegiatan.length != 0 ?
              <ScrollView>
                {
                  kegiatan.map(el => {
                    return (
                      <Card style={styles.card}
                        key={el.id}
                        header={<Header title={el.kegiatan} created_by={el.user.pendamping.fullname} />}
                        onPress={() => { navigation.navigate('Detil Kegiatan', { kegiatan: el }) }}
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
                            <Text style={{ color: '#6C2A0C' }} >{moment(el.created_at).format('LL')}</Text>
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
                            <Text style={{ color: '#6C2A0C' }} >{el.kelurahan.nama}</Text>
                          </View>
                        </View>
                        <Text style={{ color: '#6C2A0C', fontWeight: '900', marginTop: 5 }} >Alamat Kegiatan :</Text>
                        <Text style={{ color: '#6C2A0C', marginLeft: 10 }} >{el.alamat_kegiatan}</Text>
                        <Text style={{ color: '#6C2A0C', fontWeight: '900', marginTop: 5 }} >Detil Kegiatan :</Text>
                        <Text style={{ color: '#6C2A0C', marginLeft: 10 }} >{el.detil_kegiatan}</Text>
                      </Card>
                    )
                  })
                }
              </ScrollView> :
              <View
                style={{ alignItems: 'center', justifyContent: 'center' }}
              >
                {
                  kecamatan ?
                    <Text style={{ color: '#6C2A0C', fontWeight: '900' }}>Data Kegiatan Tidak Ditemukan</Text> :
                    <Text style={{ color: '#6C2A0C', fontWeight: '900' }}>Masukkan Kecamatan</Text>
                }
              </View>
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
  }, caption: {
    color: 'color-primary-900',
    fontSize: 12
  }, submit: {
    marginBottom: 40,
    marginTop: 20
  }, imagePicker: {
    width: 130
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
  }
});