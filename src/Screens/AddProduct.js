import { SafeAreaView } from "react-native-safe-area-context";
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Toast from "react-native-toast-message";
import api from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import { colors } from "../constants";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(""); // Thêm state cho image
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();

  const handleAddProduct = async () => {
    if (!name || !price || !brand || !countInStock || !description || !image) {
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Vui lòng điền đầy đủ thông tin",
      });
      return;
    }

    try {
      setLoading(true);

      // Lấy token từ AsyncStorage
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        Toast.show({
          type: "error",
          text1: "Lỗi",
          text2: "Token không tồn tại. Vui lòng đăng nhập lại.",
        });
        return;
      }

      // Gửi yêu cầu POST đến server
      const response = await api.post(
        "/api/product/create-product",
        {
          name,
          price: Number(price), // Chuyển đổi price thành số
          brand,
          countInStock: Number(countInStock), // Chuyển đổi countInStock thành số
          description,
          image,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Thêm token vào header
          },
        },
      );

      // Xử lý phản hồi từ server
      if (response.data.status === "OK") {
        Toast.show({
          type: "success",
          text1: "Thành công",
          text2: "Thêm sản phẩm thành công!",
        });
        navigation.goBack(); // Quay lại trang trước đó
      } else {
        Toast.show({
          type: "error",
          text1: "Lỗi",
          text2: response.data.message || "Đã xảy ra lỗi không xác định.",
        });
      }
    } catch (error) {
      console.error("Lỗi khi thêm sản phẩm:", error);

      // Hiển thị thông báo lỗi chi tiết từ server
      if (error.response) {
        console.error("Phản hồi từ server:", error.response.data);
        Toast.show({
          type: "error",
          text1: "Lỗi",
          text2:
            error.response.data.message || "Đã xảy ra lỗi khi thêm sản phẩm.",
        });
      } else if (error.request) {
        console.error("Không nhận được phản hồi từ server:", error.request);
        Toast.show({
          type: "error",
          text1: "Lỗi",
          text2: "Không thể kết nối đến server. Vui lòng thử lại sau.",
        });
      } else {
        console.error("Lỗi khi thiết lập yêu cầu:", error.message);
        Toast.show({
          type: "error",
          text1: "Lỗi",
          text2: "Đã xảy ra lỗi khi gửi yêu cầu.",
        });
      }
    } finally {
      setLoading(false); // Tắt trạng thái loading
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
          <Text style={styles.headerTitle}>Thêm sản phẩm</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Tên sản phẩm"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Giá"
          value={price}
          onChangeText={setPrice}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Thương hiệu"
          value={brand}
          onChangeText={setBrand}
        />
        <TextInput
          style={styles.input}
          placeholder="Số lượng trong kho"
          value={countInStock}
          onChangeText={setCountInStock}
          keyboardType="numeric"
        />
        <TextInput
          style={styles.input}
          placeholder="Mô tả"
          value={description}
          onChangeText={setDescription}
          multiline
        />
        <TextInput
          style={styles.input}
          placeholder="Hình ảnh (URL)"
          value={image}
          onChangeText={setImage}
        />
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddProduct}
          disabled={loading}
        >
          <Text style={styles.addButtonText}>
            {loading ? "Đang thêm..." : "Thêm sản phẩm"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: "#f5f5f5",
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
  input: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    fontSize: 16,
  },
  addButton: {
    backgroundColor: colors.buttonColor,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AddProduct;
