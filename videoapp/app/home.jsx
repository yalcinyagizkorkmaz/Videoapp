import {
  Text,
  View,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useRoute } from "@react-navigation/native";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

export default function Home() {
  const { username } = useLocalSearchParams();
  const route = useRoute();

  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);

  const cards = [
    { id: 1, image: require("../assets/images/card-1.png") },
    { id: 2, image: require("../assets/images/card-2.png") },
    { id: 3, image: require("../assets/images/card-3.jpeg") },
  ];

  useEffect(() => {
    console.log("Route params:", route.params);
    if (route.params?.username) {
      console.log("Username set to:", route.params.username);
    }
  }, [route.params?.username]);

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
        </View>
      </ScrollView>

      {/* Sabit Alt Navbar */}
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
