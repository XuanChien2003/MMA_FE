import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Toast from "react-native-toast-message";

import Header from "../Components/Header";
import ProductCard from "../Components/ProductCard";
import useProducts from "../hooks/useProducts";
import useCart from "../hooks/useCart";
import { fonts, palette as c, MAX_WIDTH } from "../theme/storefront";

export default function ProductListScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");

  // Debounce search query to prevent spamming API on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      setQuery(search.trim());
    }, 400);
    return () => clearTimeout(timer);
  }, [search]);

  const { products, total, loading, error, loadMore, hasMore, refresh } =
    useProducts(query);
  const { addItem } = useCart();

  // Responsive column layout
  const columns = width >= 1120 ? 4 : width >= 720 ? 3 : width < 380 ? 1 : 2;
  const gutter = width >= 768 ? 20 : 12;
  const containerWidth = Math.min(width, MAX_WIDTH);
  const cardWidth = (containerWidth - gutter * 2) / columns - 16;

  const handleOpenDetail = (product) => {
    navigation.navigate("ProductDetail", { productId: product.productId });
  };

  const handleAddToCart = (product) => {
    const success = addItem(product);
    if (success) {
      Toast.show({
        type: "success",
        text1: "Đã thêm vào giỏ hàng",
        text2: product.name || product.title,
      });
    } else {
      Toast.show({
        type: "error",
        text1: "Không thể thêm sản phẩm vào giỏ",
      });
    }
  };

  return (
    <View style={styles.screen}>
      <Header title="Danh sách sản phẩm" />

      <FlatList
        key={columns}
        data={products}
        numColumns={columns}
        keyExtractor={(item) => item.productId}
        keyboardShouldPersistTaps="handled"
        style={styles.list}
        contentContainerStyle={[
          styles.content,
          {
            paddingHorizontal: gutter,
            paddingBottom: insets.bottom + 32,
          },
        ]}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            width={cardWidth}
            onPress={() => handleOpenDetail(item)}
            onAdd={() => handleAddToCart(item)}
          />
        )}
        onEndReached={() => {
          if (!loading && hasMore) {
            loadMore();
          }
        }}
        onEndReachedThreshold={0.4}
        ListHeaderComponent={
          <View style={styles.header}>
            <View style={styles.searchBar}>
              <Ionicons name="search-outline" size={20} color={c.muted} />
              <TextInput
                value={search}
                onChangeText={setSearch}
                style={styles.searchInput}
                placeholder="Tìm kiếm sản phẩm (ví dụ: iPhone, Samsung, laptop...)"
                placeholderTextColor={c.muted}
                accessibilityLabel="Ô tìm kiếm sản phẩm"
                autoCorrect={false}
                returnKeyType="search"
              />
              {search.length > 0 ? (
                <TouchableOpacity
                  onPress={() => setSearch("")}
                  style={styles.clearButton}
                  accessibilityRole="button"
                  accessibilityLabel="Xóa từ khóa tìm kiếm"
                >
                  <Ionicons name="close-circle" size={18} color={c.muted} />
                </TouchableOpacity>
              ) : null}
            </View>

            <View style={styles.statusBar}>
              <Text style={styles.statusTitle}>
                {query ? `Kết quả tìm kiếm cho "${query}"` : "Tất cả sản phẩm"}
              </Text>
              <Text style={styles.statusCount}>
                {loading && products.length === 0
                  ? "Đang tải..."
                  : `${products.length} / ${total} sản phẩm`}
              </Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            {loading ? (
              <View style={styles.loadingBox}>
                <ActivityIndicator size="large" color={c.green} />
                <Text style={styles.stateText}>Đang tải dữ liệu sản phẩm...</Text>
              </View>
            ) : error ? (
              <View style={styles.errorBox}>
                <Ionicons name="alert-circle-outline" size={44} color="#ef4444" />
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={refresh}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                >
                  <Text style={styles.retryButtonText}>Thử lại</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.noDataBox}>
                <Ionicons name="search-outline" size={44} color={c.muted} />
                <Text style={styles.emptyTitle}>Không tìm thấy sản phẩm</Text>
                <Text style={styles.stateText}>
                  Vui lòng thử lại với từ khóa tìm kiếm khác.
                </Text>
                <TouchableOpacity
                  style={styles.clearSearchBtn}
                  onPress={() => setSearch("")}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                >
                  <Text style={styles.clearSearchBtnText}>Xem tất cả sản phẩm</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        }
        ListFooterComponent={
          <View style={styles.footerContainer}>
            {loading && products.length > 0 ? (
              <View style={styles.footerLoading}>
                <ActivityIndicator color={c.green} size="small" />
                <Text style={styles.footerText}>Đang tải thêm sản phẩm...</Text>
              </View>
            ) : error && products.length > 0 ? (
              <View style={styles.footerError}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity
                  style={styles.retryButton}
                  onPress={loadMore}
                  activeOpacity={0.7}
                  accessibilityRole="button"
                >
                  <Text style={styles.retryButtonText}>Tải lại trang</Text>
                </TouchableOpacity>
              </View>
            ) : !hasMore && products.length > 0 ? (
              <Text style={styles.footerEndText}>
                Đã hiển thị toàn bộ {total} sản phẩm.
              </Text>
            ) : null}
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: c.canvas,
  },
  list: {
    width: "100%",
    maxWidth: MAX_WIDTH,
    alignSelf: "center",
  },
  content: {
    flexGrow: 1,
    paddingTop: 16,
  },
  header: {
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  searchBar: {
    minHeight: 48,
    backgroundColor: c.white,
    borderWidth: 1,
    borderColor: c.line,
    borderRadius: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  searchInput: {
    flex: 1,
    height: 48,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: c.ink,
  },
  clearButton: {
    padding: 6,
  },
  statusBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
    paddingHorizontal: 4,
  },
  statusTitle: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: c.ink,
  },
  statusCount: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: c.muted,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  loadingBox: {
    alignItems: "center",
    gap: 12,
  },
  errorBox: {
    alignItems: "center",
    gap: 12,
  },
  noDataBox: {
    alignItems: "center",
    gap: 10,
  },
  emptyTitle: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: c.ink,
  },
  stateText: {
    fontFamily: fonts.regular,
    color: c.muted,
    fontSize: 13,
    textAlign: "center",
  },
  errorText: {
    fontFamily: fonts.regular,
    color: "#ef4444",
    fontSize: 13,
    textAlign: "center",
  },
  retryButton: {
    marginTop: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: c.soft,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: c.line,
  },
  retryButtonText: {
    fontFamily: fonts.semibold,
    color: c.forest,
    fontSize: 13,
  },
  clearSearchBtn: {
    marginTop: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: c.forest,
    borderRadius: 8,
  },
  clearSearchBtnText: {
    fontFamily: fonts.semibold,
    color: c.white,
    fontSize: 12,
  },
  footerContainer: {
    paddingVertical: 24,
    alignItems: "center",
  },
  footerLoading: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  footerText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: c.muted,
  },
  footerError: {
    alignItems: "center",
    gap: 8,
  },
  footerEndText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: c.muted,
  },
});
