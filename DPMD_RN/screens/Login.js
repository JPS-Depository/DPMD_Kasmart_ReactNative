import { Text, StyleSheet, TouchableWithoutFeedback, Image, ScrollView, ToastAndroid, View } from "react-native";
import {
  useStyleSheet,
  Input,
  Icon,
  Button,
  Spinner,
  Modal,
  Card
} from '@ui-kitten/components';
import { useState } from "react";
import axios from 'axios';
import queryString from 'querystring';
import * as SecureStore from 'expo-secure-store';
import { StackActions } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { inputIdUsername } from "../features/userSlice";


export default function AbsensiScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const styles = useStyleSheet(themedStyles);
  const dispatch = useDispatch();

  const toggleSecureEntry = () => {
    setSecureTextEntry(!secureTextEntry);
  };

  const showToast = () => {
    ToastAndroid.show('Username / Password salah', ToastAndroid.CENTER, ToastAndroid.BOTTOM, ToastAndroid.SHORT);
  }

  async function loginHandler() {
    try {
      setLoading(true);
      const response = await axios({
        method: 'post',
        url: 'https://dpmd-bengkalis.com/api/login',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        data: queryString.stringify({ username: username, password: password })
      })
      const { access_token, user } = response.data;
      await SecureStore.setItemAsync('access_token', access_token);
      dispatch(inputIdUsername({ id: user.id, username: user.username, role: user.roles[0].id }));
      setLoading(false);
      navigation.dispatch(StackActions.replace('Home'));
    } catch (error) {
      showToast();
      setLoading(false);
    }
  }

  const renderIcon = () => (
    <TouchableWithoutFeedback onPress={toggleSecureEntry}>
      <Icon name={secureTextEntry ? 'eye-off' : 'eye'} style={styles.eye} fill='grey' />
    </TouchableWithoutFeedback>
  );

  const ModalHeader = () => (
    <View
      style={styles.profile}
    >
      <Image
        source={require('../assets/MJP_icon.png')}
        style={styles.logo}
        resizeMode='center'
      />
      <Text style={{ color: '#6C2A0C', fontSize: 20, fontWeight: '900', maxWidth: '60%' }} >Mandau Jaya Perkasa</Text>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      behavior='height'
    >
      <Image
        source={require('../assets/login_logo.png')}
        style={styles.image}
        resizeMode='stretch'
      />
      <Input
        value={username}
        label={() => <Text style={styles.label}>Username</Text>}
        caption={() => <Text style={styles.caption}>*Contoh : user00000 (user + 5-digit nomor registrasi)</Text>}
        placeholder='Username'
        onChangeText={nextValue => setUsername(nextValue)}
        style={styles.formInput}
      />
      <Input
        value={password}
        label={() => <Text style={styles.label}>Password</Text>}
        placeholder='Silahkan input password anda'
        onChangeText={nextValue => setPassword(nextValue)}
        secureTextEntry={secureTextEntry}
        accessoryRight={renderIcon}
        style={styles.formInput}
      />
      <Button
        style={styles.submit}
        onPress={loginHandler}
        disabled={loading ? true : false}
      >Login</Button>
      {
        loading ?
          <View style={{ alignItems: 'center' }}>
            <Spinner />
          </View> : null
      }
      <View
        style={{ flex: 1, justifyContent: 'flex-end', alignItems: 'center', marginTop: 5 }}
      >
        <Text
          onPress={() => {
            setVisible(true);
          }}
          style={{ textDecorationLine: 'underline', fontSize: 15, color: '#6C2A0C', fontWeight: '700' }}
        >Tentang Kami</Text>
      </View>
      <Modal
        visible={visible}
        style={{ maxWidth: '97%' }}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setVisible(false)}>
        <Card
          disabled={true}
          style={styles.card}
          header={ModalHeader}
        >
          <View
            style={{ flex: 1 }}
          >
            <Text
              style={{ textAlign: 'center', marginBottom: 10, fontSize: 15, fontWeight: '700', color: '#6C2A0C' }}
            >Hubungi Kami melalui salah satu QR-Code Berikut
            </Text>
            <View
              style={{ flexDirection: 'row' }}
            >
              <Image
                source={require('../assets/QR_1.jpg')}
                style={styles.logo}
                resizeMode='center'
              />
              <Image
                source={require('../assets/QR_2.jpg')}
                style={styles.logo}
                resizeMode='center'
              />
            </View>
            <Text
              style={{ textAlign: 'center', marginVertical: 10, fontSize: 15, fontWeight: '700', color: '#6C2A0C' }}
            >Atau melalui Whatsapp berikut
            </Text>
            <View>
              <View
                style={{ flexDirection: 'row' }}
              >
                <Text style={styles.marketing}>+6285375369398 : </Text>
                <Text style={styles.marketing2}>Roby Ulung Saputra</Text>
              </View>
              <View
                style={{ flexDirection: 'row', marginBottom: 10 }}
              >
                <Text style={styles.marketing}>+628117587444 : </Text>
                <Text style={styles.marketing2}>Hasbullah</Text>
              </View>
            </View>
          </View>
        </Card>
      </Modal>
    </ScrollView >
  )
}

const themedStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'color-primary-200',
    height: '100%',
    padding: 20,
    paddingTop: 50,
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
    marginVertical: 20
  }, eye: {
    width: 30,
    height: 24
  }, image: {
    height: 180,
    width: 200,
    marginTop: 50,
    marginBottom: 10,
    alignSelf: 'center'
  }, card: {
    flex: 1,
    backgroundColor: 'color-primary-300'
  }, profile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10
  }, backdrop: {
    backgroundColor: 'rgba(0,0,0,0.5)'
  }, logo: {
    height: 100,
    width: 150
  }, marketing: {
    textAlign: 'center',
    fontSize: 15,
    fontWeight: '700',
    color: '#6C2A0C'
  }, marketing2: {
    textAlign: 'center',
    fontSize: 15,
    color: '#6C2A0C'
  }
});