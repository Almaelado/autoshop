import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Linking } from 'react-native';
import { api } from '../../api/api';
import { useBackend } from '@/auth/BackendProvider';


export default function HomeScreen() {
  const [autok, setAutok] = useState([]);
  const { backendUrl } = useBackend();

  useEffect(() => {
  if (!backendUrl) return;

  const fetchAutok = async () => {
    try {
      const response = await api.get(`/auto/random`);
      setAutok(response.data);
    } catch (error) {
      console.error("Hiba az autók betöltésekor:", error);
    }
  };

  fetchAutok();
}, [backendUrl]); 

  useEffect(() => {
    console.log("Autók betöltve:", autok);
  }, [autok]);

  return (
    <ScrollView style={styles.container}>
      {/* HERO BANNER */}
      <View style={styles.hero}>
        <View style={styles.heroOverlay}>
          <Text style={styles.heroTitle}>Ndidi Autókereskedés</Text>
          <Text style={styles.heroSubtitle}>Minőségi autók elérhető áron • Megbízhatóság • Szakértelem</Text>
          <TouchableOpacity
            style={styles.heroBtn}
            onPress={() => {}}>
            <Text style={styles.heroBtnText}>Fedezd fel az autókat</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* KIEMELT AUTÓK */}
      <Text style={styles.sectionTitle}>Kiemelt autóink</Text>
      <View style={styles.carGrid}>
        {autok.map(auto => (
          <View key={auto.id} style={styles.carCard}>
            <Image
  source={{ uri: backendUrl ? `${backendUrl}/img/${auto.id}_1.jpg` : undefined }}
  style={styles.carImg}
  resizeMode="cover"
/>
            
            <Text style={styles.carName}>{auto.nev} {auto.model}</Text>
            <Text style={styles.carPrice}>{auto.ar.toLocaleString()} Ft</Text>
            <TouchableOpacity
              style={styles.detailsBtn}
              onPress={() => {}}>
              <Text style={styles.detailsBtnText}>Részletek</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* RÓLUNK */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rólunk</Text>
        <Text style={styles.sectionText}>
          Üdvözlünk az <Text style={{ fontWeight: 'bold' }}>Ndidi Autókereskedésnél</Text>! Több mint egy évtizede foglalkozunk minőségi autók értékesítésével. Célunk, hogy minden ügyfelünk olyan autót találjon, amely árban és megbízhatóságban is tökéletes számára.
        </Text>
        <Text style={styles.sectionText}>
          Folyamatosan frissülő kínálatunkban csak gondosan átvizsgált, tiszta és kiváló állapotú járműveket találsz. Köszönjük, hogy minket választasz!
        </Text>
      </View>

      {/* MIÉRT MINKET VÁLASSZ? */}
      <Text style={styles.sectionTitle}>Miért válassz minket?</Text>
      <View style={styles.whyUsGrid}>
        <View style={styles.whyUsCard}>
          <Text style={styles.whyUsIcon}>🚗</Text>
          <Text style={styles.whyUsTitle}>100% átvizsgált autók</Text>
          <Text style={styles.whyUsText}>Minden jármű teljes körű ellenőrzésen megy keresztül.</Text>
        </View>
        <View style={styles.whyUsCard}>
          <Text style={styles.whyUsIcon}>⏱️</Text>
          <Text style={styles.whyUsTitle}>Valós kilométeróra</Text>
          <Text style={styles.whyUsText}>Teljesen megbízható km-óra állások minden autón.</Text>
        </View>
        <View style={styles.whyUsCard}>
          <Text style={styles.whyUsIcon}>💸</Text>
          <Text style={styles.whyUsTitle}>Kedvező árak</Text>
          <Text style={styles.whyUsText}>Versenyképes árak, mindenki számára elérhető autók.</Text>
        </View>
        <View style={styles.whyUsCard}>
          <Text style={styles.whyUsIcon}>🛠️</Text>
          <Text style={styles.whyUsTitle}>Garancia & szerviz</Text>
          <Text style={styles.whyUsText}>Minden autónkhoz garancia és átvizsgált szerviztörténet jár.</Text>
        </View>
      </View>

      {/* VÁSÁRLÓI VÉLEMÉNYEK */}
      <Text style={styles.sectionTitle}>Vásárlóink mondták</Text>
      <View style={styles.testimonialsGrid}>
        <View style={styles.testimonialCard}>
          <Text style={styles.testimonialText}>
            „Nagyon korrekt cég, az autó tökéletes állapotban volt, minden kérdésemre válaszoltak.”
          </Text>
          <Text style={styles.testimonialAuthor}>– Kovács Péter</Text>
        </View>
        <View style={styles.testimonialCard}>
          <Text style={styles.testimonialText}>
            „Gyors és egyszerű vásárlás, az autó kiváló állapotban érkezett. Csak ajánlani tudom!”
          </Text>
          <Text style={styles.testimonialAuthor}>– Szabó Anna</Text>
        </View>
        <View style={styles.testimonialCard}>
          <Text style={styles.testimonialText}>
            „Nagyon kedves személyzet, profi kiszolgálás és tiszta autók. Biztosan visszatérek!”
          </Text>
          <Text style={styles.testimonialAuthor}>– Tóth Gábor</Text>
        </View>
      </View>

      {/* TÉRKÉP */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Hol találsz minket?</Text>
        <TouchableOpacity
          style={styles.mapBtn}
          onPress={() => Linking.openURL('https://goo.gl/maps/4JvQwQwQwQwQwQwQ8')}>
          <Text style={styles.mapBtnText}>Mezőtúr térkép megnyitása</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { backgroundColor: '#f8fafc', flex: 1 },
  hero: { height: 220, backgroundColor: '#0066ff', justifyContent: 'center' },
  heroOverlay: { alignItems: 'center', padding: 24 },
  heroTitle: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  heroSubtitle: { fontSize: 16, color: '#e0e0e0', marginBottom: 16, textAlign: 'center' },
  heroBtn: { backgroundColor: '#fff', paddingHorizontal: 24, paddingVertical: 10, borderRadius: 24 },
  heroBtnText: { color: '#0066ff', fontWeight: 'bold', fontSize: 16 },
  sectionTitle: { fontSize: 24, fontWeight: 'bold', marginVertical: 20, color: '#0066ff', textAlign: 'center' },
  carGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' },
  carCard: { backgroundColor: '#fff', borderRadius: 16, margin: 8, padding: 12, width: 160, alignItems: 'center', elevation: 2 },
  carImg: { width: 120, height: 80, borderRadius: 8, marginBottom: 8 },
  carName: { fontWeight: 'bold', fontSize: 16, marginBottom: 4, color: '#1a1a2e' },
  carPrice: { color: '#0066ff', fontWeight: 'bold', marginBottom: 8 },
  detailsBtn: { backgroundColor: '#0066ff', borderRadius: 24, paddingHorizontal: 16, paddingVertical: 6 },
  detailsBtnText: { color: '#fff', fontWeight: 'bold' },
  section: { paddingHorizontal: 16, marginVertical: 16 },
  sectionText: { fontSize: 15, color: '#333', marginBottom: 8 },
  whyUsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 16 },
  whyUsCard: { backgroundColor: '#e8f0ff', borderRadius: 16, padding: 12, margin: 8, width: 150, alignItems: 'center' },
  whyUsIcon: { fontSize: 32, marginBottom: 8 },
  whyUsTitle: { fontWeight: 'bold', fontSize: 15, marginBottom: 4, color: '#1a1a2e' },
  whyUsText: { fontSize: 13, color: '#333', textAlign: 'center' },
  testimonialsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 16 },
  testimonialCard: { backgroundColor: '#f0f5ff', borderRadius: 16, padding: 12, margin: 8, width: 180, alignItems: 'center', elevation: 1 },
  testimonialText: { fontSize: 14, color: '#333', marginBottom: 8, fontStyle: 'italic', textAlign: 'center' },
  testimonialAuthor: { fontWeight: 'bold', color: '#0066ff' },
  mapBtn: { backgroundColor: '#0066ff', borderRadius: 24, padding: 12, alignItems: 'center', marginTop: 8 },
  mapBtnText: { color: '#fff', fontWeight: 'bold' },
});