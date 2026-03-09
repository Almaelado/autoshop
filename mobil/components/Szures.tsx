import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, Modal, Switch, StyleSheet,ScrollView  } from 'react-native';
import Slider from '@react-native-community/slider';
import { api } from '@/api/api'; 
import { useBackend } from '@/auth/BackendProvider';

type SzuresProps = {
  nyitva: boolean;
  setNyitva: (open: boolean) => void;
  onSearch: (filters: any) => void;
};

export default function Szures({ nyitva, setNyitva, onSearch }: SzuresProps) {
  const [markak, setMarkak] = useState<string[]>([]);
  const [uzemanyag, setUzemanyag] = useState<string[]>([]);
  const [szin, setSzin] = useState<string[]>([]);
  const [valto, setValto] = useState<string[]>([]);
  const [ajto, setAjto] = useState<string[]>([]);
  const [szemely, setSzemely] = useState<string[]>([]);
  const [irat, setIrat] = useState(false);
  const { backendUrl } = useBackend();

  const [markaList, setMarkaList] = useState<string[]>([]);
  const [uzemanyagList, setUzemanyagList] = useState<string[]>([]);
  const [szinList, setSzinList] = useState<string[]>([]);
  const [valtoList, setValtoList] = useState<string[]>([]);
  const [ajtoList, setAjtoList] = useState<string[]>([]);
  const [szemelyList, setSzemelyList] = useState<string[]>([]);

  const [arRange, setArRange] = useState([0, 24000000]);
  const [kmRange, setKmRange] = useState([0, 200000]);
  const [evjarat, setEvjarat] = useState([1900, new Date().getFullYear()]);
  const [motormeret, setMotormeret] = useState('');

  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    if (!backendUrl) return;
  const fetchOptions = async () => {
    try {
      const [markaRes, uzemanyagRes, szinRes, valtoRes, ajtoRes, szemelyRes] = await Promise.all([
        api.get('/auto/marka'),
        api.get('/auto/uzemanyag'),
        api.get('/auto/szin'),
        api.get('/auto/valtok'),
        api.get('/auto/ajtok'),
        api.get('/auto/szemelyek'),
      ]);

      // Segédfüggvény: objektum formátum
      const toObj = (arr: any[], key: string) =>
        arr.map((item, i) => ({ id: i, nev: String(item[key]) }));

      setMarkaList(toObj(markaRes.data, 'nev'));
      setUzemanyagList(toObj(uzemanyagRes.data, 'nev'));
      setSzinList(toObj(szinRes.data, 'nev'));
      setValtoList(toObj(valtoRes.data, 'nev'));
      setAjtoList(toObj(ajtoRes.data, 'ajtoszam'));        // ajtók
      setSzemelyList(toObj(szemelyRes.data, 'szemelyek'));  // személyek

    } catch (err) {
      console.error("Hiba az opciók lekérésénél:", err);
    }
  };

  fetchOptions();
}, [backendUrl]);

const toggleSelect = (item: { id: number; nev: any }, selected: string[], setSelected: (arr: string[]) => void) => {
  const value = String(item.nev); // mindig string
  if (selected.includes(value)) {
    setSelected(selected.filter(x => x !== value));
  } else {
    setSelected([...selected, value]);
  }
};

  const handleSearch = () => {
    const filters = {
      markak, uzemanyag, szin, valto, ajto, szemely, irat,
      arRange, kmRange, evjarat, motormeret
    };
    onSearch(filters);
    setNyitva(false);
  };

const renderMultiSelect = (
  label: string,
  options: { id: number; nev: any }[],
  selected: string[],
  setSelected: (arr: string[]) => void
) => (
  <View style={styles.section}>
    <Text style={styles.label}>{label}</Text>
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      {options.map(item => {
        const nevStr = String(item.nev); // <-- biztosítjuk a stringet
        return (
          <TouchableOpacity
            key={String(item.id)}
            onPress={() => toggleSelect({ ...item, nev: nevStr }, selected, setSelected)}
            style={[styles.option, selected.includes(nevStr) && styles.optionSelected]}
          >
            <Text style={{ color: selected.includes(nevStr) ? 'white' : '#333' }}>
              {nevStr}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  </View>
);

  return (
    <Modal visible={nyitva} animationType="slide">
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeBtn} onPress={() => setNyitva(false)}>
          <Text style={styles.closeText}>✖ Bezár</Text>
        </TouchableOpacity>

        <ScrollView>
  {renderMultiSelect('Márkák', markaList, markak, setMarkak)}
  {renderMultiSelect('Üzemanyag', uzemanyagList, uzemanyag, setUzemanyag)}
  {renderMultiSelect('Szín', szinList, szin, setSzin)}

  <View style={styles.section}>
    <Text style={styles.label}>Ár (Ft): {arRange[0]} - {arRange[1]}</Text>
    <Slider
      minimumValue={0} maximumValue={24000000} step={100000}
      value={arRange[1]}
      onValueChange={val => setArRange([arRange[0], val])}
    />
  </View>

  <View style={styles.section}>
    <Text style={styles.label}>Km: {kmRange[0]} - {kmRange[1]}</Text>
    <Slider
      minimumValue={0} maximumValue={200000} step={5000}
      value={kmRange[1]}
      onValueChange={val => setKmRange([kmRange[0], val])}
    />
  </View>

  <View style={styles.section}>
    <Text style={styles.label}>Gyártási év: {evjarat[0]} - {evjarat[1]}</Text>
    <Slider
      minimumValue={1900} maximumValue={new Date().getFullYear()} step={1}
      value={evjarat[1]}
      onValueChange={val => setEvjarat([evjarat[0], val])}
    />
  </View>

  <View style={styles.section}>
    <Text style={styles.label}>Érvényes magyar okmány:</Text>
    <Switch value={irat} onValueChange={setIrat} />
  </View>

  <TouchableOpacity onPress={() => setShowMore(!showMore)}>
    <Text style={styles.showMore}>{showMore ? 'Kevesebb szűrő' : 'További szűrők'}</Text>
  </TouchableOpacity>

  {showMore && (
    <>
      {renderMultiSelect('Váltó', valtoList, valto, setValto)}
      <View style={styles.section}>
        <Text style={styles.label}>Motorméret:</Text>
        <TextInput
          style={styles.input}
          value={motormeret}
          onChangeText={setMotormeret}
          keyboardType="numeric"
          placeholder="pl. 1600"
        />
      </View>
      {renderMultiSelect('Ajtók', ajtoList, ajto, setAjto)}
      {renderMultiSelect('Személyek', szemelyList, szemely, setSzemely)}
    </>
  )}

  <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
    <Text style={styles.searchText}>Keresés</Text>
  </TouchableOpacity>
</ScrollView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8f9fa' },
  closeBtn: { alignSelf: 'flex-end', marginBottom: 10 },
  closeText: { fontSize: 20, fontWeight: 'bold' },
  section: { marginBottom: 15 },
  label: { fontWeight: 'bold', marginBottom: 5 },
  option: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: '#eee', borderRadius: 20, marginRight: 8 },
  optionSelected: { backgroundColor: '#0066ff' },
  showMore: { color: 'blue', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8 },
  searchBtn: { backgroundColor: '#0066ff', padding: 12, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  searchText: { color: 'white', fontWeight: 'bold' },
});