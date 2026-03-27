import React, { createContext, useContext, useState, ReactNode } from "react";
import { api, setAccessToken} from "../api/api"; // itt legyen a jwt/axios logika
import { Alert } from 'react-native';

interface AuthContextType {
  user: { email: string, name: string } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<{ email: string,name:string } | null>(null);
  const fetchUserProfile = async (token: string) => {
    try {
      // Login utan a profil vegponttol kerjuk le a teljes felhasznaloi adatokat.
      const res = await api.get("/auto/profil", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return res.data;
    } catch (error) {
      console.error("Profile fetch failed", error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post("/auto/login", { email, password }, { withCredentials: true });
      const token = res.data.accessToken;
      setAccessToken(token);
      Alert.alert(token);
       // A context akkor tekinti bejelentkezettnek a usert, ha a profil is betoltott.
       const userProfile = await fetchUserProfile(token);
       setUser(userProfile); // Beállítjuk a teljes felhasználói profilt
    } catch (error: any) {
      Alert.alert('Hibás belépés');
      // Alert.alert('Hibás belépés', error.message);
      // console.error("Login failed", error);
      //throw error;
    }
  };

  const logout = async () => {
    // Logoutnal a cookie es a lokalis auth allapot egyszerre nullazodik.
    await api.post("/auto/logout", {}, { withCredentials: true });
    setAccessToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
