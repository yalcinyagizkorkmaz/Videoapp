import { Text, View, TouchableOpacity, TextInput } from "react-native";
import React, { useState } from "react";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Alert, Linking } from "react-native";
import * as FileSystem from "expo-file-system";

export default function Create() {
  const router = useRouter();
  const { username } = useLocalSearchParams();
  const [videoUri, setVideoUri] = useState(null);
  const [title, setTitle] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [thumbnailUri, setThumbnailUri] = useState(null);
  const [aiPrompt, setAiPrompt] = useState("");

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

  const pickVideo = async () => {
    try {
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          "İzin Gerekli",
          "Video seçmek için galeri iznine ihtiyacımız var!",
          [
            { text: "İptal" },
            { text: "Ayarlara Git", onPress: () => Linking.openSettings() },
          ]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
        allowsEditing: true,
        aspect: [16, 9],
        quality: 1,
        videoMaxDuration: 300,
        presentationStyle: "fullScreen",
      });

      if (!result.canceled) {
        const videoAsset = result.assets[0];
        console.log("Seçilen video:", videoAsset); // Hata ayıklama için
        setVideoUri(videoAsset.uri);
      } else {
        console.log("Video seçimi iptal edildi");
      }
    } catch (error) {
      console.error("Video seçiminde hata:", error);
      Alert.alert("Hata", "Video seçilirken bir hata oluştu: " + error.message);
    }
  };

  const handleSubmit = async () => {
    if (!videoUri) {
      alert("Lütfen bir video seçin!");
      return;
    }
    if (!title.trim()) {
      alert("Lütfen bir başlık girin!");
      return;
    }
    if (!thumbnailUri) {
      alert("Lütfen bir thumbnail seçin!");
      return;
    }

    setIsUploading(true);
    try {
      // Video boyutunu kontrol et
      const videoInfo = await FileSystem.getInfoAsync(videoUri);
      const videoSize = videoInfo.size;
      const maxSize = 100 * 1024 * 1024; // 100MB limit

      if (videoSize > maxSize) {
        alert("Video boyutu 100MB'dan küçük olmalıdır!");
        return;
      }

      // Burada gerçek API çağrısı yapılacak
      const formData = new FormData();
      formData.append("video", {
        uri: videoUri,
        type: "video/mp4",
        name: "video.mp4",
      });
      formData.append("thumbnail", {
        uri: thumbnailUri,
        type: "image/jpeg",
        name: "thumbnail.jpg",
      });
      formData.append("title", title);
      formData.append("aiPrompt", aiPrompt);

      // API çağrısı örneği
      // const response = await fetch('YOUR_API_ENDPOINT', {
      //   method: 'POST',
      //   body: formData
      // });

      // Simülasyon için:
      await new Promise((resolve) => setTimeout(resolve, 2000));

      alert("Video başarıyla yüklendi!");
      router.push("/home");
    } catch (error) {
      console.error("Video yüklenirken hata:", error);
      alert("Video yüklenirken bir hata oluştu: " + error.message);
    } finally {
      setIsUploading(false);
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
          onPress={handleSubmit}
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
