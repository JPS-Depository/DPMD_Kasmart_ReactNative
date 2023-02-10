import { Text, StyleSheet, ScrollView, View } from "react-native";
import {
  Layout,
  Select,
  SelectItem,
  useStyleSheet,
  Input,
  Icon,
  Datepicker,
  Button
} from '@ui-kitten/components';
import { useState } from "react";

export default function AbsensiScreen({ navigation }) {
  const [selectedIndex, setSelectedIndex] = useState('');
  const [value, setValue] = useState('');
  const [date, setDate] = useState(new Date());
  const styles = useStyleSheet(themedStyles);

  const useInputState = (initialValue = '') => {
    const [multi, setMulti] = useState(initialValue);
    return { multi, onchangeText: setMulti };
  }

  const multilineInputState = useInputState();

  return (
    <View
      style={{ flex: 1 }}
    >
      <ScrollView
        style={styles.container}
      >
        <Select
          label={() => <Text style={styles.label}>Kegiatan</Text>}
          caption={() => <Text style={styles.caption}>Silahkan pilih kegiatan</Text>}
          selectedIndex={selectedIndex}
          onSelect={index => setSelectedIndex(index)}
        >
          <SelectItem
            title='Pilihan 1'
          />
          <SelectItem
            title='Pilihan 2'
          />
          <SelectItem
            title='Pilihan 3'
          />
        </Select>
        <Input
          multiline={true}
          label={() => <Text style={styles.label}>Detil Kegiatan</Text>}
          placeholder='Deskripsikan detil Kegiatan Anda'
          style={styles.formInput}
          textStyle={{ minHeight: 64 }}
          {...multilineInputState}
        />
        <Button
          style={styles.submit}
        >Submit Absensi</Button>
      </ScrollView >
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
  }
});