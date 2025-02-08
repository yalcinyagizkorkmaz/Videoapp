import {
  Text,
  View,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Home() {
  const { username } = useLocalSearchParams();
  const router = useRouter();

  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [searchName, setSearchName] = useState("");
  const [storedUsername, setStoredUsername] = useState(username || "");
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Woman walks down a Tokyo...",
      author: "Brandon Etter",
      image: require("../assets/images/video.png"),
      avatar: require("../assets/images/avatar.png"),
    },
    // İkinci post için varsayılan veri ekleyebilirsiniz
  ]);

  useEffect(() => {
    const getUsername = async () => {
      try {
        if (username) {
          setStoredUsername(username);
          return;
        }

        const savedUsername = await AsyncStorage.getItem("username");
        if (savedUsername) {
          setStoredUsername(savedUsername);
        }
      } catch (error) {
        console.error("Username yüklenirken hata:", error);
      }
    };

    getUsername();
  }, [username]);

  const cards = [
    { id: 1, image: require("../assets/images/Card-1.png") },
    { id: 2, image: require("../assets/images/Card-2.png") },
    { id: 3, image: require("../assets/images/card-3.jpeg") },
  ];

  const toggleActionMenu = (index) => {
    setShowActionMenu(showActionMenu === index ? null : index);
  };

  const handleDelete = (postId) => {
    setPosts(posts.filter((post) => post.id !== postId));
    setShowActionMenu(null);
    alert("Post başarıyla silindi!");
  };

  const handleSave = async (post) => {
    try {
      const savedPosts = await AsyncStorage.getItem("savedPosts");
      const currentSavedPosts = savedPosts ? JSON.parse(savedPosts) : [];
      const updatedSavedPosts = [...currentSavedPosts, post];

      await AsyncStorage.setItem(
        "savedPosts",
        JSON.stringify(updatedSavedPosts)
      );
      setShowActionMenu(null);
      alert("Post başarıyla kaydedildi!");
    } catch (error) {
      console.error("Error saving post:", error);
      alert("Post kaydedilirken bir hata oluştu!");
    }
  };

  return (
    <View className="flex-1 bg-black">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="p-4">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-white">Welcome Back</Text>
              <Text className="text-white text-3xl font-bold">
                {storedUsername || "Misafir"}
              </Text>
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
              value={searchName}
              onChangeText={setSearchName}
              onSubmitEditing={() => {
                if (searchName.trim()) {
                  router.push({
                    pathname: "/search",
                    params: { query: searchName },
                  });
                }
              }}
              returnKeyType="search"
            />
            <Image
              source={require("../assets/images/Vector.png")}
              className="w-6 h-6 absolute right-3 top-4"
            />
          </View>
          <Text className="text-white mt-2">Trend Videos</Text>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-4"
            onScroll={(event) => {
              const scrollPosition = event.nativeEvent.contentOffset.x;
              const index = Math.round(scrollPosition / 130);
              setActiveIndex(index);
            }}
            scrollEventThrottle={16}
          >
            <View>
              <View className="flex-row">
                {cards.map((card, index) => (
                  <TouchableOpacity
                    key={card.id}
                    onPressIn={() => setHoveredCard(card.id)}
                    onPressOut={() => setHoveredCard(null)}
                    onPress={() => setActiveIndex(index)}
                    className={`mr-4 bg-[#202029] w-[130px] h-[200px] rounded-lg overflow-hidden ${
                      activeIndex === index
                        ? "border-2 border-blue-500 scale-105"
                        : hoveredCard === card.id
                        ? "scale-102"
                        : "scale-100"
                    }`}
                    style={{
                      transform: [{ scale: activeIndex === index ? 1.05 : 1 }],
                      transition: "transform 0.3s ease",
                    }}
                  >
                    <Image
                      source={card.image}
                      className="w-full h-full"
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                ))}
              </View>

              <View className="flex-row justify-center mt-4">
                {cards.map((_, index) => (
                  <View
                    key={index}
                    className={`h-2 w-2 rounded-full mx-1 ${
                      activeIndex === index ? "bg-blue-500" : "bg-gray-500"
                    }`}
                  />
                ))}
              </View>
            </View>
          </ScrollView>
          {posts.map((post, index) => (
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
                      <Ionicons
                        name="bookmark-outline"
                        size={20}
                        color="white"
                      />
                      <Text className="text-white ml-2">Kaydet</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className="flex-row items-center p-2"
                      onPress={() => handleDelete(post.id)}
                    >
                      <Ionicons name="trash-outline" size={20} color="white" />
                      <Text className="text-white ml-2">Sil</Text>
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
        </View>
      </ScrollView>

      {/* Sabit Alt Navbar */}
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
