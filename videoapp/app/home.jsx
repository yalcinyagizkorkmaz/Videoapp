import { Text, View, Image, TextInput } from "react-native";
import React, { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";

export default function Home() {
  const { username } = useLocalSearchParams();
  const route = useRoute();

  useEffect(() => {
    console.log("Route params:", route.params);
    if (route.params?.username) {
      console.log("Username set to:", route.params.username);
    }
  }, [route.params?.username]);

  return (
    <View className="flex-1 bg-black p-4">
      <View className="flex-row items-center justify-between mb-4">
        <View>
          <Text className="text-white">Welcome Back</Text>
          <Text className="text-white text-3xl font-bold">{username}</Text>
        </View>
        <View className="flex-row">
          <Image
            source={require("../assets/images/clip-path-group-2.png")}
            className="w-18 h-18 -ml-9"
          />
          <Image
            source={require("../assets/images/clip-path-group-1.png")}
            className="w-15 h-15 -ml-3 mt-1"
          />
        </View>
      </View>

      <View className="relative w-full mb-4">
        <TextInput
          placeholder="Search for a video topic"
          className="w-full bg-[#202029] text-white p-4 pr-12 rounded-lg border border-[#9295aa]"
          placeholderTextColor="#666"
        />
        <Image
          source={require("../assets/images/Vector.png")}
          className="w-6 h-6 absolute right-3 top-4"
        />
      </View>
      <Text className="text-white mt-2">Trend Videos</Text>
      <View className="flex-1 items-center justify-center"></View>
    </View>
  );
}
