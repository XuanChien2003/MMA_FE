import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import api from "../services/api";
import Toast from "react-native-toast-message";
import { useSelector } from "react-redux";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import { colors } from "../constants";

const ManageProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const userId = useSelector((state) => state.auth.userId);

  const fetchProducts = async () => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("Token is not available");
        return;
      }

      const response = await api.get("/api/product/get-all-product", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProducts(response.data.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, []),
  );
  const truncateDescription = (text, maxLength) => {
    if (text.length > maxLength) {
      return text.substring(0, maxLength) + "...";
    }
    return text;
  };
  const handleDeleteProduct = async (productId) => {
    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        console.error("Token is not available");
        return;
      }

      const response = await api.delete(
        `/api/product/delete-product/${productId}`,
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
          text2: "Xóa sản phẩm thành công!",
        });
        fetchProducts();
      } else {
        Toast.show({
          type: "error",
          text1: "Lỗi",
          text2: response.data.message,
        });
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      Toast.show({
        type: "error",
        text1: "Lỗi",
        text2: "Đã xảy ra lỗi khi xóa sản phẩm.",
      });
    }
  };

  const renderProductItem = ({ item }) => (
    <View style={styles.productItem}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productPrice}>Giá: {item.price} VNĐ</Text>
        <Text style={styles.productBrand}>Thương hiệu: {item.brand}</Text>
        <Text style={styles.productStock}>
          Số lượng trong kho: {item.countInStock}
        </Text>
        <Text style={styles.productDescription}>
          Mô tả: {truncateDescription(item.description, 50)}{" "}
          {/* Giới hạn 50 ký tự */}
        </Text>
        <Text style={styles.productStatus}>
          Trạng thái:{" "}
          {item.status === "active" ? "Hoạt động" : "Ngừng hoạt động"}
        </Text>
      </View>
      <View style={styles.actionsContainer}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate("EditProduct", { productId: item._id })
          }
        >
          <Ionicons
            name="pencil"
            size={24}
            color="#007bff"
            style={{ marginRight: 15 }}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleDeleteProduct(item._id)}>
          <Ionicons name="trash" size={24} color="#ff4d4d" />
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.buttonColor} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.navigate("Home")}
          >
            <ArrowLeftIcon size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Quản lý sản phẩm</Text>
        </View>

        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate("AddProduct")}
        >
          <Text style={styles.addButtonText}>Thêm sản phẩm</Text>
        </TouchableOpacity>
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          renderItem={renderProductItem}
          contentContainerStyle={styles.listContainer}
        />
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  addButton: {
    backgroundColor: colors.buttonColor,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  addButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  listContainer: {
    paddingBottom: 20,
  },
  productItem: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
  },
  productImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    marginRight: 15,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  productPrice: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  productBrand: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  productStock: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  productDescription: {
    fontSize: 16,
    color: "#555",
    marginBottom: 5,
  },
  productStatus: {
    fontSize: 16,
    marginBottom: 5,
  },
  actionsContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
});

export default ManageProduct;
