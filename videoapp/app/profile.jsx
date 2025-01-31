import { ScrollView, View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState, useEffect } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profile() {
  const router = useRouter();
  const { username } = useLocalSearchParams();
  const [storedUsername, setStoredUsername] = useState(username || "Misafir");
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const savedUsername = await AsyncStorage.getItem("username");
      if (savedUsername) {
        setStoredUsername(savedUsername);
      }
      // Burada API'den kullanıcının gönderilerini yükleyebilirsiniz
      // örnek: const userPosts = await fetchUserPosts(savedUsername);
      // setPosts(userPosts);
    } catch (error) {
      console.error("Veri yükleme hatası:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("username");
      await AsyncStorage.removeItem("token");
      router.replace("/");
    } catch (error) {
      console.error("Çıkış yapma hatası:", error);
    }
  };

  return (
    <View className="flex-1 bg-black p-4">
      <ScrollView className="mb-20">
        <TouchableOpacity
          onPress={handleLogout}
          className="absolute right-4 top-0 z-10"
        >
          <Image
            source={require("../assets/images/tabler_logout.png")}
            className="w-6 h-6"
          />
        </TouchableOpacity>
        <View className="flex-row mt-0  bg-[#202029] p-4 rounded-lg w-5/6">
          <Image
            source={require("../assets/images/Rectangle-7.png")}
            className="w-24 h-24 rounded-full"
          />
          <View className="ml-4 flex-1">
            <Text className="text-white text-2xl font-bold mb-2">
              {username || "Misafir"}
            </Text>
            <View className="flex-row justify-between">
              <View className="flex-row">
                <View className="items-center mr-6">
                  <Text className="text-white text-xl font-bold">128</Text>
                  <Text className="text-gray-400 text-sm">Post</Text>
                </View>
                <View className="items-center">
                  <Text className="text-white text-xl font-bold">1.2M</Text>
                  <Text className="text-gray-400 text-sm">Görüntülenme</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View className="flex-row justify-center mt-4"></View>
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <View key={index} className="flex-row justify-center mt-4"></View>
          ))
        ) : (
          <View className="flex-1 justify-center items-center mt-8">
            <Image
              source={require("../assets/images/EmptyState.png")}
              className="w-[270] h-[216]"
            />
            <Text className="text-white text-lg mt-4">No Videos Found</Text>
            <Text className="text-white text-lg font-bold mt-2">
              No videos found for this profile
            </Text>
            <TouchableOpacity
              className="bg-orange-500 w-full h-15 p-4 rounded-lg items-center mt-4"
              onPress={() => router.push("/home")}
            >
              <Text className="text-black text-center font-semibold">
                Back to Explore
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

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
