import { Text, View, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { Link } from "expo-router";
import "nativewind";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

export default function App() {
  const [isPressed, setIsPressed] = useState(false);

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_700Bold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View className="flex-1 items-center justify-center bg-red-500 p-4">
      <Image
        source={require("../assets/images/logo.png")}
        className="w-80 h-24 mt-5 mb-4"
      />
      <Image
        source={require("../assets/images/img.png")}
        className="w-45 h-45 mb-12"
      />
      <Text className="text-3xl font-bold text-white mb-4">
        Discover Endless Possibilities with Aora
      </Text>
      <Text className="text-3xl font-bold text-white mb-4">Aora!!</Text>
      <Link href="/profile" asChild>
        <TouchableOpacity
          className={`${
            isPressed ? "bg-gray-200" : "bg-white"
          } px-6 py-3 rounded-full`}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
        >
          <Text className="text-red-500 text-lg font-semibold">
            Profile Git
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
