import { Text, View, TouchableOpacity, TextInput, Image } from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Search() {
  const { query } = useLocalSearchParams();
  const [searchName, setSearchName] = useState("");
  return (
    <View className="flex-1 bg-neutral-900 p-4">
      <Text className="text-gray-400 text-lg mt-2 ml-2">Search Results</Text>
      <Text className="text-white text-3xl font-semibold mt-2 ml-2">
        {query}
      </Text>
      <View className="relative">
        <TextInput
          placeholder="Search for a video topic"
          className="w-full bg-[#202029] text-white p-4 pr-12 rounded-lg border border-[#9295aa]"
          placeholderTextColor="#666"
          value={searchName}
          onChangeText={setSearchName}
        />
        <Image
          source={require("../assets/images/Vector.png")}
          className="w-6 h-6 absolute right-3 top-1/4 -translate-y-1/2"
        />
      </View>

      <View className="absolute bottom-0 left-0 right-0 bg-[#202029] h-16 flex-row justify-around items-center border-t border-[#333]">
        <TouchableOpacity className="items-center">
          <Ionicons name="home" size={24} color="white" />
          <Text className="text-white text-xs mt-1">Home</Text>
        </TouchableOpacity>

        <TouchableOpacity className="items-center">
          <Ionicons name="save" size={24} color="white" />
          <Text className="text-white text-xs mt-1">Saved</Text>
        </TouchableOpacity>

        <TouchableOpacity className="items-center">
          <Ionicons name="add-circle" size={24} color="white" />
          <Text className="text-white text-xs mt-1">Create</Text>
        </TouchableOpacity>

        <TouchableOpacity className="items-center">
          <Ionicons name="person" size={24} color="white" />
          <Text className="text-white text-xs mt-1">Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
