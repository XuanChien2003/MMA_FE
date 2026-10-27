import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import api from "../services/api";
import { Ionicons } from "@expo/vector-icons";
import Toast from "react-native-toast-message";
import { colors } from "../constants";

const Signup = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [fullname, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({}); // State để lưu trữ thông báo lỗi

  // Hàm kiểm tra định dạng email
  const validateEmail = (email) => {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    return re.test(email);
  };

  // Hàm kiểm tra số điện thoại
  const validatePhone = (phone) => {
    return /^\d+$/.test(phone);
  };

  // Hàm kiểm tra dữ liệu
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

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
    } else if (confirmPassword !== password) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
    }

    if (!email.trim()) {
      newErrors.email = "Vui lòng nhập email";
    } else if (!validateEmail(email)) {
      newErrors.email = "Định dạng email không hợp lệ";
    }

    if (!fullname.trim()) {
      newErrors.fullname = "Vui lòng nhập họ và tên";
    }

    if (!phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (!validatePhone(phone)) {
      newErrors.phone = "Số điện thoại chỉ chứa số";
    }

    if (!address.trim()) {
      newErrors.address = "Vui lòng nhập địa chỉ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Trả về true nếu không có lỗi
  };

  const handleSignup = async () => {
    if (!validateForm()) {
      return; // Dừng lại nếu có lỗi
    }

    try {
      const response = await api.post("/api/user/sign-up", {
        username,
        password,
        confirmPassword,
        email,
        fullname,
        phone,
        address,
      });

      if (response.status === 201) {
        Toast.show({
          type: "success",
          text1: "Thành công",
          text2: response.data.message,
        });
        setUsername("");
        setPassword("");
        setConfirmPassword("");
        setEmail("");
        setFullName("");
        setPhone("");
        setAddress("");
        navigation.navigate("Login");
      }
    } catch (error) {
      console.error("Lỗi đăng ký:", error);
      if (error.response) {
        const data = error.response.data;
        let errMsg = data.message;
        if (data.errors && Array.isArray(data.errors)) {
          errMsg = data.errors.map((e) => e.message).join("\n");
        }
        Toast.show({
          type: "error",
          text1: "Lỗi",
          text2: errMsg || "Đã xảy ra lỗi. Vui lòng thử lại.",
        });
      } else {
        Toast.show({
          type: "error",
          text1: "Lỗi",
          text2: "Đã xảy ra lỗi. Vui lòng thử lại.",
        });
      }
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.headerText}>ĐĂNG KÝ</Text>

      {/* Tên đăng nhập */}
      <TextInput
        style={[styles.input, errors.username && styles.inputError]}
        placeholder="Tên đăng nhập"
        value={username}
        onChangeText={(text) => {
          setUsername(text);
          setErrors({ ...errors, username: "" });
        }}
      />
      {errors.username && (
        <Text style={styles.errorText}>{errors.username}</Text>
      )}

      {/* Mật khẩu */}
      <View
        style={[styles.passwordContainer, errors.password && styles.inputError]}
      >
        <TextInput
          style={styles.passwordInput}
          placeholder="Mật khẩu"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setErrors({ ...errors, password: "" });
          }}
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons
            name={showPassword ? "eye" : "eye-off"}
            size={22}
            color="#333"
          />
        </TouchableOpacity>
      </View>
      {errors.password && (
        <Text style={styles.errorText}>{errors.password}</Text>
      )}

      {/* Xác nhận mật khẩu */}
      <View
        style={[
          styles.passwordContainer,
          errors.confirmPassword && styles.inputError,
        ]}
      >
        <TextInput
          style={styles.passwordInput}
          placeholder="Xác nhận mật khẩu"
          secureTextEntry={!showConfirmPassword}
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            setErrors({ ...errors, confirmPassword: "" });
          }}
        />
        <TouchableOpacity
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          <Ionicons
            name={showConfirmPassword ? "eye" : "eye-off"}
            size={22}
            color="#333"
          />
        </TouchableOpacity>
      </View>
      {errors.confirmPassword && (
        <Text style={styles.errorText}>{errors.confirmPassword}</Text>
      )}

      {/* Họ và tên */}
      <TextInput
        style={[styles.input, errors.fullname && styles.inputError]}
        placeholder="Họ và tên"
        value={fullname}
        onChangeText={(text) => {
          setFullName(text);
          setErrors({ ...errors, fullname: "" });
        }}
      />
      {errors.fullname && (
        <Text style={styles.errorText}>{errors.fullname}</Text>
      )}

      {/* Email */}
      <TextInput
        style={[styles.input, errors.email && styles.inputError]}
        placeholder="Email"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setErrors({ ...errors, email: "" });
        }}
        keyboardType="email-address"
      />
      {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

      {/* Số điện thoại */}
      <TextInput
        style={[styles.input, errors.phone && styles.inputError]}
        placeholder="Số điện thoại"
        value={phone}
        onChangeText={(text) => {
          setPhone(text);
          setErrors({ ...errors, phone: "" });
        }}
        keyboardType="phone-pad"
      />
      {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}

      {/* Địa chỉ */}
      <TextInput
        style={[styles.input, errors.address && styles.inputError]}
        placeholder="Địa chỉ"
        value={address}
        onChangeText={(text) => {
          setAddress(text);
          setErrors({ ...errors, address: "" });
        }}
      />
      {errors.address && <Text style={styles.errorText}>{errors.address}</Text>}

      {/* Nút đăng ký */}
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>ĐĂNG KÝ</Text>
      </TouchableOpacity>

      {/* Nút quay lại đăng nhập */}
      <TouchableOpacity
        style={[styles.backButton, { top: insets.top + 8 }]}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.backButtonText}>QUAY LẠI ĐĂNG NHẬP</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    padding: 20,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingLeft: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },
  inputError: {
    borderColor: "red", // Highlight ô nhập khi có lỗi
  },
  errorText: {
    color: "red",
    fontSize: 14,
    alignSelf: "flex-start",
    marginBottom: 10,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height: 50,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    paddingLeft: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    paddingRight: 10,
  },
  passwordInput: {
    flex: 1,
    height: "100%",
  },
  button: {
    backgroundColor: colors.buttonColor,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  backButton: {
    marginTop: 15,
  },
  backButtonText: {
    fontSize: 16,
    color: colors.buttonColor,
    textDecorationLine: "underline",
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#ffffff",
    borderRadius: 10,
    paddingLeft: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    fontSize: 16,
  },
});

export default Signup;
