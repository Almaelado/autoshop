import React, { useEffect, useState } from 'react';
import { View, Text, Image, ActivityIndicator, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';

const Listazo = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Adatok lekérése az API-ból useEffect segítségével
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://fakestoreapi.com/products');
      setData(response.data); // Adatok tárolása az állapotban
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false); // Töltés leállítása
    }
  };

  if (loading) {
    return (
      <View>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View>
      <Text style={styles.text}>Terméklista</Text>

      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ margin: 10, backgroundColor: 'white' }}>
            <Text style={{ fontSize: 20, color: 'silver' }}>{item.id}. {item.title}</Text>
            <Image
              source={{ uri: item.image }}
              style={styles.image}
            />
            <Text style={{ fontSize: 16, color: 'black' }}>Ár: {item.price}$</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    color: 'black',
    textAlign: 'center'
  },
  image: {
    height: 200,      
    resizeMode: 'contain', 
  },
});


export default Listazo;
