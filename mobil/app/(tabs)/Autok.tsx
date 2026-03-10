import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Dimensions,
  Button,
} from 'react-native';
import { api,getBackendCim } from '@/api/api';
import Szures from '@/components/Szures';
import Reszletek from '@/components/Reszletek';
import { useBackend } from '@/auth/BackendProvider';


const PAGE_SIZE = 10;
const screenWidth = Dimensions.get('window').width;
const cardWidth = screenWidth / 2 - 20; // 2 kártya egymás mellett


type Termek = {
  id: number;
  nev: string;
  model: string;
  leiras: string;
  ar: number;
  szin_nev: string;
  km: number;
};

export default function AutokMobile() {
  const [data, setData] = useState<Termek[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<any>({});
  const { backendUrl } = useBackend();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedAuto, setSelectedAuto] = useState<Termek | null>(null);

  // ----- Szűrés kezelése -----
  const handleSearch = (filters: any) => {
    setCurrentFilters(filters);
    loadPage(1, true, filters);
  };

  // ----- Oldalak betöltése -----
  const loadPage = async (pageNum: number, refresh = false, filters: any = {}) => {
    if (loading) return;

    console.log("API baseURL:", api.defaults.baseURL);
    console.log("Backend state:", backendUrl);
    setLoading(true);
    try {
      const response = await api.post<Termek[]>('/auto/szuro', {
        ...filters,
        limit: PAGE_SIZE,
        page: pageNum,
        keres: filters.keres || "",
      });

      const newData = response.data;
      if (newData.length < PAGE_SIZE) setHasMore(false);

      setData(prev => (refresh ? newData : [...prev, ...newData]));
      setPage(pageNum);
    } catch (err) {
      console.error("Hiba a betöltésnél:", err);
    } finally {
      setLoading(false);
    }
  };

  // ----- Infinite scroll -----
  const loadMore = () => {
    if (hasMore && !loading) loadPage(page + 1, false, currentFilters);
  };

  useEffect(() => {
  if (backendUrl) {
    loadPage(1, true, currentFilters);
  }
}, [backendUrl]);

  // ----- Render Item -----
  const renderItem = ({ item }: { item: Termek }) => (
    <TouchableOpacity style={styles.card} onPress={() => {
    setSelectedAuto(item);
    setDetailsOpen(true);
  }}>
      <Image
  source={{ uri: backendUrl ? `${backendUrl}/img/${item.id}_1.jpg` : undefined }}
  style={styles.image}
/>
      <View style={styles.cardBody}>
        <Text style={styles.title}>{item.nev} {item.model}</Text>
        <Text style={styles.leiras} numberOfLines={2}>{item.leiras}</Text>
        <Text style={styles.info}>Szín: {item.szin_nev}</Text>
        <Text style={styles.info}>{item.km} km</Text>
      </View>
      <View style={styles.cardFooter}>
        <Text style={styles.price}>{item.ar} Ft</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Autóink</Text>

      <View style={{ flex: 1 }}>
        <Button title="Szűrők megnyitása" onPress={() => setFilterOpen(true)} />

        <Szures
          nyitva={filterOpen}
          setNyitva={setFilterOpen}
          onSearch={handleSearch}
        />
        <Reszletek
          nyitva={detailsOpen}
          setNyitva={setDetailsOpen}
          auto={selectedAuto}
        />

        <FlatList
          data={data}
          keyExtractor={item => item.id.toString()}
          renderItem={renderItem}
          numColumns={2}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={loading ? <ActivityIndicator style={{ margin: 20 }} /> : null}
          columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 15 }}
          contentContainerStyle={{ paddingHorizontal: 10, paddingBottom: 20 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e9ecef',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    margin: 15,
    textAlign: 'center',
  },
  card: {
    backgroundColor: '#fff',
    width: cardWidth,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  image: {
    width: '100%',
    height: 140,
    resizeMode: 'cover',
  },
  cardBody: {
    padding: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  leiras: {
    fontSize: 12,
    color: '#555',
    marginBottom: 5,
  },
  info: {
    fontSize: 12,
    color: '#777',
  },
  cardFooter: {
    backgroundColor: '#4f46e5',
    paddingVertical: 8,
    alignItems: 'center',
  },
  price: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});