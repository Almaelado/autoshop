import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { api } from "@/api/api";
import { useBackend } from "@/auth/BackendProvider";
import { useAuth } from "@/auth/AuthProvider";

type Props = {
  nyitva: boolean;
  setNyitva: (value: boolean) => void;
  autoId: number;
  vevoId: number;
  accessToken?: string; // ha nincs token, login modal jelenik meg
};

type Message = {
  uzenet_text: string;
  elkuldve: string;
  valasz?: string;
  valasz_datum?: string;
};

export default function ChatAblak({
  nyitva,
  setNyitva,
  autoId,
  vevoId,
  accessToken,
}: Props) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [rendezett, setRendezett] = useState<[string, string, boolean][]>([]);
  const [ujUzenet, setUjUzenet] = useState("");
  const { backendUrl } = useBackend();
  const { user, token } = useAuth();
  const showLoginModal = !user; // Ha nincs bejelentkezett user, mutasd a login üzenetet

  useEffect(() => {
    if (user) fetchChatMessages();
  }, [user]);

  useEffect(() => {
    const ujRendezett: [string, string, boolean][] = [];
    for (let i = 0; i < messages.length; i++) {
      const msg = messages[i];
      if (msg.valasz) {
        ujRendezett.push([msg.uzenet_text, msg.elkuldve, false]);
        ujRendezett.push([msg.valasz, msg.valasz_datum || "", true]);
      } else {
        ujRendezett.push([msg.uzenet_text, msg.elkuldve, false]);
      }
    }
    ujRendezett.sort(
      (a, b) => new Date(a[1]).getTime() - new Date(b[1]).getTime()
    );
    setRendezett(ujRendezett);
  }, [messages]);

  const fetchChatMessages = async () => {
    setLoading(true);
    try {
      const response = await api.get("/auto/chatablak", {
        headers: { Authorization: `Bearer ${token}` },
        params: { vevoId, autoId },
      });
      setMessages(response.data);
    } catch (error) {
      console.error("Hiba a chat üzenetek lekérdezésekor:", error);
    } finally {
      setLoading(false);
    }
  };

  const kuldUzenet = async () => {
    if (!ujUzenet.trim()) {
      alert("Üzenet mező nem lehet üres!");
      return;
    }
    try {
      await api.post(
        "/auto/felhasznalo/chatablak",
        { vevoId, autoId, uzenet_text: ujUzenet },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUjUzenet("");
      fetchChatMessages();
    } catch (error) {
      console.error("Hiba az üzenet küldésekor:", error);
    }
  };

  const renderItem = ({ item, index }: { item: [string, string, boolean]; index: number }) => {
    const [text, date, isAdmin] = item;
    return (
      <View key={index} style={[styles.messageRow, isAdmin ? styles.right : styles.left]}>
        <View style={[styles.messageBubble, isAdmin ? styles.adminBubble : styles.userBubble]}>
          <Text style={styles.messageText}>{text}</Text>
          <Text style={styles.messageDate}>{new Date(date).toLocaleString()}</Text>
        </View>
      </View>
    );
  };

  return (
    <Modal visible={nyitva} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[styles.container, showLoginModal && styles.loginContainer]}>
          {!user ? (
  <>
    <Text style={styles.centeredText}>
      A chat használatához be kell jelentkezni.
    </Text>
    <TouchableOpacity
      style={[styles.sendButton, { alignSelf: "center", marginTop: 20 }]}
      onPress={() => setNyitva(false)}
    >
      <Text style={styles.sendButtonText}>Bezárás</Text>
    </TouchableOpacity>
  </>
) : (
            <>
              <View style={styles.header}>
                <TouchableOpacity onPress={() => setNyitva(false)}>
                  <Text style={styles.backButton}>Vissza</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Chatablak</Text>
                <View style={{ width: 50 }} />
              </View>

              {loading ? (
                <ActivityIndicator size="large" color="#4f46e5" style={{ flex: 1 }} />
              ) : rendezett.length === 0 ? (
                <Text style={{ textAlign: "center", marginTop: 20 }}>Nincsenek üzenetek.</Text>
              ) : (
                <FlatList
                  data={rendezett}
                  renderItem={renderItem}
                  keyExtractor={(_, i) => i.toString()}
                  contentContainerStyle={{ padding: 10 }}
                />
              )}

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Írj egy üzenetet..."
                  value={ujUzenet}
                  onChangeText={setUjUzenet}
                  onSubmitEditing={kuldUzenet}
                />
                <TouchableOpacity style={styles.sendButton} onPress={kuldUzenet}>
                  <Text style={styles.sendButtonText}>Küldés</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { 
    flex: 1, 
    backgroundColor: "rgba(0,0,0,0.5)", 
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  container: { 
    width: "90%",               
    maxHeight: "80%",           
    backgroundColor: "white", 
    borderRadius: 10, 
    overflow: "hidden",
    paddingBottom: 20,
  },
  loginContainer: {
    paddingVertical: 60,         // extra tér felül és alul
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  header: { 
    flexDirection: "row", 
    alignItems: "center", 
    justifyContent: "space-between", 
    padding: 10, 
    backgroundColor: "#4f46e5" 
  },
  backButton: { color: "white", fontWeight: "bold" },
  headerTitle: { color: "white", fontWeight: "bold", fontSize: 18 },
  messageRow: { marginVertical: 5, flexDirection: "row" },
  left: { justifyContent: "flex-start" },
  right: { justifyContent: "flex-end" },
  messageBubble: { maxWidth: "75%", padding: 10, borderRadius: 10 },
  userBubble: { backgroundColor: "#e5e7eb" },
  adminBubble: { backgroundColor: "#4f46e5" },
  messageText: { color: "black" },
  messageDate: { fontSize: 10, color: "#555", marginTop: 5 },
  inputContainer: { flexDirection: "row", padding: 10, borderTopWidth: 1, borderColor: "#ddd" },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 20, paddingHorizontal: 15, height: 40 },
  sendButton: { backgroundColor: "#4f46e5", borderRadius: 20, paddingHorizontal: 15, justifyContent: "center", marginLeft: 5 },
  sendButtonText: { color: "white", fontWeight: "bold" },
  centeredText: {
    textAlign: "center",
    fontSize: 16,
  },
});