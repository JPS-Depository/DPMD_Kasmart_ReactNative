import { Text, StyleSheet, TouchableWithoutFeedback, Image, ScrollView, ToastAndroid } from "react-native";
import {
  useStyleSheet,
  Input,
  Icon,
  Button,
  Spinner
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
        url: 'http://10.0.2.2:8000/api/login',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json'
        },
        data: queryString.stringify({ username: username, password: password })
      })
      const { access_token, user } = response.data.data;
      await SecureStore.setItemAsync('access_token', access_token);
      dispatch(inputIdUsername({ id: user.id, username: user.username }));
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
        caption={() => <Text style={styles.caption}>'Contoh : user00000 (user + 6-digit nomor registrasi)</Text>}
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
      {
        loading ?
          <Button
            style={styles.submit}
            disabled='true'
          >
            <Spinner />
          </Button> :
          <Button
            style={styles.submit}
            onPress={loginHandler}
          >Login</Button>
      }
    </ScrollView >
  )
}

const themedStyles = StyleSheet.create({
  container: {
    flex: 1,
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
  }, eye: {
    width: 30,
    height: 24
  }, image: {
    height: 180,
    width: 200,
    marginTop: 50,
    marginBottom: 10,
    alignSelf: 'center'
  }
});