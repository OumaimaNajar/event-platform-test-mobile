import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { useAuth } from "../context/AuthContext";

import EventsScreen from "../screens/EventsScreen";
import EventDetailScreen from "../screens/EventDetailScreen";
import SigninScreen from "../screens/SigninScreen";
import SignupScreen from "../screens/SignupScreen";

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { loadStoredAuth } = useAuth();

  useEffect(() => {
    loadStoredAuth();
  }, [loadStoredAuth]);

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#0f172a" },
          headerTintColor: "#ffffff",
          headerTitleStyle: { fontWeight: "bold" },
          cardStyle: { backgroundColor: "#0f172a" },
        }}
      >
        <Stack.Screen
          name="Events"
          component={EventsScreen}
          options={{ title: "🎟️ Évènements" }}
        />
        <Stack.Screen
          name="EventDetail"
          component={EventDetailScreen}
          options={{ title: "Détail" }}
        />
        <Stack.Screen
          name="Signin"
          component={SigninScreen}
          options={{ title: "Connexion" }}
        />
        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{ title: "Créer un compte" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}