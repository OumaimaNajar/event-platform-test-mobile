/* eslint-disable react-native/no-inline-styles */
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Alert,
} from "react-native";

import { useAuth } from "../context/AuthContext";
import { getEvent, registerToEvent, getClients } from "../services/api";

export default function EventDetailScreen({ route, navigation }) {

  const { eventId } = route.params;
  const { client } = useAuth();

  const [event, setEvent] = useState(null);
  const [clients, setClients] = useState([]);

  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {

      const eventRes = await getEvent(eventId);
      setEvent(eventRes.data);

      const clientsRes = await getClients(eventId);
      setClients(clientsRes.data);

      if (client) {
        const already = clientsRes.data.some(c => c.id === client.id);
        setRegistered(already);
      }

    } catch (err) {
      setError("Impossible de charger l'évènement.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {

    if (!client) {
      Alert.alert(
        "Connexion requise",
        "Vous devez vous connecter",
        [
          { text: "Annuler", style: "cancel" },
          { text: "Se connecter", onPress: () => navigation.navigate("Signin") }
        ]
      );
      return;
    }

    try {

      setRegistering(true);

      await registerToEvent(eventId);

      Alert.alert("Succès", "Vous êtes inscrit");

      fetchData();

    } catch (err) {
      Alert.alert("Erreur", "Impossible de s'inscrire");
    } finally {
      setRegistering(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  if (error || !event) {
    return (
      <View style={styles.center}>
        <Text style={{color:"white"}}>Erreur</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>

      <Text style={styles.title}>{event.title}</Text>

      <Text style={styles.text}>📅 {formatDate(event.date)}</Text>

      <Text style={styles.description}>{event.description}</Text>

      <Text style={styles.subtitle}>
        Participants ({clients.length})
      </Text>

      {clients.map((c) => (
        <View key={c.id} style={styles.clientRow}>
          <Text style={styles.clientText}>
            {c.name} - {c.email}
          </Text>
        </View>
      ))}

      {registered ? (

        <View style={styles.registered}>
          <Text style={{color:"white"}}>
            Vous êtes inscrit
          </Text>
        </View>

      ) : (

        <TouchableOpacity
          style={styles.button}
          onPress={handleRegister}
          disabled={registering}
        >
          <Text style={styles.buttonText}>
            S'inscrire
          </Text>
        </TouchableOpacity>

      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container:{
    flex:1,
    backgroundColor:"#0f172a",
    padding:20
  },

  center:{
    flex:1,
    justifyContent:"center",
    alignItems:"center",
    backgroundColor:"#0f172a"
  },

  title:{
    color:"white",
    fontSize:24,
    fontWeight:"bold",
    marginBottom:10
  },

  text:{
    color:"#cbd5e1",
    marginBottom:6
  },

  description:{
    color:"#cbd5e1",
    marginTop:10,
    marginBottom:20
  },

  subtitle:{
    color:"#94a3b8",
    fontWeight:"bold",
    marginBottom:10
  },

  clientRow:{
    backgroundColor:"#1e293b",
    padding:10,
    borderRadius:8,
    marginBottom:8
  },

  clientText:{
    color:"white"
  },

  button:{
    backgroundColor:"#6366f1",
    padding:15,
    borderRadius:10,
    marginTop:20,
    alignItems:"center"
  },

  buttonText:{
    color:"white",
    fontWeight:"bold"
  },

  registered:{
    backgroundColor:"#16a34a",
    padding:15,
    borderRadius:10,
    marginTop:20,
    alignItems:"center"
  }

});