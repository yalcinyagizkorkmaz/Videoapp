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

export default function Login() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [emailError, setEmailError] = useState("");

  const validateEmail = (text) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmail(text);

    if (text.length > 0 && !emailRegex.test(text)) {
      setEmailError("Please enter a valid email address!");
    } else {
      setEmailError("");
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
          onChangeText={setUsername}
        />
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
          onPress={() => router.push("/home")}
        >
          <Text className="text-black text-center font-bold">Sign Up</Text>
        </TouchableOpacity>

        <View className="flex-row justify-center">
          <Text className="text-white">Already have an account? </Text>
          <Link href="/login" className="font-bold text-white">
            <Text className="text-orange-500">Login</Text>
          </Link>
        </View>
      </View>
    </View>
  );
}
