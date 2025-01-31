import {
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Image,
  WebView,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Search() {
  const { query } = useLocalSearchParams();
  const router = useRouter();
  const [storedUsername, setStoredUsername] = useState("Misafir");
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [posts, setPosts] = useState([
    {
      id: 0,
      title: "Man with vr glasses in futuristic",
      author: "David Brownr",
      image: require("../assets/images/img-2.png"),
      avatar: require("../assets/images/avatar-1.png"),
    },
    {
      id: 1,
      title: "Woman walks down a Tokyo...",
      author: "Brandon Etter",
      image: require("../assets/images/img-2.png"),
      avatar: require("../assets/images/Rectangle-7.png"),
    },
  ]);
  const [savedPosts, setSavedPosts] = useState([]);

  useEffect(() => {
    loadSavedPosts();
  }, []);

  const loadSavedPosts = async () => {
    try {
      const savedPostsData = await AsyncStorage.getItem("savedPosts");
      if (savedPostsData) {
        setSavedPosts(JSON.parse(savedPostsData));
      }
    } catch (error) {
      console.error("Error loading saved posts:", error);
    }
  };

  const toggleActionMenu = (index) => {
    setShowActionMenu(showActionMenu === index ? null : index);
  };

  const handleDelete = (postId) => {
    console.log("Deleting post:", postId);
    setPosts((currentPosts) =>
      currentPosts.filter((post) => post.id !== postId)
    );
    setShowActionMenu(null);
  };

  const handleSave = async (post) => {
    try {
      const updatedSavedPosts = [...savedPosts, post];
      await AsyncStorage.setItem(
        "savedPosts",
        JSON.stringify(updatedSavedPosts)
      );
      setSavedPosts(updatedSavedPosts);
      setShowActionMenu(null);
      alert("Post başarıyla kaydedildi!");
    } catch (error) {
      console.error("Error saving post:", error);
      alert("Post kaydedilirken bir hata oluştu!");
    }
  };

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
        {posts.map((post) => (
          <View key={post.id} className="flex-row justify-center mt-4">
            <View className="bg-[#202029] p-4 rounded-lg w-full">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center flex-1">
                  <Image
                    source={post.avatar}
                    className="w-16 h-16 rounded-full"
                  />
                  <View className="ml-4 flex-1">
                    <Text className="text-white">{post.title}</Text>
                    <Text className="text-gray-400 mt-1">{post.author}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={() => toggleActionMenu(post.id)}>
                  <Image
                    source={require("../assets/images/more.png")}
                    className="w-6 h-6"
                  />
                </TouchableOpacity>
              </View>
              {showActionMenu === post.id && (
                <View className="absolute right-4 top-12 bg-[#333] rounded-lg p-2 z-10">
                  <TouchableOpacity
                    className="flex-row items-center p-2"
                    onPress={() => handleSave(post)}
                  >
                    <Ionicons name="bookmark-outline" size={20} color="white" />
                    <Text className="text-white ml-2">Save</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="flex-row items-center p-2"
                    onPress={() => handleDelete(post.id)}
                  >
                    <Ionicons name="trash-outline" size={20} color="white" />
                    <Text className="text-white ml-2">Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
              <Image
                source={post.image}
                className="w-full h-48 mt-4 rounded-lg"
                resizeMode="cover"
              />
            </View>
          </View>
        ))}
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
