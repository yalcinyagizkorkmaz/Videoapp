import { Text, View, TouchableOpacity, TextInput } from "react-native";
import React, { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Alert, Linking } from "react-native";

export default function Create() {
  const router = useRouter();
  const { username } = useLocalSearchParams();
  const [videoUri, setVideoUri] = useState(null);
  const [title, setTitle] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [thumbnailUri, setThumbnailUri] = useState(null);
  const [aiPrompt, setAiPrompt] = useState("");

  const pickVideo = async () => {
    try {
      // Önce kamera roll izinlerini kontrol edelim
      const { status: existingStatus } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      // İzin reddedildiyse
      if (existingStatus !== "granted") {
        Alert.alert(
          "Galeri İzni Gerekli",
          "Uygulamanın galeriye erişmesi için izin vermeniz gerekmektedir. Ayarlardan izni etkinleştirmek ister misiniz?",
          [
            {
              text: "Daha Sonra",
              style: "cancel",
            },
            {
              text: "Ayarlara Git",
              onPress: () => Linking.openSettings(),
            },
          ]
        );
        return;
      }

      // İzin verildiyse, video seçiciyi aç
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
        videoMaxDuration: 60,
      });

      if (!result.canceled) {
        const videoAsset = result.assets[0];
        setVideoUri(videoAsset.uri);
      }
    } catch (error) {
      console.error("Video seçiminde hata:", error);
      Alert.alert("Hata", "Video seçilirken bir hata oluştu: " + error.message);
    }
  };

  const pickThumbnail = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        alert("Fotoğraf seçmek için galeri iznine ihtiyacımız var!");
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
      });

      if (!result.canceled) {
        setThumbnailUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Fotoğraf seçiminde hata:", error);
      alert("Fotoğraf seçilirken bir hata oluştu.");
    }
  };

  return (
    <View className="flex-1 bg-black p-4">
      <Text className="text-white text-3xl font-bold">Upload Video</Text>

      <View className="mt-4 space-y-4">
        <View>
          <Text className="text-white text-lg mb-2">Video Title</Text>
          <TextInput
            className="bg-[#202029] text-white p-4 rounded-lg"
            placeholder="Give your video a catchy title..."
            placeholderTextColor="#666"
            value={title}
            onChangeText={setTitle}
          />
          <Text className="text-white text-lg mt-2">Upload Video</Text>
          <TouchableOpacity
            className="bg-[#202029] p-12 rounded-lg flex-row items-center justify-center space-x-2 mt-2"
            onPress={pickVideo}
          >
            <Ionicons name="videocam-outline" size={24} color="white" />
            <Text className="text-white">
              {videoUri ? "Video Changed" : "Video Upload"}
            </Text>
          </TouchableOpacity>
          <Text className="text-white text-lg mt-2">Thumbnail Image</Text>
          <TouchableOpacity
            className="bg-[#202029] p-6 rounded-lg flex-row items-center justify-center space-x-2 mt-2"
            onPress={pickThumbnail}
          >
            <Ionicons name="image-outline" size={24} color="white" />
            <Text className="text-white">
              {thumbnailUri ? "Thumbnail Changed" : "Choose a file"}
            </Text>
          </TouchableOpacity>
          <Text className="text-white text-lg mt-3">AI Prompt</Text>
          <TextInput
            className="bg-[#202029] text-white p-4 rounded-lg mt-2"
            placeholder="The AI prompt of your video......."
            placeholderTextColor="#666"
            value={aiPrompt}
            onChangeText={setAiPrompt}
          />
        </View>

        <TouchableOpacity
          className="bg-orange-500 w-full h-15 p-4 rounded-lg items-center mt-4"
          onPress={async () => {
            console.log("Mevcut video URI:", videoUri);

            if (!videoUri) {
              alert("Lütfen bir video seçin!");
              return;
            }
            if (!title.trim()) {
              alert("Lütfen bir başlık girin!");
              return;
            }

            setIsUploading(true);
            try {
              // Burada video yükleme işlemini gerçekleştirin
              // Örnek olarak bir gecikme ekleyelim
              await new Promise((resolve) => setTimeout(resolve, 2000));

              // Başarılı yükleme sonrası
              alert("Video başarıyla yüklendi!");
              router.push("/home");
            } catch (error) {
              console.error("Video yüklenirken hata:", error);
              alert("Video yüklenirken bir hata oluştu.");
            } finally {
              setIsUploading(false);
            }
          }}
          disabled={isUploading}
        >
          <Text className="text-black font-bold">
            {isUploading ? "Yükleniyor..." : "Submit & Publish"}
          </Text>
        </TouchableOpacity>
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
              params: { username: username },
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
