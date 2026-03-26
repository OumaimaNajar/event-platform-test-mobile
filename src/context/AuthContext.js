import React, { createContext, useContext, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { setAuthToken } from "../services/api";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [client, setClient] = useState(null);
  const [token, setToken] = useState(null);

  const loadStoredAuth = async () => {
    try {
      const savedToken = await AsyncStorage.getItem("token");
      const savedClient = await AsyncStorage.getItem("client");
      if (savedToken && savedClient) {
        setToken(savedToken);
        setClient(JSON.parse(savedClient));
        setAuthToken(savedToken);
      }
    } catch (err) {
      console.log("Erreur chargement auth:", err);
    }
  };

  const login = async (newToken, newClient) => {
    await AsyncStorage.setItem("token", newToken);
    await AsyncStorage.setItem("client", JSON.stringify(newClient));
    setAuthToken(newToken);
    setToken(newToken);
    setClient(newClient);
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("client");
    setAuthToken(null);
    setToken(null);
    setClient(null);
  };

  return (
    <AuthContext.Provider value={{ client, token, login, logout, loadStoredAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);