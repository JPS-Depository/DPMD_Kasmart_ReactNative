import { StyleSheet, Text, View } from 'react-native';
import * as eva from '@eva-design/eva';
import { default as theme } from './custom-theme.json';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import HomeScreen from './screens/Home';
import SplashScreen from './screens/Splash';
import LoginScreen from './screens/Login';
import KegiatanScreen from './screens/Kegiatan';
import RutinScreen from './screens/Rutin';
import MasaScreen from './screens/Bermasa';
import DetilKegiatan from './screens/DetilKegiatan';
import DaftarKegiatan from './screens/DaftarKegiatan';
import DaftarAbsensi from './screens/DaftarAbsensi';
import DaftarAnggota from './screens/DaftarAnggota';
import { Provider } from 'react-redux';
import { store } from './store/store';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <SafeAreaView style={styles.container}>
          <Provider store={store}>
            <IconRegistry icons={EvaIconsPack} />
            <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
              <Stack.Navigator
                initialRouteName='Login'
                screenOptions={{ headerShown: false }}
              >
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Kegiatan" component={KegiatanScreen} options={{
                  headerShown: true, headerStyle: { backgroundColor: '#ECB56F' }
                }} />
                <Stack.Screen name="Rutin" component={RutinScreen} options={{
                  headerShown: true, headerStyle: { backgroundColor: '#ECB56F' }
                }} />
                <Stack.Screen name="Bermasa" component={MasaScreen} options={{
                  headerShown: true, headerStyle: { backgroundColor: '#ECB56F' }
                }} />
                <Stack.Screen name="Daftar Kegiatan" component={DaftarKegiatan} options={{
                  headerShown: true, headerStyle: { backgroundColor: '#ECB56F' }
                }} />
                <Stack.Screen name="Detil Kegiatan" component={DetilKegiatan} options={{
                  headerShown: true, headerStyle: { backgroundColor: '#ECB56F' }
                }} />
                <Stack.Screen name="Daftar Absensi" component={DaftarAbsensi} options={{
                  headerShown: true, headerStyle: { backgroundColor: '#ECB56F' }
                }} />
                <Stack.Screen name="Daftar Anggota" component={DaftarAnggota} options={{
                  headerShown: true, headerStyle: { backgroundColor: '#ECB56F' }
                }} />
              </Stack.Navigator>
            </ApplicationProvider>
          </Provider>
        </SafeAreaView>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
  },
});
