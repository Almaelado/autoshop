import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, useColorScheme } from 'react-native';
import { useAuth } from '@/auth/AuthProvider';

export default function Profile() {
  const { user, logout } = useAuth();
  const colorScheme = useColorScheme(); // light vagy dark
  const isDark = colorScheme === 'dark';

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#121212' : '#f5f5f5' }]}>
      <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>Profil</Text>

      {/* 👇 Színezett adatok */}
      <Text style={[styles.text, { color: isDark ? '#ddd' : '#333' }]}>
        Email: {user?.email}
      </Text>

      <Text style={[styles.text, { color: isDark ? '#ddd' : '#333' }]}>
        Név: {user?.name}
      </Text>

      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutText}>Kijelentkezés</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    marginBottom: 8,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});