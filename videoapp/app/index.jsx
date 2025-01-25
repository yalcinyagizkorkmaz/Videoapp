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
    <View className="flex-1 items-center justify-center bg-black p-4">
      <Image
        source={require("../assets/images/logo.png")}
        className="w-80 h-24 mt-5 mb-4"
      />
      <Image
        source={require("../assets/images/img.png")}
        className="w-45 h-45 mb-12"
      />
      <Text className="text-3xl font-bold text-white mb-4 text-center">
        Discover Endless Possibilities with{" "}
        <Text className="text-orange-500">Aora</Text>
      </Text>

      <Text className="text-base text-white mb-4 text-center">
        Where Creativity Meets Innovation: Embark on a Journey of Limitless
        Exploration with Aora
      </Text>
      <Link href="/signup" asChild>
        <TouchableOpacity
          className={`${
            isPressed ? "bg-white" : "bg-orange-500"
          } px-12 py-3 rounded-full w-80`}
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
          onPress={() => {}}
        >
          <Text className="text-black text-lg font-semibold text-center">
            Continue with Email
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
