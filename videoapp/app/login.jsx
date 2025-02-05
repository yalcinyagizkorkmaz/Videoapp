import { Text, View, TouchableOpacity, Image, TextInput } from "react-native";
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

export default function Login() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [password, setPassword] = useState("");

  const validateEmail = (text) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmail(text);

    if (text.length === 0) {
      setEmailError("Email is required!");
    } else if (!emailRegex.test(text)) {
      setEmailError("Geçerli bir email adresi giriniz!");
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
      // Form verilerini kontrol et
      if (!username || !email) {
        if (!username) setUsernameError("Kullanıcı adı gerekli!");
        if (!email) setEmailError("Email gerekli!");
        return;
      }

      // Backend'e uygun şekilde JSON verisi gönder
      const response = await fetch("http://127.0.0.1:8000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          username: username,
          userEmail: email, // backend'deki modele uygun olarak değiştirildi
        }),
      });

      if (response.status === 401) {
        alert("Username or email is incorrect!");
        return;
      }

      if (!response.ok) {
        throw new Error("Giriş işlemi başarısız oldu");
      }

      const data = await response.json();
      await AsyncStorage.setItem("access_token", data.access_token);

      // Ana sayfaya yönlendir
      router.push("/home");
    } catch (error) {
      console.error("Giriş hatası:", error);
      alert("Giriş yapılırken bir hata oluştu: " + error.message);
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-black p-4">
      <Image
        source={require("../assets/images/logo.png")}
        className="w-115px h-34px"
      />

      <View className="w-full space-y-4 mt-8">
        <Text className="text-white text-4xl font-bold">Sign Up</Text>
        <Text className="text-white">Username</Text>
        <TextInput
          className="w-full bg-white p-4 rounded-lg"
          placeholder="Your unique username"
          value={username}
          onChangeText={validateUsername}
        />
        {usernameError ? (
          <Text className="text-red-500 text-sm">{usernameError}</Text>
        ) : null}
        <Text className="text-white">Email</Text>
        <TextInput
          className="w-full bg-white p-4 rounded-lg"
          placeholder="Your  email"
          value={email}
          onChangeText={validateEmail}
          keyboardType="email-address"
        />
        {emailError ? (
          <Text className="text-red-500 text-sm">{emailError}</Text>
        ) : null}
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
