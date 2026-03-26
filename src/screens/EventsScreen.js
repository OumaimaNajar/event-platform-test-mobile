import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { getEvents } from "../services/api";

export default function EventsScreen({ navigation }) {
  const { client, logout } = useAuth();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchEvents = useCallback(async () => {
    try {
      setError(null);
      const res = await getEvents();
      setEvents(res.data);
    } catch (err) {
      setError("Impossible de charger les évènements.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchEvents();
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate("EventDetail", { eventId: item.id })}
      activeOpacity={0.85}
    >
      <View style={styles.cardHeader}>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>🎟️</Text>
        </View>
        <Text style={styles.date}>{formatDate(item.date)}</Text>
      </View>
      <Text style={styles.title}>{item.title || item.name}</Text>
      {item.location && (
        <Text style={styles.location}>📍 {item.location}</Text>
      )}
      {item.description && (
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>
      )}
      <View style={styles.cardFooter}>
        <Text style={styles.viewMore}>Voir le détail →</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header auth */}
      <View style={styles.topBar}>
        {client ? (
          <View style={styles.topBarContent}>
            <Text style={styles.welcome}>
              👋 Bonjour,{" "}
              <Text style={styles.clientName}>{client.name || client.email}</Text>
            </Text>
            <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
              <Text style={styles.logoutText}>Déconnexion</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.topBarContent}>
            <Text style={styles.welcome}>Bienvenue 👋</Text>
            <View style={styles.authButtons}>
              <TouchableOpacity
                onPress={() => navigation.navigate("Signin")}
                style={styles.signinBtn}
              >
                <Text style={styles.signinText}>Connexion</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("Signup")}
                style={styles.signupBtn}
              >
                <Text style={styles.signupText}>Inscription</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color="#6366f1" />
          <Text style={styles.loadingText}>Chargement des évènements…</Text>
        </View>
      ) : error ? (
        <View style={styles.centered}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={fetchEvents}>
            <Text style={styles.retryText}>Réessayer</Text>
          </TouchableOpacity>
        </View>
      ) : events.length === 0 ? (
        <View style={styles.centered}>
          <Text style={styles.emptyText}>Aucun évènement disponible.</Text>
        </View>
      ) : (
        <FlatList
          data={events}
          keyExtractor={(item) => item.id?.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#6366f1"
            />
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a" },

  topBar: {
    backgroundColor: "#1e293b",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
  },
  topBarContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  welcome: { color: "#94a3b8", fontSize: 13 },
  clientName: { color: "#e2e8f0", fontWeight: "700" },

  logoutBtn: {
    backgroundColor: "#ef444420",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ef4444",
  },
  logoutText: { color: "#ef4444", fontSize: 12, fontWeight: "600" },

  authButtons: {
    flexDirection: "row",
    gap: 8,
  },
  signinBtn: {
    backgroundColor: "#6366f1",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
  },
  signinText: { color: "#fff", fontSize: 12, fontWeight: "700" },
  signupBtn: {
    backgroundColor: "transparent",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#6366f1",
  },
  signupText: { color: "#6366f1", fontSize: 12, fontWeight: "700" },

  list: { padding: 16, gap: 14 },

  card: {
    backgroundColor: "#1e293b",
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  badge: {
    backgroundColor: "#6366f120",
    padding: 8,
    borderRadius: 10,
  },
  badgeText: { fontSize: 18 },
  date: { color: "#6366f1", fontSize: 12, fontWeight: "600" },
  title: {
    color: "#f1f5f9",
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 6,
  },
  location: { color: "#94a3b8", fontSize: 13, marginBottom: 6 },
  description: { color: "#64748b", fontSize: 13, lineHeight: 18 },
  cardFooter: { marginTop: 12, alignItems: "flex-end" },
  viewMore: { color: "#6366f1", fontSize: 13, fontWeight: "600" },

  centered: { flex: 1, justifyContent: "center", alignItems: "center", padding: 24 },
  loadingText: { color: "#64748b", marginTop: 12, fontSize: 14 },
  errorText: { color: "#ef4444", fontSize: 15, textAlign: "center", marginBottom: 16 },
  retryBtn: {
    backgroundColor: "#6366f1",
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 10,
  },
  retryText: { color: "#fff", fontWeight: "700" },
  emptyText: { color: "#64748b", fontSize: 15 },
});