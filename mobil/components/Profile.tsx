import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image, TextInput, ActivityIndicator } from "react-native";
import { useAuth } from "@/auth/AuthProvider";
import { api } from "@/api/api";
import { useNavigation } from "@react-navigation/native";
import { useBackend } from "@/auth/BackendProvider";
import ChatAblak from "./ChatAblak";

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
const [expanded, setExpanded] = useState(false);
  // Minden autóhoz külön üzenet és siker állapot
  const [uzenetek, setUzenetek] = useState<{ [id: number]: string }>({});
  const [successes, setSuccesses] = useState<{ [id: number]: boolean }>({});
  const [sendingIds, setSendingIds] = useState<{ [id: number]: boolean }>({});
  const [messagesExpanded, setMessagesExpanded] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
const [selectedAutoId, setSelectedAutoId] = useState<number | null>(null);

type Uzenet = {
  nev: string;       
  model: string;   
  ar: number;
  elkuldve: string;
  uzenet_text: string;
  auto_id: number;
  vevo_id: number;
};
const openChat = (autoId: number) => {
  setChatOpen(false);          
  setSelectedAutoId(autoId);   
  setTimeout(() => setChatOpen(true), 50); 
};
const [messages, setMessages] = useState<Uzenet[]>([]);
const [messagesLoading, setMessagesLoading] = useState(false);
const fetchMessages = async () => {
  setMessagesLoading(true);
  try {
    const res = await api.get("/auto/uzenetek", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setMessages(res.data || []);
  } catch (err) {
    console.error("Hiba üzenetek lekérésekor:", err);
    setMessages([]);
  } finally {
    setMessagesLoading(false);
  }
};
const renderMessage = ({ item }: { item: Uzenet }) => (
  <View style={styles.messageCardContainer}>
    <Image
      source={{ uri: `${backendUrl}/img/${item.auto_id}_1.jpg` }}
      style={styles.messageAutoImage}
    />
    <View style={styles.messageInfo}>
      <View style={styles.messageHeader}>
        <View>
          <Text style={styles.messageTitle}>{item.nev} {item.model}</Text>
          <Text style={styles.messagePrice}>{item.ar?.toLocaleString()} Ft</Text>
        </View>
        <Text style={styles.messageDate}>{item.elkuldve}</Text>
      </View>
      <Text style={styles.messageText}>{item.uzenet_text}</Text>
      <TouchableOpacity
        style={styles.openChatButton}
        onPress={() => openChat(item.auto_id)}
      >
        <Text style={styles.openChatText}>Megnyitás</Text>
      </TouchableOpacity>
    </View>
  </View>
);

useEffect(() => {
  if (messagesExpanded) {
    fetchMessages();
  }
}, [messagesExpanded]);
  useEffect(() => {
  const fetchErdekeltek = async () => {
    setLoading(true);
    try {
      const res = await api.get("/auto/erdekeltek");

      console.log("EREDMÉNY:", res.data);

      setErdekeltek(res.data || []);
    } catch (err) {
      console.error("Hiba:", err.response?.data || err.message);
      setErdekeltek([]);
    } finally {
      setLoading(false);
    }
  };

  fetchErdekeltek();
}, []);

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
      <View style={styles.profileAvatar}>
  <Text style={styles.profileAvatarText}>
    {user?.email?.charAt(0).toUpperCase() || "U"}
  </Text>
</View>
<Text style={styles.label}>Email:</Text>
<Text style={styles.email}>{user?.email || "-"}</Text>
      

      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
  <Text style={styles.sectionTitle}>
    Érdeklődéseim {expanded ? "▲" : "▼"}
  </Text>
</TouchableOpacity>

      {expanded && (
  loading ? (
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
  )
)}
<TouchableOpacity onPress={() => setMessagesExpanded(!messagesExpanded)}>
  <Text style={styles.sectionTitle}>
    Üzeneteim {messagesExpanded ? "▲" : "▼"}
  </Text>
</TouchableOpacity>

{messagesExpanded && (
  messagesLoading ? (
    <ActivityIndicator size="large" color="#4f46e5" />
  ) : messages.length === 0 ? (
    <Text>Nincsenek üzeneteid.</Text>
  ) : (
    <FlatList
      data={messages}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderMessage}
      contentContainerStyle={{ paddingBottom: 20 }}
    />
  )
)}

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Kijelentkezés</Text>
      </TouchableOpacity>
      {selectedAutoId !== null && (
  <ChatAblak
    key={selectedAutoId}       // ← Ezt hozzáadjuk!
    nyitva={chatOpen}
    setNyitva={setChatOpen}
    autoId={selectedAutoId}
    vevoId={user?.id || 0}
  />
)}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f9fafb",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 16,
    color: "#111827",
    textAlign: "center",
    fontFamily: "System",
  },
  profileAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#3b82f6",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    alignSelf: "center",
  },
  profileAvatarText: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "bold",
    fontFamily: "System",
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#374151",
    textAlign: "center",
    fontFamily: "System",
  },
  email: {
    fontSize: 16,
    marginBottom: 24,
    color: "#1f2937",
    textAlign: "center",
    fontFamily: "System",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginVertical: 12,
    color: "#1e40af",
    fontFamily: "System",
  },

  // Autó kártyák körrel
  autoCard: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderRadius: 20,
    marginBottom: 16,
    padding: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  autoImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  autoInfo: { flex: 1 },
  autoName: { fontSize: 16, fontWeight: "600", color: "#111827", fontFamily: "System" },
autoPrice: { 
  color: "#f97316", // narancssárga
  fontWeight: "700", // vastagabb betű
  marginBottom: 6, 
  fontSize: 16,
  fontFamily: "System",
},

  // Üzenet input
  messageInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    borderRadius: 25,
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
    backgroundColor: "#f3f4f6",
    fontFamily: "System",
  },
  sendButton: {
    backgroundColor: "#2563eb",
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: "center",
    marginBottom: 4,
  },
  sendButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
    fontFamily: "System",
  },
  successText: { color: "#16a34a", marginTop: 4, fontSize: 13, fontFamily: "System" },

  logoutButton: {
    marginTop: 24,
    backgroundColor: "#ef4444",
    paddingVertical: 14,
    borderRadius: 25,
    alignItems: "center",
  },
  logoutText: { color: "#fff", fontWeight: "700", fontSize: 16, fontFamily: "System" },

  // Üzenet buborékok
  messageCard: {
    backgroundColor: "#e0e7ff",
    padding: 14,
    borderRadius: 20,
    marginBottom: 12,
    alignSelf: "flex-start",
    maxWidth: "80%",
    borderWidth: 1,          // kis border hozzáadva
    borderColor: "#c7d2fe",  // halvány lila szín
  },
  messageCardRight: {
    backgroundColor: "#2563eb",
    padding: 14,
    borderRadius: 20,
    marginBottom: 12,
    alignSelf: "flex-end",
    maxWidth: "80%",
    borderWidth: 1,
    borderColor: "#1e40af",
  },
messageText: {
  color: "#374151",
  fontSize: 15,        // kicsit nagyobb betűméret
  fontWeight: "600",   // vastagabb betű
  fontFamily: "System",
},
messageTextRight: {
  color: "#fff",
  fontSize: 15,
  fontWeight: "600",
  fontFamily: "System",
},// Üzenetek kártyák stílusai, hasonló az autókhoz
messageCardContainer: {
  flexDirection: "row",
  backgroundColor: "#ffffff",
  borderRadius: 20,
  marginBottom: 16,
  padding: 12,
  alignItems: "center",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
},
messageAutoImage: {
  width: 60,
  height: 60,
  borderRadius: 30,
  marginRight: 12,
},
messageInfo: { flex: 1 },
messageHeader: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginBottom: 6,
},
messageTitle: { fontSize: 16, fontWeight: "600", color: "#111827", fontFamily: "System" },
messagePrice: { color: "#f97316", fontWeight: "700", fontSize: 16, fontFamily: "System" },
messageDate: { fontSize: 12, color: "#6b7280", fontFamily: "System" },
messageText: { fontSize: 14, color: "#374151", fontFamily: "System", marginBottom: 6 },
openChatButton: {
  backgroundColor: "#2563eb",
  paddingVertical: 6,
  borderRadius: 20,
  alignItems: "center",
  alignSelf: "flex-start",
  paddingHorizontal: 12,
},
openChatText: { color: "#fff", fontWeight: "600", fontSize: 14, fontFamily: "System" },
});