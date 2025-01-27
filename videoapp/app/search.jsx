import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  WebView,
  ScrollView,
} from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useRouter } from "expo-router";

export default function Search() {
  const { query } = useLocalSearchParams();
  const navigation = useNavigation();
  const router = useRouter();

  return (
    <View className="flex-1 bg-neutral-900">
      <ScrollView className="flex-1 p-4 pb-20">
        <Text className="text-gray-400 text-lg mt-2 ml-1">Search Results</Text>
        <Text className="text-white text-3xl font-semibold mt-2 ml-1">
          {query}
        </Text>
        <View className="relative mt-4">
          <TextInput
            placeholder="Search for a video topic"
            className="w-full bg-[#202029] text-white p-4 pr-12 rounded-lg border-2 border-[#9295aa]"
            placeholderTextColor="#666"
            value={query}
          />
          <Image
            source={require("../assets/images/Vector.png")}
            className="w-6 h-6 absolute right-3 top-1/4 -translate-y-1/2"
          />
        </View>
        <View className="flex-row justify-center mt-4">
          <View className="bg-[#202029] p-4 rounded-lg w-full">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center flex-1">
                <Image
                  source={require("../assets/images/avatar-1.png")}
                  className="w-16 h-16 rounded-full"
                />
                <View className="ml-4 flex-1">
                  <Text className="text-white">
                    Man with vr glasses in futuristic
                  </Text>
                  <Text className="text-gray-400 mt-1">David Brownr</Text>
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
              source={require("../assets/images/img-2.png")}
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
                  source={require("../assets/images/Rectangle-7.png")}
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
              source={require("../assets/images/img-2.png")}
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
          onPress={() => router.push("/profile")}
        >
          <Ionicons name="person" size={24} color="white" />
          <Text className="text-white text-xs mt-1">Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
