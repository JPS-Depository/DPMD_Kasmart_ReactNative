import { Button, Card, Layout, Text, useStyleSheet, Avatar, Icon } from '@ui-kitten/components';
import React, { useCallback, useState } from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { StackActions, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';
import { inputOther } from '../features/userSlice';

export default function HomeScreen({ navigation }) {
  const styles = useStyleSheet(themedStyles);

  const LogoutEvent = async () => {
    await SecureStore.deleteItemAsync('access_token')
    navigation.dispatch(StackActions.replace('Login'));
  }

  const { fullname, bidang, tambah_poin } = useSelector(state => state.user);
  const [loading, setLoading] = useState(false);
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
          const user = response.data.data.pendamping[0]
          dispatch(inputOther({ fullname: user.fullname, noreg: user.noreg, bidang: user.bidang, tambah_poin: user.tambah_poin }));
          setLoading(false);
        } catch (error) {
          console.log(error);
        }
      }
      getProfile();
    }, [])
  );

  const Header = (props) => (
    <View {...props}
      style={styles.profile}
    >
      <View
        style={{ flex: 1, flexDirection: 'row' }}
      >
        <Avatar size='large' source={require('../assets/avatar.png')} />
        <View
          style={{ marginLeft: 5, marginTop: 3 }}
        >
          <Text category='h6'>{fullname}</Text>
          <Text category='s2'>{bidang}</Text>
        </View>
      </View>
      <Button
        size="small"
        onPress={LogoutEvent}
      >Logout</Button>
    </View>
  );
  return (
    <View style={styles.container}>
      <Layout style={styles.topContainer} level='4'>
        <Card style={styles.card} header={Header}>
          <Text>Performa bulan ini : {tambah_poin} poin</Text>
        </Card>
      </Layout>
      <Layout style={styles.content}>
        <View style={styles.icons}>
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
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Absensi')}
          >
            <Image
              style={{ width: 45, height: 45, justifyContent: 'center', alignSelf: 'center' }}
              source={require('../assets/absen_icon.png')}
              resizeMode='center'
            />
            <Text
              style={{ color: 'white', textAlign: 'center', marginTop: 4 }}>Absensi</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Visum')}
          >
            <Image
              style={{ width: 45, height: 45, justifyContent: 'center', alignSelf: 'center' }}
              source={require('../assets/visum_icon.png')}
              resizeMode='center'
            />
            <Text
              style={{ color: 'white', textAlign: 'center', marginTop: 4 }}>Visum</Text>
          </TouchableOpacity>
        </View>
      </Layout >
    </View >
  )
}

const themedStyles = StyleSheet.create({
  container: {
    flex: 1,
    height: '100%',
    width: '100%'
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
    flexWrap: 'wrap',
    flexGrow: 3,
    flexDirection: 'row',
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
    height: 90,
    width: 90,
    marginHorizontal: 5,
    marginVertical: 10,
    backgroundColor: 'color-primary-500',
    borderRadius: 10,
  }, iconKegiatan: {
    width: 300,
    height: 240
  }
})