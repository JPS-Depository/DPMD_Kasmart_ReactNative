import { StyleSheet, Text, View } from 'react-native';
import * as eva from '@eva-design/eva';
import { default as theme } from './custom-theme.json';
import { ApplicationProvider } from '@ui-kitten/components';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import HomeScreen from './screens/Home';
import SplashScreen from './screens/Splash';
import { IconRegistry } from '@ui-kitten/components/ui';
import LoginScreen from './screens/Login';
import KegiatanScreen from './screens/Kegiatan';
import VisumScreen from './screens/Visum';
import AbsensiScreen from './screens/Absensi';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <SafeAreaView style={styles.container}>
          <IconRegistry icons={EvaIconsPack} />
          <ApplicationProvider {...eva} theme={{ ...eva.light, ...theme }}>
            <Stack.Navigator
              initialRouteName='Splash'
              screenOptions={{ headerShown: false }}
            >
              <Stack.Screen name="Splash" component={SplashScreen} />
              <Stack.Screen name="Home" component={HomeScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
              <Stack.Screen name="Kegiatan" component={KegiatanScreen} options={{
                headerShown: true
              }} />
              <Stack.Screen name="Visum" component={VisumScreen} options={{
                headerShown: true
              }} />
              <Stack.Screen name="Absensi" component={AbsensiScreen} options={{
                headerShown: true
              }} />
            </Stack.Navigator>
          </ApplicationProvider>
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
