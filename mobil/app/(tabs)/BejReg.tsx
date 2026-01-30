import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import {useRouter} from 'expo-router';

export default function BejReg() {
  const [vizsg, setVizsg] = React.useState(false);
  const backendUrl = process.env.EXPO_PUBLIC_BACKEND_URL;
  const router = useRouter();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = () => {

    if (vizsg) {
      // Regisztráció logika
      axios.post(`${backendUrl}/auto/regisztracio`, {
        email: email,
        password: password,
      })
      .then(response => {
        console.log('Regisztráció sikeres:', response.data);
        setVizsg(false);
      })
      .catch(error => {
        console.error('Regisztráció hiba:', error);
      });
    } else {
      // Bejelentkezés logika
      axios.post(`${backendUrl}/auto/login`, {
        email: email,
        password: password,
      })
      .then(response => {
        console.log('Bejelentkezés sikeres:', response.data);
        router.replace('/');
      })
      .catch(error => {
        console.error('Bejelentkezés hiba:', error);
        alert('Bejelentkezési hiba! Ellenőrizd az adataidat.');
      });
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
        onChangeText={setEmail}
    
      />

      <TextInput
        style={styles.input}
        placeholder="Jelszó"
        secureTextEntry
        onChangeText={setPassword}
      />

      {vizsg && (
        <TextInput
          style={styles.input}
          placeholder="Jelszó újra"
          secureTextEntry
        />
      )}

      <TouchableOpacity style={styles.primaryButton} onPress={handleSubmit}>
        <Text style={styles.primaryButtonText}>
          {vizsg ? 'Regisztráció' : 'Bejelentkezés'}
        </Text>
      </TouchableOpacity>

      <Text style={styles.infoText}>
        {vizsg ? 'Ha már van fiókod' : 'Ha még nincs fiókod'}
      </Text>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => setVizsg(!vizsg)}
      >
        <Text style={styles.secondaryButtonText}>
          {vizsg ? 'Bejelentkezés' : 'Regisztráció'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#f5f5f5',
  },

  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    fontSize: 16,
  },

  primaryButton: {
    backgroundColor: '#4f46e5',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },

  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  secondaryButton: {
    marginTop: 16,
    alignItems: 'center',
  },

  secondaryButtonText: {
    color: '#4f46e5',
    fontSize: 14,
    fontWeight: '500',
  },

  infoText: {
    textAlign: 'center',
    marginTop: 12,
    color: '#555',
  },
});
