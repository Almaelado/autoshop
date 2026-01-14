import { useState, useEffect } from "react";
import { View, Text, Image, FlatList, ScrollView, Pressable, ActivityIndicator, StyleSheet } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import http from "../../http-common"; // ha van API service
import { useAuth } from "../../hooks/useAuth"; // token logika

export default function CarDetailsScreen() {
  const { id: autoId } = useLocalSearchParams();
  const { accessToken, onLoginModalOpen } = useAuth(); // saját auth hook
  const [auto, setAuto] = useState(null);
  const [kepek, setKepek] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [ajanlott, setAjanlott] = useState<any[]>([]);
  const [erdekelLoading, setErdekelLoading] = useState(false);
  const [erdekelSuccess, setErdekelSuccess] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Auto adatok
  useEffect(() => {
    if (!autoId) return;
    setLoading(true);
    const fetchAuto = async () => {
      try {
        const res = await http.get(`auto/egy/${autoId}`);
        setAuto(res.data);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Nem sikerült betölteni az autót");
      } finally {
        setLoading(false);
      }
    };
    fetchAuto();
  }, [autoId]);

  // Kepek betöltése
  useEffect(() => {
    if (!autoId) return;
    const maxImages = 20;
    const images: string[] = [];
    for (let i = 1; i <= maxImages; i++) {
      images.push(`http://<SERVER_IP>/img/${autoId}_${i}.jpg`); // mobilon localhost nem megy
    }
    setKepek(images);
  }, [autoId]);

  // Ajánlott autók
  useEffect(() => {
    if (!auto || !autoId) return;
    const fetchAjanlott = async () => {
      try {
        const res = await http.get(`auto/ajanlott/${auto.nev}?kiveve=${autoId}`);
        setAjanlott(res.data || []);
      } catch (err) {
        setAjanlott([]);
        console.error(err);
      }
    };
    fetchAjanlott();
  }, [auto, autoId]);

  const handleErdekel = async () => {
    if (!accessToken) {
      if (onLoginModalOpen) {
        onLoginModalOpen();
      } else {
        setShowLoginPrompt(true);
      }
      return;
    }

    setErdekelLoading(true);
    setErdekelSuccess(false);
    setShowLoginPrompt(false);

    try {
      await http.post(
        "/auto/erdekel",
        { autoId: Number(autoId) },
        { headers: { Authorization: `Bearer ${accessToken}` }, withCredentials: true }
      );
      setErdekelSuccess(true);
    } catch (err) {
      console.error(err);
      setErdekelSuccess(false);
    } finally {
      setErdekelLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Betöltés...</Text>
      </View>
    );
  }

  if (error || !auto) {
    return (
      <View style={styles.center}>
        <Text>{error || "Hiba történt az adatok betöltésekor"}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Érdekel / Üzenet */}
      <View style={styles.buttonRow}>
        <Pressable style={[styles.button, styles.greenButton]} onPress={handleErdekel} disabled={erdekelLoading}>
          <Text style={styles.buttonText}>{erdekelLoading ? "Mentés..." : "Érdekel"}</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.blueButton]} onPress={() => router.push(`/uzenet/${autoId}`)}>
          <Text style={styles.buttonText}>Üzenet</Text>
        </Pressable>
      </View>
      {erdekelSuccess && <Text style={styles.successText}>Hozzáadva az érdeklődésekhez!</Text>}
      {showLoginPrompt && <Text style={styles.errorText}>Jelentkezz be az érdeklődéshez!</Text>}

      {/* Carousel */}
      <FlatList
        data={kepek}
        horizontal
        pagingEnabled
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item }) => (
          <Image source={{ uri: item }} style={styles.image} />
        )}
        style={{ marginVertical: 16 }}
        showsHorizontalScrollIndicator={false}
      />

      {/* Auto adatok */}
      <View style={styles.infoBox}>
        <Text style={styles.title}>{auto.nev} {auto.model}</Text>
        <Text style={styles.description}>{auto.leírás}</Text>
        <View style={styles.specsRow}>
          <View style={styles.spec}>
            <Text style={styles.label}>Szín</Text>
            <Text style={styles.value}>{auto.szin_nev}</Text>
          </View>
          <View style={styles.spec}>
            <Text style={styles.label}>Kilométer</Text>
            <Text style={styles.value}>{auto.km?.toLocaleString()} km</Text>
          </View>
          <View style={styles.spec}>
            <Text style={styles.label}>Ár</Text>
            <Text style={styles.value}>{auto.ar?.toLocaleString()} Ft</Text>
          </View>
          <View style={styles.spec}>
            <Text style={styles.label}>Évjárat</Text>
            <Text style={styles.value}>{auto.kiadasiev || '-'}</Text>
          </View>
          <View style={styles.spec}>
            <Text style={styles.label}>Üzemanyag</Text>
            <Text style={styles.value}>{auto.üzemanyag || '-'}</Text>
          </View>
          <View style={styles.spec}>
            <Text style={styles.label}>Váltó</Text>
            <Text style={styles.value}>{auto.váltó || '-'}</Text>
          </View>
        </View>
      </View>

      {/* Ajánlott autók */}
      {ajanlott.length > 0 && (
        <View style={{ marginVertical: 16 }}>
          <Text style={styles.subTitle}>Hasonló autók</Text>
          <FlatList
            data={ajanlott}
            horizontal
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <Pressable
                style={styles.recommendCard}
                onPress={() => {
                  if (item.id !== Number(autoId)) router.push(`/cars/${item.id}`);
                }}
              >
                <Image source={{ uri: `http://<SERVER_IP>/img/${item.id}_1.jpg` }} style={styles.recommendImage} />
                <Text style={styles.recommendName}>{item.nev} {item.model}</Text>
                <Text style={styles.recommendPrice}>{item.ar?.toLocaleString()} Ft</Text>
              </Pressable>
            )}
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  buttonRow: { flexDirection: "row", justifyContent: "space-between", marginVertical: 8 },
  button: { flex: 1, padding: 12, borderRadius: 6, marginHorizontal: 4, alignItems: "center" },
  greenButton: { backgroundColor: "#28a745" },
  blueButton: { backgroundColor: "#007bff" },
  buttonText: { color: "white", fontWeight: "600" },
  successText: { color: "green", marginVertical: 4 },
  errorText: { color: "red", marginVertical: 4 },
  image: { width: 300, height: 200, marginRight: 8, borderRadius: 8 },
  infoBox: { marginTop: 16 },
  title: { fontSize: 22, fontWeight: "700" },
  subTitle: { fontSize: 18, fontWeight: "600", marginBottom: 8 },
  description: { fontSize: 14, marginVertical: 8 },
  specsRow: { flexDirection: "row", flexWrap: "wrap", justifyContent: "space-between" },
  spec: { width: "48%", marginVertical: 4 },
  label: { fontSize: 12, color: "#555" },
  value: { fontSize: 14, fontWeight: "600" },
  recommendCard: { marginRight: 12, width: 140 },
  recommendImage: { width: 140, height: 80, borderRadius: 6 },
  recommendName: { fontSize: 12, fontWeight: "600" },
  recommendPrice: { fontSize: 12, color: "green" },
});
