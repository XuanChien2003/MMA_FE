import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  TouchableOpacity,
} from "react-native";
import api from "../services/api";
import { useRoute, useNavigation } from "@react-navigation/native";
import { ArrowLeftIcon } from "react-native-heroicons/outline";

const OrderDetail = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { orderId } = route.params;
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await api.get(`/api/order/get-order-by-id/${orderId}`);
        if (response.data.status === "OK") {
          setOrder(response.data.data);
        } else {
          console.error("Failed to fetch order details");
        }
      } catch (error) {
        console.error("Error fetching order details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      </SafeAreaView>
    );
  }

  if (!order) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.notFoundText}>Không tìm thấy đơn hàng</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header với nút trở lại */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <ArrowLeftIcon size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chi tiết đơn hàng</Text>
        </View>

        {/* Nội dung chi tiết đơn hàng */}
        <ScrollView>
          <View style={styles.orderInfoContainer}>
            <Text style={styles.orderId}>Mã đơn hàng: {order._id}</Text>
            <Text style={styles.orderDate}>
              Ngày đặt hàng: {new Date(order.orderDate).toLocaleDateString()}
            </Text>
            <Text style={styles.totalPrice}>
              Tổng tiền: {order.totalPrice.toLocaleString("vi-VN")} VNĐ
            </Text>
          </View>

          <View style={styles.productList}>
            <Text style={styles.sectionHeader}>Sản phẩm:</Text>
            {order.products.map((item, index) => (
              <View key={index} style={styles.productItem}>
                <Image
                  source={{
                    uri: item.productId
                      ? item.productId.image
                      : "https://via.placeholder.com/80?text=No+Image",
                  }}
                  style={styles.productImage}
                />
                <View style={styles.productDetails}>
                  <Text style={styles.productName}>{item.name}</Text>
                  <Text style={styles.productQuantity}>
                    Số lượng: {item.quantity}
                  </Text>
                  <Text style={styles.productPrice}>
                    Giá:{" "}
                    {item.productId
                      ? item.productId.price.toLocaleString("vi-VN")
                      : "N/A"}{" "}
                    VNĐ
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#f7f7f7",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
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
  orderInfoContainer: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  orderId: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 8,
  },
  orderDate: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#e74c3c",
  },
  productList: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  productItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 16,
  },
  productDetails: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 4,
  },
  productQuantity: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#e74c3c",
  },
  notFoundText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
});

export default OrderDetail;
