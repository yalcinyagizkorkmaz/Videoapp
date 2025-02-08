import {
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { Link, router } from "expo-router";
import "nativewind";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = Platform.select({
  ios: "http://192.168.1.6:8000", // Bilgisayarınızın IP adresi
  android: "http://192.168.1.6:8000",
  default: "http://192.168.1.6:8000", // Bilgisayarınızın IP adresi
});

// Debug için daha detaylı loglar ekleyelim
console.log("Current API URL:", API_URL);

export default function Login() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (text) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmail(text);

    if (text.length === 0) {
      setEmailError("Email is required!");
    } else if (!emailRegex.test(text)) {
      setEmailError("Enter a valid email address!");
    } else {
      setEmailError("");
    }
  };

  const validateUsername = (text) => {
    setUsername(text);
    if (text.length === 0) {
      setUsernameError("Username is required!");
    } else {
      setUsernameError("");
    }
  };

  const handleLogin = async () => {
    try {
      console.log("Platform:", Platform.OS);
      console.log("API URL:", API_URL);
      console.log("Request data:", {
        username: username.trim(),
        userpassword: password.trim(),
      });

      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          username: username.trim(),
          userpassword: password.trim(),
        }),
        timeout: 5000,
      });

      console.log("Response:", {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
      });

      if (response.status === 401) {
        alert("Kullanıcı adı veya şifre hatalı!");
        return;
      }

      if (!response.ok) {
        throw new Error("Giriş işlemi başarısız oldu");
      }

      const data = await response.json();
      await AsyncStorage.setItem("access_token", data.access_token);
      await AsyncStorage.setItem("username", username);

      // Ana sayfaya yönlendir
      router.push({
        pathname: "/home",
        params: { username: username },
      });
    } catch (error) {
      console.error("Detailed error:", {
        message: error.message,
        stack: error.stack,
        platform: Platform.OS,
        apiUrl: API_URL,
      });
      setError("Bağlantı hatası. Lütfen tekrar deneyin.");
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-black p-4">
      <Image
        source={require("../assets/images/logo.png")}
        className="w-115px h-34px"
      />

      <View className="w-full space-y-4 mt-8">
        <Text className="text-white text-4xl font-bold">Login</Text>
        <Text className="text-white">Username</Text>
        <TextInput
          className="w-full bg-white p-4 rounded-lg"
          placeholder="Your unique username"
          value={username}
          onChangeText={validateUsername}
        />

        <Text className="text-white">Şifre</Text>
        <TextInput
          className="w-full bg-white p-4 rounded-lg"
          placeholder="Şifreniz"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <Text className="text-white text-right">Forgot password</Text>

        <TouchableOpacity
          className="w-full bg-orange-500 p-4 rounded-lg"
          onPress={handleLogin}
        >
          <Text className="text-black text-center font-bold">Login</Text>
        </TouchableOpacity>

        <View className="flex-row justify-center">
          <Text className="text-white">Already have an account? </Text>
          <Link href="/signup" className="font-bold text-white">
            <Text className="text-orange-500">Sign Up</Text>
          </Link>
        </View>
      </View>
    </View>
  );
}
