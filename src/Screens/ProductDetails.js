import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import api from "../services/api";
import Toast from "react-native-toast-message";
import Header from "../Components/Header";
import ProductImage from "../Components/ProductImage";
import useCart from "../hooks/useCart";
import { fetchProduct } from "../services/catalog";
import { formatMoney } from "../utils/money";

export default function ProductDetailScreen() {
  const navigation = useNavigation();
  const { productId, source } = useRoute().params || {};
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setLoading(true);
    setProduct(null);
    setError("");
    const load = async () => {
      try {
        let result;
        if (source === "dummyjson") {
          result = await fetchProduct(productId, {
            signal: controller.signal,
            fresh: attempt > 0,
          });
        } else {
          const { data } = await api.get(
            `/api/product/details-product/${encodeURIComponent(productId)}`,
            { signal: controller.signal, timeout: 15000 },
          );
          if (!data.data) throw new Error("Missing product");
          result = { ...data.data, productId: data.data._id, currency: "VND" };
        }
        if (active) setProduct(result);
      } catch (failure) {
        if (active && !controller.signal.aborted)
          setError(
            failure.response?.status === 404
              ? "Sản phẩm không tồn tại."
              : "Không thể tải chi tiết sản phẩm. Vui lòng thử lại.",
          );
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
      controller.abort();
    };
  }, [productId, source, attempt]);
  return (
    <View style={styles.screen}>
      <Header />
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.back}
        accessibilityRole="button"
      >
        <Text style={styles.link}>← Trở lại</Text>
      </TouchableOpacity>
      {loading ? (
        <View style={styles.state}>
          <ActivityIndicator size="large" color="#1d4ed8" />
          <Text>Đang tải chi tiết...</Text>
        </View>
      ) : error ? (
        <View style={styles.state}>
          <Text accessibilityRole="alert">{error}</Text>
          <TouchableOpacity
            onPress={() => setAttempt((value) => value + 1)}
            style={styles.back}
            accessibilityRole="button"
          >
            <Text style={styles.link}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : product ? (
        <>
          <ScrollView contentContainerStyle={styles.content}>
            <ProductImage uri={product.image} style={styles.image} />
            <Text style={styles.title}>{product.name}</Text>
            <Text style={styles.brand}>{product.brand}</Text>
            <Text style={styles.price}>
              {formatMoney(product.price, product.currency)}
            </Text>
            <Text style={styles.description}>
              {product.description || "Chưa có mô tả sản phẩm."}
            </Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                addItem(product);
                Toast.show({
                  type: "success",
                  text1: "Đã thêm vào giỏ",
                  text2: product.name,
                });
              }}
              accessibilityRole="button"
            >
              <Text style={styles.buttonText}>Thêm vào giỏ hàng</Text>
            </TouchableOpacity>
          </ScrollView>
        </>
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#fff" },
  back: { padding: 18 },
  link: { color: "#1d4ed8", fontWeight: "600" },
  state: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 16,
  },
  content: {
    padding: 20,
    width: "100%",
    maxWidth: 800,
    alignSelf: "center",
    paddingBottom: 40,
  },
  image: { width: "100%", height: 300, borderRadius: 14 },
  title: { fontSize: 26, fontWeight: "700", marginTop: 20, color: "#0f172a" },
  brand: { color: "#64748b", marginTop: 8 },
  price: {
    fontWeight: "700",
    fontSize: 24,
    color: "#1d4ed8",
    marginVertical: 18,
  },
  description: { fontSize: 16, color: "#334155", lineHeight: 26 },
  button: {
    padding: 16,
    backgroundColor: "#1d4ed8",
    borderRadius: 10,
    alignItems: "center",
    marginTop: 24,
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
});
