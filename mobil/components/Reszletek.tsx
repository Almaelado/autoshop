import React, { useEffect, useState } from "react";
import { View, Text, Modal, StyleSheet, Image, TouchableOpacity, FlatList } from "react-native";
import { useBackend } from "@/auth/BackendProvider";
import { Dimensions } from "react-native";
import { useNavigation } from "@react-navigation/native";
import ChatAblak from "@/components/ChatAblak";
import { useAuth } from "@/auth/AuthProvider";
import { api } from "@/api/api";
const width = Dimensions.get("window").width;
type Termek = {
  id: number;
  nev: string;
  model: string;
  leiras: string;
  ar: number;
  szin_nev: string;
  km: number;
};

type Props = {
  nyitva: boolean;
  setNyitva: (value: boolean) => void;
  auto: Termek | null;
};

export default function Reszletek({ nyitva, setNyitva, auto }: Props) {
  const { backendUrl } = useBackend();
  const [kepek, setKepek] = useState<number[]>([1,2,3,4,5]);
  const [activeImageId, setActiveImageId] = useState<number>(kepek[0]);
  const flatListRef = React.useRef<FlatList<number>>(null);
  const navigation = useNavigation();
  const [chatOpen, setChatOpen] = useState(false);
  const { user, token } = useAuth();
  const [erdekelLoading, setErdekelLoading] = useState(false);
const [erdekelSuccess, setErdekelSuccess] = useState(false);
    useEffect(() => {
  if (auto && kepek.length > 0) {
    setActiveImageId(kepek[0]);
  }
}, [auto, kepek]);

    const onViewRef = React.useRef(({ viewableItems }: any) => {
  if (viewableItems.length > 0) {
    setActiveImageId(viewableItems[0].item);
  }
});
useEffect(() => {
  if (nyitva) {
    setErdekelSuccess(false);
  }
}, [nyitva]);

const viewConfigRef = React.useRef({ viewAreaCoveragePercentThreshold: 50 });

const handleErdekel = async () => {
  if (!user) {
    alert("A művelethez be kell jelentkezni!");
    return;
  }

  setErdekelLoading(true);
  setErdekelSuccess(false);

  try {
    const res = await api.get("/auto/erdekeltek");

    if (res.data.some((a: any) => a.id === auto.id)) {
      alert("Már érdeklődtél ez iránt az autó iránt!");
      return;
    }

    await api.post("/auto/erdekel", {
      autoId: auto.id,
    });

    setErdekelSuccess(true);

  } catch (err) {
    console.log(err);
    alert("Hiba történt az érdeklődés mentésekor!");
  } finally {
    setErdekelLoading(false);
  }
};

  const handleImageError = (index:number) => {
  setKepek(prev => prev.filter((_,i) => i !== index));
};
  if (!auto) return null;

  return (
    <Modal
      visible={nyitva}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setNyitva(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
        <TouchableOpacity
  style={styles.closeIcon}
  onPress={() => setNyitva(false)}
>
  <Text style={styles.closeIconText}>✕</Text>
</TouchableOpacity>
          <FlatList
  data={kepek}
  horizontal
  pagingEnabled
  showsHorizontalScrollIndicator={false}
  keyExtractor={(item) => item.toString()}
  renderItem={({ item }) => (
    <Image
      source={{ uri: `${backendUrl}/img/${auto.id}_${item}.jpg` }}
      style={styles.image}
      onError={() => handleImageError(kepek.indexOf(item))}
    />
  )}
  onMomentumScrollEnd={(event) => {
    // Számoljuk ki a scroll indexet
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / (width * 0.8 + 10)); // 10 a marginRight
    if (kepek[index] !== undefined) {
      setActiveImageId(kepek[index]);
    }
  }}
/>
<View style={styles.indicatorContainer}>
  {kepek.map((id) => (
    <View
      key={id}
      style={[styles.dot, { opacity: id === activeImageId ? 1 : 0.3 }]}
    />
  ))}
</View>
          <Text style={styles.title}>
            {auto.nev} {auto.model}
          </Text>

          <Text style={styles.price}>{auto.ar} Ft</Text>

          <Text style={styles.info}>Szín: {auto.szin_nev}</Text>
          <Text style={styles.info}>Kilométer: {auto.km} km</Text>

          <Text style={styles.desc}>{auto.leiras}</Text>

          <View style={styles.buttonsContainer}>
  <TouchableOpacity
    style={styles.interestButton}
    onPress={handleErdekel}
    disabled={erdekelLoading}
  >
    <Text style={styles.buttonText}>
      {erdekelLoading ? "Mentés..." : "Érdekel"}
    </Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={styles.messageButton}
    onPress={() => setChatOpen(true)}
  >
    <Text style={styles.buttonText}>Üzenet</Text>
  </TouchableOpacity>
</View>

{erdekelSuccess && (
  <Text style={styles.successText}>
    ✔ Hozzáadva az érdeklődésekhez!
  </Text>
)}

        </View>
      </View>
      <ChatAblak
  nyitva={chatOpen}
  setNyitva={setChatOpen}
  autoId={auto?.id}
  vevoId={user?.id}
/>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
  width: "90%",
  backgroundColor: "white",
  borderRadius: 15,
  padding: 20,
  paddingTop: 40,
},
  image: {
  width: width * 0.8,
  height: 200,
  borderRadius: 10,
  marginRight: 10,
},
  title: {
    fontSize: 22,
    fontWeight: "bold",
  },
  price: {
    fontSize: 20,
    color: "#4f46e5",
    marginVertical: 5,
  },
  info: {
    fontSize: 14,
    color: "#555",
  },
  desc: {
    marginTop: 10,
    fontSize: 14,
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#4f46e5",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  closeText: {
    color: "white",
    fontWeight: "bold",
  },indicatorContainer: {
  flexDirection: "row",
  justifyContent: "center",
  marginTop: 10,
},
dot: {
  width: 8,
  height: 8,
  borderRadius: 4,
  backgroundColor: "#4f46e5",
  marginHorizontal: 4,
},
buttonsContainer: {
  flexDirection: "row",
  justifyContent: "space-between",
  marginTop: 20,
},

interestButton: {
  flex: 1,
  backgroundColor: "#22c55e",
  padding: 12,
  borderRadius: 8,
  alignItems: "center",
  marginRight: 5,
},

messageButton: {
  flex: 1,
  backgroundColor: "#3b82f6",
  padding: 12,
  borderRadius: 8,
  alignItems: "center",
  marginLeft: 5,
},

buttonText: {
  color: "white",
  fontWeight: "bold",
},closeIcon: {
  position: "absolute",
  top: 10,
  right: 10,
  zIndex: 10,
  width: 30,
  height: 30,
  borderRadius: 15,
  backgroundColor: "#eee",
  justifyContent: "center",
  alignItems: "center",
},

closeIconText: {
  fontSize: 18,
  fontWeight: "bold",
  color: "#333",
},successText: {
  color: "#16a34a",
  marginTop: 10,
  textAlign: "center",
  fontWeight: "600",
},
});