/* eslint-disable react-native/no-inline-styles */
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
import { signup } from "../services/api";

// ✅ Field défini EN DEHORS de SignupScreen pour éviter la recréation à chaque render
function Field({ label, value, onChangeText, error, ...props }) {
  return (
    <View style={styles.fieldGroup}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholderTextColor="#475569"
        value={value}
        onChangeText={onChangeText}
        {...props}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

export default function SignupScreen({ navigation }) {
  const { login } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const clearError = (key) => setErrors((e) => ({ ...e, [key]: null }));

  const validate = () => {
    const newErrors = {};
    if (!name.trim()) newErrors.name = "Le nom est requis.";
    if (!email.trim()) newErrors.email = "L'email est requis.";
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email invalide.";
    if (!password) newErrors.password = "Le mot de passe est requis.";
    else if (password.length < 6) newErrors.password = "Minimum 6 caractères.";
    if (password !== confirmPassword)
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;
    try {
      setLoading(true);
      const res = await signup({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });
      const { token, client } = res.data;
      await login(token, client);
      navigation.reset({ index: 0, routes: [{ name: "Events" }] });
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "Une erreur est survenue lors de la création du compte.";
      Alert.alert("Erreur", msg);
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
        <Text style={styles.heroEmoji}>✨</Text>
        <Text style={styles.heroTitle}>Créer un compte</Text>
        <Text style={styles.heroSub}>
          Rejoignez la plateforme et inscrivez-vous aux évènements
        </Text>
      </View>

      {/* Form card */}
      <View style={styles.card}>
        <Field
          label="Nom complet"
          value={name}
          onChangeText={(t) => { setName(t); clearError("name"); }}
          error={errors.name}
          placeholder="Jean Dupont"
          autoCapitalize="words"
          returnKeyType="next"
        />

        <Field
          label="Adresse email"
          value={email}
          onChangeText={(t) => { setEmail(t); clearError("email"); }}
          error={errors.email}
          placeholder="vous@exemple.com"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          returnKeyType="next"
        />

        {/* Password */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Mot de passe</Text>
          <View style={[styles.passwordWrapper, errors.password && styles.inputError]}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Minimum 6 caractères"
              placeholderTextColor="#475569"
              value={password}
              onChangeText={(t) => { setPassword(t); clearError("password"); }}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              returnKeyType="next"
            />
            <TouchableOpacity
              onPress={() => setShowPassword((v) => !v)}
              style={styles.eyeBtn}
            >
              <Text style={styles.eyeIcon}>{showPassword ? "🙈" : "👁️"}</Text>
            </TouchableOpacity>
          </View>
          {errors.password && (
            <Text style={styles.errorText}>{errors.password}</Text>
          )}
        </View>

        {/* Confirm password */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Confirmer le mot de passe</Text>
          <TextInput
            style={[styles.input, errors.confirmPassword && styles.inputError]}
            placeholder="••••••••"
            placeholderTextColor="#475569"
            value={confirmPassword}
            onChangeText={(t) => { setConfirmPassword(t); clearError("confirmPassword"); }}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
            returnKeyType="done"
            onSubmitEditing={handleSignup}
          />
          {errors.confirmPassword && (
            <Text style={styles.errorText}>{errors.confirmPassword}</Text>
          )}
        </View>

        {/* Strength indicator */}
        {password.length > 0 && (
          <View style={styles.strengthRow}>
            {[1, 2, 3].map((i) => (
              <View
                key={i}
                style={[
                  styles.strengthBar,
                  password.length >= i * 4 && styles.strengthBarActive,
                  password.length >= 8 && styles.strengthBarStrong,
                ]}
              />
            ))}
            <Text style={styles.strengthText}>
              {password.length < 4 ? "Faible" : password.length < 8 ? "Moyen" : "Fort"}
            </Text>
          </View>
        )}

        {/* Submit */}
        <TouchableOpacity
          style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
          onPress={handleSignup}
          disabled={loading}
          activeOpacity={0.85}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitBtnText}>Créer mon compte</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Signin link */}
      <TouchableOpacity
        style={styles.switchLink}
        onPress={() => navigation.navigate("Signin")}
      >
        <Text style={styles.switchLinkText}>
          Déjà un compte ?{" "}
          <Text style={styles.switchLinkAccent}>Se connecter</Text>
        </Text>
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a" },
  inner: { flexGrow: 1, padding: 24, justifyContent: "center" },

  hero: { alignItems: "center", marginBottom: 32 },
  heroEmoji: { fontSize: 52, marginBottom: 12 },
  heroTitle: { color: "#f1f5f9", fontSize: 26, fontWeight: "800", marginBottom: 6 },
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

  strengthRow: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 18 },
  strengthBar: { flex: 1, height: 4, backgroundColor: "#334155", borderRadius: 2 },
  strengthBarActive: { backgroundColor: "#f59e0b" },
  strengthBarStrong: { backgroundColor: "#22c55e" },
  strengthText: { color: "#64748b", fontSize: 11, fontWeight: "600", minWidth: 40 },

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