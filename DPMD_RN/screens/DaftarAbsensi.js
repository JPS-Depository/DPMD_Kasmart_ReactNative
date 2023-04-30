import { Text, StyleSheet, ScrollView, View, ToastAndroid, Image } from "react-native";
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
import Lightbox from "react-native-lightbox";
import { getHarian, harianSelector } from "../features/harianSlice";
moment.locale('id');

export default function AbsensiScreen({ navigation }) {
  const [loading, setLoading] = useState(false);
  const [person, setPerson] = useState();
  const [visible, setVisible] = useState(false);
  const styles = useStyleSheet(themedStyles);

  const dispatch = useDispatch();

  const [kecamatan, setKecamatan] = useState('');

  const { role, kecamatantugas_id } = useSelector(state => state.user);

  const harian = useSelector(harianSelector.selectAll);
  const kecamatanData = useSelector(kecamatanSelector.selectAll);

  const showToast = (notice) => {
    ToastAndroid.show(notice, ToastAndroid.CENTER, ToastAndroid.BOTTOM, ToastAndroid.SHORT);
  }

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
        });
    }, [])
  );

  useEffect(() => {
    setLoading(true);
    dispatch(getHarian(kecamatan.id))
      .then(result => {
        setLoading(false);
      })
  }, [kecamatan]);


  const ModalHeader = () => (
    <View
      style={styles.profile}
    >
      <Text style={{ color: '#6C2A0C', fontWeight: '900', maxWidth: '60%' }} >{person.fullname}</Text>
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
            kecamatan && harian.length != 0 ?
              <ScrollView>
                {
                  harian.map(el => {
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
                          <Text style={{ color: '#6C2A0C', fontWeight: '900', maxWidth: '50%' }} >{el.fullname}</Text>
                          <Text style={{ color: '#6C2A0C', maxWidth: '50%' }}>
                            {moment(el.created_at).format('Do MMMM YYYY, h:mm')}
                          </Text>
                        </View>
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
                    <Text style={{ color: '#6C2A0C', fontWeight: '900' }}>Belum ada Absensi Hari ini</Text> :
                    <Text style={{ color: '#6C2A0C', fontWeight: '900' }}>Masukkan Kecamatan</Text>
                }
              </View>
        }
        {
          person ?
            <Modal
              visible={visible}
              backdropStyle={styles.backdrop}
              onBackdropPress={() => setVisible(false)}
              style={{ maxWidth: '97%' }}>
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
                    <Text style={{ color: '#6C2A0C', fontWeight: '900' }}>Waktu Absensi</Text>
                  </View>
                  <View
                    style={{ flexDirection: 'column', color: '#6C2A0C', fontWeight: '900', marginEnd: 5 }}
                  >
                    <Text style={{ color: '#6C2A0C', fontWeight: '900' }}>:</Text>
                  </View>
                  <View
                    style={{ flexDirection: 'column' }}
                  >
                    <Text style={{ color: '#6C2A0C' }}>{moment(person.created_at).format('Do MMMM YYYY, h:mm')}</Text>
                    <Text style={{ color: '#6C2A0C' }}>{person.keterangan}</Text>
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
  }, profile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  }, backdrop: {
    backgroundColor: 'rgba(0,0,0,0.5)'
  }, profile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10
  }, main: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  }
});