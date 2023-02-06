import { Button, Card, Layout, Text, useStyleSheet, Avatar, Icon } from '@ui-kitten/components';
import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity } from 'react-native';
import { StackActions } from '@react-navigation/native';

export default function HomeScreen({ navigation }) {
  const styles = useStyleSheet(themedStyles);

  const LogoutEvent = () => {
    navigation.dispatch(StackActions.replace('Login'));
  }

  const Header = (props) => (
    <View {...props}
      style={styles.profile}
    >
      <Avatar size='large' source={require('../assets/avatar.png')} />
      <View
        style={{ marginLeft: -90 }}
      >
        <Text category='h6'>Di sini Nama</Text>
        <Text category='s2'>Di sini Jabatan</Text>
      </View>
      <Button
        size="small"
        onPress={LogoutEvent}
      >Logout</Button>
    </View>
  );
  // useEffect(() => {
  //   setTimeout(() => {
  // navigation.dispatch(StackActions.replace('Home'));
  //   }, 3000)
  // }, [])
  return (
    <View style={styles.container}>
      <Layout style={styles.topContainer} level='4'>
        <Card style={styles.card} header={Header}>
          <Text>Detil bla bla bla</Text>
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
              source={require('../assets/icon.png')}
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
              source={require('../assets/icon.png')}
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
              source={require('../assets/icon.png')}
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
  }
})