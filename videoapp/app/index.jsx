import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { Link } from "expo-router";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-red-500">
      <Text className="text-3xl">Aora!!</Text>
      <Link href="/profile" asChild>
        <TouchableOpacity>
          <Text style={styles.text}>Profile Git</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
