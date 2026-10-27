import { useSafeAreaInsets } from "react-native-safe-area-context";
import { fetchApi } from "../services/api";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/authSlice";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../constants";

const Login = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = "Vui lòng nhập tên đăng nhập";
    }

    if (!password.trim()) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    } else if (password.length < 6) {
      newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetchApi("/api/user/sign-in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      if (response.ok && data.status === "OK") {
        const { id, access_token, isAdmin, fullname } = data;
        const displayName = fullname || username;
        dispatch(
          setUser({
            userId: id,
            token: access_token,
            isAdmin,
            fullname: displayName,
          }),
        );
        await AsyncStorage.setItem("token", access_token);
        await AsyncStorage.setItem("username", username);
        await AsyncStorage.setItem("fullname", displayName);

        Toast.show({
          type: "success",
          text1: `Chào mừng ${displayName}`,
          text2: data.message,
        });
        navigation.navigate("Home");
      } else {
        Toast.show({
          type: "error",
          text1: "Đăng nhập thất bại",
          text2: data.message,
        });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Đã xảy ra lỗi, vui lòng thử lại",
      });
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      {/* Nút quay về trang chủ */}
      <TouchableOpacity
        style={[styles.backButton, { top: insets.top + 8 }]}
        onPress={() => navigation.navigate("Home")}
      >
        <Ionicons name="arrow-back" size={24} color="#333" />
        <Text style={styles.backButtonText}>Trang chủ</Text>
      </TouchableOpacity>

      <Text style={styles.headerText}>Đăng nhập</Text>

      {/* Ô nhập tên đăng nhập */}
      <TextInput
        style={[styles.input, errors.username && styles.inputError]}
        placeholder="Tên đăng nhập"
        value={username}
        onChangeText={(text) => {
          setUsername(text);
          setErrors({ ...errors, username: "" });
        }}
        autoCapitalize="none"
      />
      {errors.username && (
        <Text style={styles.errorText}>{errors.username}</Text>
      )}

      {/* Ô nhập mật khẩu */}
      <TextInput
        style={[styles.input, errors.password && styles.inputError]}
        placeholder="Mật khẩu"
        secureTextEntry
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          setErrors({ ...errors, password: "" });
        }}
      />
      {errors.password && (
        <Text style={styles.errorText}>{errors.password}</Text>
      )}

      {/* Quên mật khẩu */}
      <TouchableOpacity
        style={styles.forgotContainer}
        onPress={() => navigation.navigate("ForgotPassword")}
      >
        <Text style={styles.forgotPasswordText}>Quên mật khẩu?</Text>
      </TouchableOpacity>

      {/* Nút đăng nhập */}
      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginButtonText}>Đăng nhập</Text>
      </TouchableOpacity>

      {/* Đăng ký */}
      <TouchableOpacity
        style={styles.signupContainer}
        onPress={() => navigation.navigate("Signup")}
      >
        <Text style={styles.footerText}>
          Chưa có tài khoản? <Text style={styles.linkText}>Đăng ký</Text>
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 20,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  backButtonText: {
    fontSize: 16,
    color: "#333",
    marginLeft: 5,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    color: "#333",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingLeft: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  forgotContainer: {
    alignSelf: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: colors.buttonColor,
    fontSize: 14,
  },
  loginButton: {
    width: "100%",
    backgroundColor: colors.buttonColor,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  loginButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  signupContainer: {
    marginTop: 5,
  },
  footerText: {
    fontSize: 16,
    color: "#333",
  },
  linkText: {
    color: colors.buttonColor,
    fontWeight: "bold",
  },
});

export default Login;
