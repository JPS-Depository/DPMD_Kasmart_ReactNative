import { ImageBackground, StyleSheet, View } from 'react-native';
import { Spinner, useStyleSheet } from '@ui-kitten/components';
import { StackActions } from '@react-navigation/native';
import { useEffect } from 'react';

export default function SplashScreen({ navigation }) {
  const styles = useStyleSheet(themedStyles);
  useEffect(() => {
    setTimeout(() => {
      navigation.dispatch(StackActions.replace('Home'));
    }, 3000)
  }, [])

  return (
    <ImageBackground
      source={require('../assets/splash.png')}
      resizeMode="stretch"
      style={styles.image}
    >
      <View style={styles.container}>
        <Spinner
          style={styles.spinner}
        />
      </View>
    </ImageBackground>
  )
}

const themedStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 150,
    alignItems: 'center',
  },
  image: {
    height: '100%',
    width: '100%',
    backgroundColor: 'color-primary-100'
  }
})