import { Text, View, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { AsyncStorage } from "react-native";

import { useRouter, useLocalSearchParams } from "expo-router";

export default function saved() {
  const router = useRouter();
  const { username } = useLocalSearchParams();
  const [storedUsername, setStoredUsername] = useState(username || "Misafir");
  const [savedVideos, setSavedVideos] = useState([]);

  useEffect(() => {
    // Örnek olarak AsyncStorage kullanımı
    const loadSavedVideos = async () => {
      try {
        const savedVideosData = await AsyncStorage.getItem("savedVideos");
        if (savedVideosData) {
          setSavedVideos(JSON.parse(savedVideosData));
        }
      } catch (error) {
        console.error("Videolar yüklenirken hata oluştu:", error);
      }
    };

    loadSavedVideos();
  }, []);

  return (
    <View className="flex-1 bg-black">
      <View className="flex-1 p-4">
        <Text className="text-white text-xl font-bold">Saved Videos</Text>
      </View>

      <View className="absolute bottom-0 left-0 right-0 bg-[#202029] h-16 flex-row justify-around items-center border-t border-[#333]">
        <TouchableOpacity
          className="items-center"
          onPress={() => router.push("/home")}
        >
          <Ionicons name="home" size={24} color="white" />
          <Text className="text-white text-xs mt-1">Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="items-center"
          onPress={() => router.push("/saved")}
        >
          <Ionicons name="save" size={24} color="white" />
          <Text className="text-white text-xs mt-1">Saved</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="items-center"
          onPress={() => router.push("/create")}
        >
          <Ionicons name="add-circle" size={24} color="white" />
          <Text className="text-white text-xs mt-1">Create</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="items-center"
          onPress={() =>
            router.push({
              pathname: "/profile",
              params: { username: storedUsername },
            })
          }
        >
          <Ionicons name="person" size={24} color="white" />
          <Text className="text-white text-xs mt-1">Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
