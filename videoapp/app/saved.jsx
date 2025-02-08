import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useRouter, useLocalSearchParams } from "expo-router";

export default function saved() {
  const router = useRouter();
  const { username } = useLocalSearchParams();
  const [storedUsername, setStoredUsername] = useState(username || "Misafir");
  const [savedVideos, setSavedVideos] = useState([]);
  const { query } = useLocalSearchParams();

  useEffect(() => {
    const getUsername = async () => {
      try {
        const storedUsername = await AsyncStorage.getItem("username");
        if (storedUsername) {
          setStoredUsername(storedUsername);
        }
      } catch (error) {
        console.error("Username yüklenirken hata:", error);
      }
    };

    getUsername();
    loadSavedVideos();
  }, []);

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

  return (
    <View className="flex-1 bg-black">
      <View className="flex-1 p-4">
        <Text className="text-white text-3xl font-semibold mt-2 ml-1">
          Saved Results
        </Text>
        <View className="relative mt-4">
          <TextInput
            placeholder="Search for your saved videos"
            className="w-full bg-[#202029] text-white p-4 pr-12 rounded-lg border-2 border-[#9295aa]"
            placeholderTextColor="#666"
            value={query}
          />
          <Image
            source={require("../assets/images/Vector.png")}
            className="w-6 h-6 absolute right-3 top-1/4 -translate-y-1/2"
          />
        </View>

        <ScrollView className="mt-4">
          <View className="bg-[#202029] p-4 rounded-lg w-full mb-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <Image
                  source={require("../assets/images/avatar.png")}
                  className="w-16 h-16 rounded-full"
                />
                <View className="ml-4 flex-1">
                  <Text className="text-white">
                    Woman walks down a Tokyo...
                  </Text>
                  <Text className="text-gray-400 mt-1">Brandon Etter</Text>
                </View>
              </View>
              <TouchableOpacity>
                <Image
                  source={require("../assets/images/more.png")}
                  className="w-6 h-6"
                />
              </TouchableOpacity>
            </View>
            <Image
              source={require("../assets/images/video.png")}
              className="w-full h-48 mt-4 rounded-lg"
              resizeMode="cover"
            />
          </View>
          <View className="bg-[#202029] p-4 rounded-lg w-full mb-4">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <Image
                  source={require("../assets/images/avatar.png")}
                  className="w-16 h-16 rounded-full"
                />
                <View className="ml-4 flex-1">
                  <Text className="text-white">
                    Woman walks down a Tokyo...
                  </Text>
                  <Text className="text-gray-400 mt-1">Brandon Etter</Text>
                </View>
              </View>
              <TouchableOpacity>
                <Image
                  source={require("../assets/images/more.png")}
                  className="w-6 h-6"
                />
              </TouchableOpacity>
            </View>
            <Image
              source={require("../assets/images/video.png")}
              className="w-full h-48 mt-4 rounded-lg"
              resizeMode="cover"
            />
          </View>
          {savedVideos.map((video, index) => (
            <TouchableOpacity
              key={index}
              className="bg-[#202029] p-4 mb-3 rounded-lg"
              onPress={() =>
                router.push({
                  pathname: "/video",
                  params: { id: video.id },
                })
              }
            >
              <View className="flex-row">
                <Image
                  source={{ uri: video.thumbnail }}
                  className="w-24 h-16 rounded"
                />
                <View className="ml-3 flex-1">
                  <Text className="text-white font-medium">{video.title}</Text>
                  <Text className="text-gray-400 text-sm mt-1">
                    {video.description}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View className="absolute bottom-0 left-0 right-0 bg-[#202029] h-16 flex-row justify-around items-center border-t border-[#333]">
        <TouchableOpacity
          className="items-center"
          onPress={() =>
            router.push({
              pathname: "/home",
              params: { username: storedUsername },
            })
          }
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
