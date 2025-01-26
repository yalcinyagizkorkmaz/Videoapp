import { Text, View } from "react-native";
import { Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

export default function RootLayout() {
  return (
    <View style={styles.container}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#fff",
          },
          headerTintColor: "#000",
          headerTitleStyle: {
            fontWeight: "bold",
          },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: true }} />
        <Stack.Screen name="signup" options={{ headerShown: true }} />
        <Stack.Screen name="login" options={{ headerShown: true }} />
        <Stack.Screen name="profile" options={{ headerShown: true }} />
        <Stack.Screen name="home" options={{ headerShown: true }} />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
