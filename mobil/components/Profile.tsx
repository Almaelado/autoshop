import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, TextInput, ActivityIndicator } from "react-native";
import { useAuth } from "@/auth/AuthProvider";
import { api } from "@/api/api";
import { useNavigation } from "@react-navigation/native";
import { useBackend } from "@/auth/BackendProvider";

type Auto = {
  id: number;
  nev: string;
  model: string;
  ar: number;
};

export default function Profile() {
  const { user, logout, token } = useAuth();
  const { backendUrl } = useBackend();
  const navigation = useNavigation();
  const [erdekeltek, setErdekeltek] = useState<Auto[]>([]);
  const [loading, setLoading] = useState(false);

  // Minden autóhoz külön üzenet és siker állapot
  const [uzenetek, setUzenetek] = useState<{ [id: number]: string }>({});
  const [successes, setSuccesses] = useState<{ [id: number]: boolean }>({});
  const [sendingIds, setSendingIds] = useState<{ [id: number]: boolean }>({});

  // Lekérjük az érdeklődött autókat
  useEffect(() => {
    if (!token) return;

    const fetchErdekeltek = async () => {
      setLoading(true);
      try {
        const res = await api.get("/auto/erdekeltek", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setErdekeltek(res.data || []);
      } catch (err) {
        console.error("Hiba az érdeklődések lekérésekor:", err);
        setErdekeltek([]);
      } finally {
        setLoading(false);
      }
    };

    fetchErdekeltek();
  }, [token]);

  // Üzenet küldés autóhoz
  const handleSendMessage = async (autoId: number) => {
    const uzenet = uzenetek[autoId];
    if (!uzenet) return;

    setSendingIds((prev) => ({ ...prev, [autoId]: true }));
    setSuccesses((prev) => ({ ...prev, [autoId]: false }));

    try {
      await api.post(
        "/auto/uzenet",
        { autoId, uzenet },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccesses((prev) => ({ ...prev, [autoId]: true }));
      setUzenetek((prev) => ({ ...prev, [autoId]: "" }));
    } catch (err) {
      console.error("Hiba az üzenet küldésekor:", err);
    } finally {
      setSendingIds((prev) => ({ ...prev, [autoId]: false }));
    }
  };

  const renderAuto = ({ item }: { item: Auto }) => {
    const sending = sendingIds[item.id] || false;
    const success = successes[item.id] || false;
    const uzenet = uzenetek[item.id] || "";

    return (
      <View style={styles.autoCard}>
        <Image
          source={{ uri: `${backendUrl}/img/${item.id}_1.jpg` }}
          style={styles.autoImage}
        />
        <View style={styles.autoInfo}>
          <Text style={styles.autoName}>{item.nev} {item.model}</Text>
          <Text style={styles.autoPrice}>{item.ar?.toLocaleString()} Ft</Text>

          <TextInput
            style={styles.messageInput}
            placeholder="Írd az üzenetet..."
            value={uzenet}
            onChangeText={(text) =>
              setUzenetek((prev) => ({ ...prev, [item.id]: text }))
            }
          />

          <TouchableOpacity
            style={styles.sendButton}
            onPress={() => handleSendMessage(item.id)}
            disabled={sending}
          >
            <Text style={styles.sendButtonText}>
              {sending ? "Küldés..." : "Küldés"}
            </Text>
          </TouchableOpacity>

          {success && <Text style={styles.successText}>✔ Üzenet elküldve!</Text>}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profil</Text>
      <Text style={styles.label}>Email:</Text>
      <Text style={styles.email}>{user?.email || "-"}</Text>

      <Text style={styles.sectionTitle}>Érdeklődéseim</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4f46e5" />
      ) : erdekeltek.length === 0 ? (
        <Text>Nincs még érdeklődésed.</Text>
      ) : (
        <FlatList
          data={erdekeltek}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderAuto}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      )}

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Kijelentkezés</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16 },
  label: { fontSize: 16, fontWeight: "600" },
  email: { fontSize: 16, marginBottom: 24 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  autoCard: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    marginBottom: 16,
    padding: 12,
  },
  autoImage: { width: 80, height: 60, borderRadius: 6, marginRight: 12 },
  autoInfo: { flex: 1 },
  autoName: { fontSize: 16, fontWeight: "bold" },
  autoPrice: { color: "#4f46e5", fontWeight: "600", marginBottom: 8 },
  messageInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    marginBottom: 8,
  },
  sendButton: {
    backgroundColor: "#3b82f6",
    padding: 8,
    borderRadius: 6,
    alignItems: "center",
  },
  sendButtonText: { color: "#fff", fontWeight: "600" },
  successText: { color: "#16a34a", marginTop: 4 },
  logoutButton: {
    marginTop: 24,
    backgroundColor: "#ef4444",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  logoutText: { color: "#fff", fontWeight: "600", fontSize: 16 },
});