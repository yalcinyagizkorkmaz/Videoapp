import { ScrollView, View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Profile() {
  const router = useRouter();
  const { username } = useLocalSearchParams();
  const [storedUsername, setStoredUsername] = useState(username || "Misafir");

  const handleLogout = () => {
    router.push("/");
  };

  return (
    <View className="flex-1 bg-black p-4">
      <TouchableOpacity
        onPress={handleLogout}
        className="absolute right-4 top-4 z-10"
      >
        <Image
          source={require("../assets/images/tabler_logout.png")}
          className="w-6 h-6"
        />
      </TouchableOpacity>

      <ScrollView className="mb-20">
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
        <View className="flex-row justify-center mt-4">
          <View className="bg-[#202029] p-4 rounded-lg w-full">
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
        </View>
        <View className="flex-row justify-center mt-4">
          <View className="bg-[#202029] p-4 rounded-lg w-full">
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
        </View>
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
