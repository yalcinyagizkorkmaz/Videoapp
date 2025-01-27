import { View, Text, Image, TouchableOpacity } from "react-native";
import React from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Profile() {
  const router = useRouter();
  const { username } = useLocalSearchParams();

  const handleLogout = () => {
    router.push("/"); // veya router.push("/home")
  };

  return (
    <View className="flex-1  bg-neutral-900">
      <TouchableOpacity onPress={handleLogout} className="self-end p-4">
        <Image
          source={require("../assets/images/tabler_logout.png")}
          className="w-8 h-8"
        />
      </TouchableOpacity>

      {/* Kullanıcı Profil Kartı */}
      <View className="mx-3 mt-1 bg-[#202029] rounded-2xl p-4 h-100 w-4/5">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Image
              source={require("../assets/images/Rectangle-7.png")}
              className="w-20 h-20 rounded-full"
            />
            <View className="ml-4">
              <Text className="text-white text-xl font-bold">
                {username || "Misafir"}
              </Text>
            </View>
          </View>
          <View className="flex-row space-x-4">
            <View>
              <Text className="text-white text-lg font-semibold">42</Text>
              <Text className="text-gray-400 text-sm">Posts</Text>
            </View>
            <View>
              <Text className="text-white text-lg font-semibold">1.5K</Text>
              <Text className="text-gray-400 text-sm">Views</Text>
            </View>
          </View>
        </View>
      </View>

      <View className="absolute bottom-0 left-0 right-0 bg-[#202029] h-16 flex-row justify-around items-center border-t border-[#333]">
        <TouchableOpacity
          className="items-center"
          onPress={() => router.push("/home")}
        >
          <Ionicons name="home" size={24} color="white" />
          <Text className="text-white text-xs mt-1">Home</Text>
        </TouchableOpacity>

        <TouchableOpacity className="items-center">
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
              params: { username: "KullanıcıAdı" },
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
