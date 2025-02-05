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

// API URL'ini platform bazlı ayarla
const API_URL = Platform.select({
  ios: "http://192.168.1.6:8000", // Bilgisayarınızın IP adresi
  android: "http://10.0.2.2:8000",
  default: "http://192.168.1.6:8000", // Bilgisayarınızın IP adresi
});

console.log("Current API URL:", API_URL);

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateEmail = (text) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmail(text);

    if (text.length > 0 && !emailRegex.test(text)) {
      setEmailError("Please enter a valid email address!");
    } else {
      setEmailError("");
    }
  };

  const handleSignup = async () => {
    let hasError = false;

    if (!username.trim()) {
      setUsernameError("Username is required!");
      hasError = true;
    } else if (username.length < 3) {
      setUsernameError("Username must be at least 3 characters long!");
      hasError = true;
    }

    if (!email.trim()) {
      setEmailError("Email is required!");
      hasError = true;
    } else if (!email.includes("@")) {
      setEmailError("Please enter a valid email address!");
      hasError = true;
    }

    if (!password.trim()) {
      setPasswordError("Password is required!");
      hasError = true;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long!");
      hasError = true;
    }

    if (!hasError) {
      try {
        const response = await fetch(`${API_URL}/users/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            username: username.trim(),
            userEmail: email.trim(),
            userpassword: password.trim(),
          }),
        });

        // Hata ayıklama için log ekleyelim
        console.log("Response status:", response.status);

        const data = await response.json();

        if (response.ok) {
          router.push({
            pathname: "/home",
            params: { username: username },
          });
        } else {
          if (data.detail) {
            if (data.detail.includes("kullanıcı adı")) {
              setUsernameError("Bu kullanıcı adı zaten kullanılıyor");
            } else if (data.detail.includes("e-posta")) {
              setEmailError("Bu e-posta adresi zaten kullanılıyor");
            } else {
              setPasswordError(data.detail);
            }
          } else {
            setPasswordError("Beklenmeyen bir hata oluştu");
          }
        }
      } catch (error) {
        console.error("Kayıt hatası detayı:", {
          message: error.message,
          platform: Platform.OS,
          apiUrl: API_URL,
        });
        setPasswordError("Bağlantı hatası. Lütfen tekrar deneyin.");
      }
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
        {usernameError ? (
          <Text className="text-red-500 text-sm">{usernameError}</Text>
        ) : null}
        <Text className="text-white">Email</Text>
        <TextInput
          className="w-full bg-white p-4 rounded-lg"
          placeholder="Email adresiniz"
          value={email}
          onChangeText={validateEmail}
          keyboardType="email-address"
        />
        {emailError ? (
          <Text className="text-red-500 text-sm">{emailError}</Text>
        ) : null}
        <Text className="text-white">Password</Text>
        <View className="relative w-full">
          <TextInput
            className="w-full bg-white p-4 rounded-lg pr-12"
            placeholder="Your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          <TouchableOpacity
            className="absolute right-4 top-[25%] -translate-y-1/2"
            onPress={() => setShowPassword(!showPassword)}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>
        {passwordError ? (
          <Text className="text-red-500 text-sm">{passwordError}</Text>
        ) : null}

        <TouchableOpacity
          className="w-full bg-orange-500 p-4 rounded-lg"
          onPress={handleSignup}
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
