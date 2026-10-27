import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import Header from "../Components/Header";
import ProductCard from "../Components/ProductCard";
import useProducts from "../hooks/useProducts";
import useCart from "../hooks/useCart";
import { fetchShopProducts } from "../services/shopCatalog";
import api from "../services/api";

export default function ProductListScreen({ shop = false }) {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [brands, setBrands] = useState([]);
  const [brand, setBrand] = useState("");
  const fetchShopPage = useCallback(
    (options) => fetchShopProducts({ ...options, brand }),
    [brand],
  );
  useEffect(() => {
    if (!shop) return;
    const controller = new AbortController();
    api
      .get("/api/product/get-all-brand", { signal: controller.signal })
      .then(({ data }) => {
        if (Array.isArray(data.data)) setBrands(data.data);
      })
      .catch(() => {
        /* Keep product search available if the optional brand list fails. */
      });
    return () => controller.abort();
  }, [shop]);
  const {
    products,
    total,
    loading,
    refreshing,
    error,
    loadMore,
    refresh,
    hasMore,
  } = useProducts(query, shop ? fetchShopPage : undefined);
  const { addItem, itemCount } = useCart();
  useEffect(() => {
    const timer = setTimeout(() => setQuery(search.trim()), 350);
    return () => clearTimeout(timer);
  }, [search]);
  const columns = width >= 1000 ? 4 : width >= 650 ? 3 : width < 340 ? 1 : 2;
  const cardWidth = (width - 24) / columns - 12;
  const add = (product) => {
    addItem(product);
    Toast.show({
      type: "success",
      text1: "Đã thêm vào giỏ",
      text2: product.name,
    });
  };
  return (
    <View style={styles.screen}>
      <Header />
      <View style={styles.heading}>
        <Text style={styles.title}>
          {shop ? "Sản phẩm cửa hàng" : "Khám phá sản phẩm"}
        </Text>
        <Text style={styles.caption}>
          {shop
            ? "Sản phẩm từ MongoDB · Giá VNĐ"
            : "Danh mục mẫu · DummyJSON · Giá USD"}
        </Text>
        <View style={styles.links}>
          <TouchableOpacity
            onPress={() => navigation.navigate(shop ? "Home" : "ShopHome")}
            accessibilityRole="button"
          >
            <Text style={styles.link}>
              {shop ? "Danh mục API mẫu" : "Sản phẩm cửa hàng"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Cart")}
            accessibilityRole="button"
          >
            <Text style={styles.link}>Giỏ hàng ({itemCount})</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate("ConnectionStatus")}
          accessibilityRole="button"
          style={{ paddingBottom: 12 }}
        >
          <Text style={styles.link}>Kiểm tra kết nối điện thoại</Text>
        </TouchableOpacity>
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Tìm kiếm sản phẩm..."
          accessibilityLabel="Tìm kiếm sản phẩm"
          style={styles.search}
          autoCorrect={false}
          returnKeyType="search"
          clearButtonMode="while-editing"
        />
        <Text style={styles.caption}>
          {products.length} / {total} sản phẩm
        </Text>
        {shop && brands.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginTop: 10 }}
          >
            {["", ...brands].map((value) => (
              <TouchableOpacity
                key={value || "all"}
                accessibilityRole="button"
                accessibilityState={{ selected: brand === value }}
                onPress={() => setBrand(value)}
                style={{
                  padding: 10,
                  marginRight: 8,
                  borderRadius: 8,
                  backgroundColor: brand === value ? "#dbeafe" : "#f1f5f9",
                }}
              >
                <Text style={styles.link}>{value || "Tất cả thương hiệu"}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        ) : null}
      </View>
      <FlatList
        key={columns}
        data={products}
        numColumns={columns}
        keyExtractor={(item) => item.productId}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            width={cardWidth}
            onPress={() =>
              navigation.navigate("ProductDetails", {
                productId: item.id,
                source: item.source,
              })
            }
            onAdd={() => add(item)}
          />
        )}
        onEndReached={() => {
          if (!error && query === search.trim()) loadMore();
        }}
        onEndReachedThreshold={0.4}
        refreshing={refreshing}
        onRefresh={refresh}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.state}>
            {loading ? (
              <>
                <ActivityIndicator size="large" color="#1d4ed8" />
                <Text style={styles.caption}>Đang tải sản phẩm...</Text>
              </>
            ) : !error ? (
              <Text>Không tìm thấy sản phẩm. Thử từ khóa khác.</Text>
            ) : null}
          </View>
        }
        ListFooterComponent={
          <View style={styles.state}>
            {loading && products.length > 0 && !refreshing ? (
              <ActivityIndicator color="#1d4ed8" />
            ) : null}
            {error ? (
              <>
                <Text style={styles.error} accessibilityRole="alert">
                  {error}
                </Text>
                <TouchableOpacity
                  onPress={products.length ? loadMore : refresh}
                  style={styles.retry}
                  accessibilityRole="button"
                >
                  <Text style={styles.link}>Thử lại</Text>
                </TouchableOpacity>
              </>
            ) : !loading && products.length > 0 && !hasMore ? (
              <Text style={styles.caption}>Đã hiển thị tất cả sản phẩm</Text>
            ) : null}
          </View>
        }
      />
    </View>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f8fafc" },
  heading: { padding: 18, backgroundColor: "#fff" },
  title: { fontSize: 25, fontWeight: "700", color: "#0f172a" },
  caption: { color: "#64748b", marginTop: 8 },
  links: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
    marginVertical: 12,
  },
  link: { color: "#1d4ed8", fontWeight: "600" },
  search: {
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
  },
  list: { padding: 12, flexGrow: 1 },
  state: { alignItems: "center", padding: 24 },
  error: { color: "#b91c1c", textAlign: "center" },
  retry: { padding: 14, marginTop: 8 },
});
