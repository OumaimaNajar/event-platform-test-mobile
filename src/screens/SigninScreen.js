import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Alert,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { signin } from "../services/api";

export default function SigninScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = "L'email est requis.";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email invalide.";
    if (!password) newErrors.password = "Le mot de passe est requis.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignin = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      const res = await signin({ email: email.trim().toLowerCase(), password });
      const { token, client } = res.data;
      await login(token, client);
      navigation.reset({ index: 0, routes: [{ name: "Events" }] });
    } catch (err) {
      const msg =
        err?.response?.data?.message || "Email ou mot de passe incorrect.";
      Alert.alert("Erreur de connexion", msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.inner}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {/* Hero */}
      <View style={styles.hero}>
        <Text style={styles.heroEmoji}>🎟️</Text>
        <Text style={styles.heroTitle}>Bon retour !</Text>
        <Text style={styles.heroSub}>
          Connectez-vous pour accéder à vos évènements
        </Text>
      </View>

      {/* Form card */}
      <View style={styles.card}>
        {/* Email */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Adresse email</Text>
          <TextInput
            style={[styles.input, errors.email && styles.inputError]}
            placeholder="vous@exemple.com"
            placeholderTextColor="#475569"
            value={email}
            onChangeText={(t) => {
              setEmail(t);
              setErrors((e) => ({ ...e, email: null }));
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
          />
          {errors.email && (
            <Text style={styles.errorText}>{errors.email}</Text>
          )}
        </View>

        {/* Password */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Mot de passe</Text>
          <View
            style={[
              styles.passwordWrapper,
              errors.password && styles.inputError,
            ]}
          >
            <TextInput
              style={styles.passwordInput}
              placeholder="••••••••"
              placeholderTextColor="#475569"
              value={password}
              onChangeText={(t) => {
                setPassword(t);
                setErrors((e) => ({ ...e, password: null }));
              }}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              returnKeyType="done"
              onSubmitEditing={handleSignin}
            />
            <TouchableOpacity
              onPress={() => setShowPassword((v) => !v)}
              style={styles.eyeBtn}
            >
              <Text style={styles.eyeIcon}>
                {showPassword ? "🙈" : "👁️"}
              </Text>
            </TouchableOpacity>
          </View>
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
        </View>

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
          onPress={handleSignin}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitBtnText}>Se connecter</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Signup link */}
      <TouchableOpacity
        style={styles.switchLink}
        onPress={() => navigation.navigate("Signup")}
      >
        <Text style={styles.switchLinkText}>
          Pas encore de compte ?{" "}
          <Text style={styles.switchLinkAccent}>Créer un compte</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0f172a",
  },
  inner: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
    paddingBottom: 60,
  },

  hero: { alignItems: "center", marginBottom: 32 },
  heroEmoji: { fontSize: 52, marginBottom: 12 },
  heroTitle: {
    color: "#f1f5f9",
    fontSize: 26,
    fontWeight: "800",
    marginBottom: 6,
  },
  heroSub: { color: "#64748b", fontSize: 14, textAlign: "center" },

  card: {
    backgroundColor: "#1e293b",
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: "#334155",
    marginBottom: 24,
  },

  fieldGroup: { marginBottom: 18 },
  label: {
    color: "#94a3b8",
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  input: {
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#f1f5f9",
    fontSize: 15,
  },
  inputError: { borderColor: "#ef4444" },
  errorText: { color: "#ef4444", fontSize: 12, marginTop: 6 },

  passwordWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0f172a",
    borderWidth: 1,
    borderColor: "#334155",
    borderRadius: 12,
  },
  passwordInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: "#f1f5f9",
    fontSize: 15,
  },
  eyeBtn: { paddingHorizontal: 14 },
  eyeIcon: { fontSize: 18 },

  submitBtn: {
    backgroundColor: "#6366f1",
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
    marginTop: 8,
    elevation: 6,
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnText: { color: "#fff", fontSize: 16, fontWeight: "800" },

  switchLink: { alignItems: "center" },
  switchLinkText: { color: "#64748b", fontSize: 14 },
  switchLinkAccent: { color: "#6366f1", fontWeight: "700" },
});