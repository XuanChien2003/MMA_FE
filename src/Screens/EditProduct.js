import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Toast from "react-native-toast-message";
import { Picker } from "@react-native-picker/picker";
import api from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import { colors } from "../constants";

const EditProduct = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("active");
  const [image, setImage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigation = useNavigation();
  const route = useRoute();
  const { productId } = route.params;

  useEffect(() => {
    fetchProductDetails();
  }, []);

  const fetchProductDetails = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("Token is not available");
        return;
      }

      const response = await api.get(
        `/api/product/details-product/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const product = response.data.data;
      setName(product.name);
      setPrice(product.price.toString());
      setBrand(product.brand);
      setCountInStock(product.countInStock.toString());
      setDescription(product.description);
      setStatus(product.status);
      setImage(product.image);
    } catch (error) {
      console.error("Error fetching product details:", error);
    }
  };

  const handleUpdateProduct = async () => {
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
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("Token is not available");
        return;
      }

      const data = {
        name,
        price: Number(price),
        brand,
        countInStock: Number(countInStock),
        description,
        status,
        image,
      };

      const response = await api.put(
        `/api/product/update-product/${productId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (response.data.status === "OK") {
        Toast.show({
          type: "success",
          text1: "Thành công",
          text2: "Cập nhật sản phẩm thành công!",
        });
        navigation.navigate("ManageProduct");
      } else {
        Toast.show({
          type: "error",
          text1: "Lỗi",
          text2: response.data.message,
        });
      }
    } catch (error) {
      console.error(
        "Error updating product:",
        error.response?.data || error.message,
      );
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Đã xảy ra lỗi khi cập nhật sản phẩm.",
      });
    } finally {
      setLoading(false);
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
          <Text style={styles.headerTitle}>Chỉnh sửa sản phẩm</Text>
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
          placeholder="URL hình ảnh"
          value={image}
          onChangeText={setImage}
        />
        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Trạng thái:</Text>
          <Picker
            selectedValue={status}
            style={styles.picker}
            onValueChange={(itemValue) => setStatus(itemValue)}
          >
            <Picker.Item label="Hoạt động" value="active" />
            <Picker.Item label="Không hoạt động" value="inactive" />
          </Picker>
        </View>
        <TouchableOpacity
          style={styles.updateButton}
          onPress={handleUpdateProduct}
          disabled={loading}
        >
          <Text style={styles.updateButtonText}>
            {loading ? "Đang cập nhật..." : "Cập nhật sản phẩm"}
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
  pickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  pickerLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  picker: {
    flex: 1,
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  updateButton: {
    backgroundColor: colors.buttonColor,
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  updateButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default EditProduct;
