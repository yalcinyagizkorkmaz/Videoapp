import { Text, View } from "react-native";
import { Stack } from "expo-router";
import React from "react";
import { StyleSheet } from "react-native";

export default function RootLayout() {
  return (
    <View className="flex-1 bg-black">
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: "#000",
          },
          headerTintColor: "#fff",
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
        <Stack.Screen name="create" options={{ headerShown: true }} />
        <Stack.Screen name="saved" options={{ headerShown: true }} />
      </Stack>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
