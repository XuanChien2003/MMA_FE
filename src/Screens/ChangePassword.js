import { SafeAreaView } from "react-native-safe-area-context";
import { fetchApi } from "../services/api";
import React, { useState, useEffect } from "react";
import Toast from "react-native-toast-message";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import { colors } from "../constants";

const ChangePassword = () => {
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [storedUsername, setStoredUsername] = useState(null);

  useEffect(() => {
    const fetchStoredUsername = async () => {
      try {
        const savedUsername = await AsyncStorage.getItem("username");
        if (savedUsername) {
          setStoredUsername(savedUsername);
        } else {
          Toast.show({
            type: "error",
            text1: "Lỗi",
            text2: "Bạn cần đăng nhập để đổi mật khẩu.",
          });
          navigation.navigate("Login");
        }
      } catch (error) {
        console.error("Error fetching stored username:", error);
        Toast.show({
          type: "error",
          text1: "Lỗi",
          text2: "Đã xảy ra lỗi. Vui lòng thử lại.",
        });
      }
    };
    fetchStoredUsername();
  }, []);

  const handlePasswordReset = async () => {
    if (
      !username.trim() ||
      !oldPassword.trim() ||
      !newPassword.trim() ||
      !confirmPassword.trim()
    ) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Vui lòng nhập đầy đủ thông tin.",
      });
      return;
    }
    if (username !== storedUsername) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Tên đăng nhập không đúng.",
      });
      return;
    }

    if (newPassword !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Mật khẩu mới và mật khẩu xác nhận không khớp.",
      });
      return;
    }

    try {
      const response = await fetchApi("/api/user/change-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          oldPassword,
          newPassword,
          confirmPassword,
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === "OK") {
        Toast.show({
          type: "success",
          text1: "Thành công",
          text2: "Đổi mật khẩu thành công.",
        });
        setUsername("");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
        navigation.navigate("Home");
      } else {
        Toast.show({
          type: "error",
          text1: "Thất bại",
          text2: data.message || "Đã xảy ra lỗi.",
        });
      }
    } catch (error) {
      console.error("Error:", error);
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Đã xảy ra lỗi. Vui lòng thử lại.",
      });
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header với nút trở lại */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <ArrowLeftIcon size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Đổi mật khẩu</Text>
        </View>

        <View style={styles.formContainer}>
          <TextInput
            style={styles.input}
            placeholder="Tên đăng nhập"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
          />
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu cũ"
            secureTextEntry
            value={oldPassword}
            onChangeText={setOldPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu mới"
            secureTextEntry
            value={newPassword}
            onChangeText={setNewPassword}
          />
          <TextInput
            style={styles.input}
            placeholder="Xác nhận mật khẩu mới"
            secureTextEntry
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />

          <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
            <Text style={styles.buttonText}>Đổi mật khẩu</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#F5F5F5",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
  },
  backButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  formContainer: {
    flex: 1,
    justifyContent: "center",
    paddingBottom: 80,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    paddingLeft: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
  },
  button: {
    backgroundColor: colors.buttonColor,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ChangePassword;
