import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import Header from "../Components/Header";
import ProductCard from "../Components/ProductCard";
import CatalogHero from "../Components/CatalogHero";
import StoreFooter from "../Components/StoreFooter";
import useProducts from "../hooks/useProducts";
import useCart from "../hooks/useCart";
import { fetchShopProducts } from "../services/shopCatalog";
import api from "../services/api";
import { fonts, palette as c, MAX_WIDTH } from "../theme/storefront";

export default function Home() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const desktop = width >= 900;
  const list = useRef(null);
  const catalogY = useRef(0);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [brands, setBrands] = useState([]);
  const [brand, setBrand] = useState("");
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [featured, setFeatured] = useState(null);
  const fetchPage = useCallback(
    (options) => fetchShopProducts({ ...options, brand, category }),
    [brand, category],
  );
  const {
    products,
    total,
    loading,
    refreshing,
    error,
    loadMore,
    refresh,
    hasMore,
    stale,
  } = useProducts(query, fetchPage);
  const { addItem } = useCart();
  const filtered = Boolean(search || brand || category);
  useEffect(() => {
    const timer = setTimeout(() => setQuery(search.trim()), 350);
    return () => clearTimeout(timer);
  }, [search]);
  useEffect(() => {
    if (!query && !brand && !category && products.length) {
      setFeatured(
        products.find((p) => p.catalogKey === "shoptaycam:40965") ||
          products[0],
      );
    }
  }, [products, query, brand, category]);
  useEffect(() => {
    const controller = new AbortController();
    api
      .get("/api/product/get-all-brand", { signal: controller.signal })
      .then(({ data }) => {
        if (Array.isArray(data.data)) setBrands(data.data);
      })
      .catch(() => {});
    api
      .get("/api/product/get-all-category", { signal: controller.signal })
      .then(({ data }) => {
        if (Array.isArray(data.data)) setCategories(data.data);
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);
  const columns = width >= 1120 ? 4 : width >= 720 ? 3 : width < 360 ? 1 : 2;
  const contentWidth = Math.min(width, MAX_WIDTH);
  const gutter = desktop ? 24 : 12;
  const cardWidth = (contentWidth - gutter * 2) / columns - 16;
  const openProduct = (product) =>
    navigation.navigate("ProductDetails", {
      productId: product.id || product.productId,
    });
  const reset = () => {
    setSearch("");
    setBrand("");
    setCategory("");
  };
  const add = (product) => {
    if (!addItem(product)) {
      Toast.show({ type: "error", text1: "Đã đạt số lượng còn trong kho" });
      return;
    }
    Toast.show({
      type: "success",
      text1: "Đã thêm vào giỏ",
      text2: product.name,
    });
  };
  return (
    <View style={styles.screen}>
      <Header />
      <FlatList
        ref={list}
        key={columns}
        data={products}
        numColumns={columns}
        keyExtractor={(item) => item.productId}
        keyboardShouldPersistTaps="handled"
        style={styles.list}
        contentContainerStyle={{
          paddingHorizontal: gutter,
          paddingBottom: insets.bottom + 24,
          flexGrow: 1,
        }}
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            width={cardWidth}
            onPress={() => openProduct(item)}
            onAdd={() => add(item)}
          />
        )}
        onEndReached={() => {
          if (!error && query === search.trim()) loadMore();
        }}
        onEndReachedThreshold={0.35}
        refreshing={refreshing}
        onRefresh={refresh}
        ListHeaderComponent={
          <View style={styles.headerContent}>
            {!filtered ? (
              <CatalogHero
                product={featured}
                onProduct={() => openProduct(featured)}
                onExplore={() =>
                  list.current?.scrollToOffset({
                    offset: catalogY.current,
                    animated: true,
                  })
                }
              />
            ) : null}
            <View
              style={[styles.catalogIntro, desktop && { paddingTop: 48 }]}
              onLayout={(event) => {
                catalogY.current = event.nativeEvent.layout.y;
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.eyebrow}>KHÁM PHÁ BỘ SƯU TẬP</Text>
                <Text
                  accessibilityRole="header"
                  style={[
                    styles.heading,
                    desktop && { fontSize: 36, lineHeight: 50 },
                  ]}
                >
                  {search ? "Tìm đúng món bạn cần." : "Nâng tầm cuộc chơi."}
                </Text>
              </View>
              {desktop ? (
                <Text style={styles.introText}>
                  Từ tay cầm đến máy game.{"\n"}Chọn thiết bị, tạo chất riêng.
                </Text>
              ) : null}
            </View>
            <View style={styles.filterPanel}>
              <View
                style={[
                  styles.searchRow,
                  desktop && { flexDirection: "row", alignItems: "center" },
                ]}
              >
                <View style={[styles.search, desktop && { flex: 1 }]}>
                  <Ionicons name="search-outline" size={21} color={c.muted} />
                  <TextInput
                    value={search}
                    onChangeText={setSearch}
                    style={styles.input}
                    placeholder="Tìm tay cầm, máy game, phụ kiện…"
                    placeholderTextColor={c.muted}
                    accessibilityLabel="Tìm kiếm sản phẩm"
                    autoCorrect={false}
                    returnKeyType="search"
                  />
                  {search ? (
                    <Pressable
                      onPress={() => setSearch("")}
                      style={styles.clearSearch}
                      accessibilityRole="button"
                      accessibilityLabel="Xóa tìm kiếm"
                    >
                      <Ionicons name="close" size={20} color={c.muted} />
                    </Pressable>
                  ) : null}
                </View>
                <View style={styles.searchMeta}>
                  <Ionicons name="options-outline" size={18} color={c.green} />
                  <Text style={styles.filterLabel}>Bộ lọc sản phẩm</Text>
                  {filtered ? (
                    <Pressable
                      onPress={reset}
                      accessibilityRole="button"
                      style={styles.reset}
                    >
                      <Text style={styles.resetText}>Đặt lại</Text>
                    </Pressable>
                  ) : null}
                </View>
              </View>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categories}
              >
                {["", ...categories].map((item) => (
                  <Pressable
                    key={item || "all"}
                    onPress={() => {
                      setCategory(item);
                      setBrand("");
                    }}
                    accessibilityRole="button"
                    accessibilityState={{ selected: category === item }}
                    style={({ hovered }) => [
                      styles.chip,
                      (hovered || category === item) && styles.chipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        category === item && styles.chipTextActive,
                      ]}
                    >
                      {item || "Tất cả sản phẩm"}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>
              {brands.length ? (
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.brands}
                >
                  <Text style={styles.brandLabel}>THƯƠNG HIỆU</Text>
                  {["", ...brands].map((item) => (
                    <Pressable
                      key={item || "brands"}
                      onPress={() => setBrand(item)}
                      style={styles.brandButton}
                      accessibilityRole="button"
                      accessibilityState={{ selected: brand === item }}
                    >
                      <Text
                        style={[
                          styles.brandText,
                          brand === item && styles.brandActive,
                        ]}
                      >
                        {item || "Tất cả"}
                      </Text>
                      {brand === item ? <View style={styles.brandDot} /> : null}
                    </Pressable>
                  ))}
                </ScrollView>
              ) : null}
            </View>
            {stale ? (
              <View style={styles.savedRow}>
                <Text style={styles.savedNotice}>
                  Đang xem bản lưu của danh mục. Nguồn tạm thời chưa kết nối.
                </Text>
                <Pressable
                  onPress={refresh}
                  disabled={loading}
                  style={styles.refreshButton}
                  accessibilityRole="button"
                  accessibilityLabel="Cập nhật lại danh mục"
                >
                  {loading ? (
                    <ActivityIndicator color={c.green} />
                  ) : (
                    <Ionicons
                      name="refresh-outline"
                      size={20}
                      color={c.green}
                    />
                  )}
                </Pressable>
              </View>
            ) : null}
            <View style={styles.section}>
              <View style={{ flex: 1 }}>
                <Text style={styles.sectionTitle}>
                  {search
                    ? `Kết quả cho “${search.trim()}”`
                    : category || brand || "Sản phẩm dành cho bạn"}
                </Text>
                <Text style={styles.sectionCaption}>
                  {loading && !products.length
                    ? "Đang tìm sản phẩm…"
                    : `${total} sản phẩm${brand ? ` · ${brand}` : ""}`}
                </Text>
              </View>
              <View style={styles.count}>
                <Ionicons name="grid-outline" size={16} color={c.green} />
                <Text style={styles.countText}>
                  {products.length} / {total}
                </Text>
              </View>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.state}>
            {loading ? (
              <>
                <ActivityIndicator size="large" color={c.green} />
                <Text style={styles.stateText}>Đang tải sản phẩm…</Text>
              </>
            ) : !error ? (
              <>
                <Ionicons name="search-outline" size={40} color={c.muted} />
                <Text style={styles.emptyTitle}>Chưa tìm thấy sản phẩm</Text>
                <Text style={styles.stateText}>
                  Thử từ khóa khác hoặc mở rộng bộ lọc.
                </Text>
                <Pressable
                  style={styles.outlineButton}
                  onPress={reset}
                  accessibilityRole="button"
                >
                  <Text style={styles.buttonText}>Xem tất cả sản phẩm</Text>
                </Pressable>
              </>
            ) : null}
          </View>
        }
        ListFooterComponent={
          <View style={styles.headerContent}>
            <View style={styles.loadFooter}>
              {loading && products.length > 0 && !refreshing ? (
                <ActivityIndicator color={c.green} />
              ) : null}
              {error ? (
                <>
                  <Ionicons
                    name="cloud-offline-outline"
                    size={30}
                    color={c.muted}
                  />
                  <Text style={styles.stateText}>{error}</Text>
                  <Pressable
                    style={styles.outlineButton}
                    onPress={products.length ? loadMore : refresh}
                  >
                    <Text style={styles.buttonText}>Thử lại</Text>
                  </Pressable>
                </>
              ) : !loading && hasMore ? (
                <Pressable
                  style={styles.outlineButton}
                  onPress={loadMore}
                  accessibilityRole="button"
                >
                  <Text style={styles.buttonText}>Xem thêm sản phẩm</Text>
                  <Ionicons name="arrow-down" size={18} color={c.ink} />
                </Pressable>
              ) : !loading && products.length ? (
                <Text style={styles.stateText}>
                  Bạn đã xem hết {total} sản phẩm.
                </Text>
              ) : null}
            </View>
            <StoreFooter />
          </View>
        }
      />
    </View>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: c.canvas },
  list: { width: "100%", maxWidth: MAX_WIDTH, alignSelf: "center" },
  headerContent: { marginHorizontal: 8 },
  catalogIntro: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 24,
    paddingTop: 32,
    paddingBottom: 24,
  },
  eyebrow: {
    fontFamily: fonts.semibold,
    fontSize: 9,
    letterSpacing: 1.6,
    color: c.green,
    marginBottom: 10,
  },
  heading: {
    fontFamily: fonts.display,
    fontSize: 28,
    lineHeight: 40,
    letterSpacing: -1.1,
    color: c.ink,
  },
  introText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    lineHeight: 22,
    color: c.muted,
    paddingBottom: 4,
  },
  filterPanel: {
    backgroundColor: c.white,
    borderColor: c.line,
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  searchRow: { gap: 12 },
  search: {
    minHeight: 52,
    backgroundColor: c.canvas,
    borderWidth: 1,
    borderColor: c.line,
    borderRadius: 8,
    paddingLeft: 16,
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
  },
  input: {
    flex: 1,
    minWidth: 0,
    height: 52,
    fontFamily: fonts.regular,
    fontSize: 13,
    color: c.ink,
  },
  clearSearch: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  searchMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    minHeight: 44,
  },
  filterLabel: { fontFamily: fonts.medium, color: c.muted, fontSize: 12 },
  reset: {
    paddingHorizontal: 12,
    minHeight: 44,
    justifyContent: "center",
    marginLeft: 8,
  },
  resetText: {
    fontFamily: fonts.semibold,
    color: c.green,
    fontSize: 12,
    textDecorationLine: "underline",
  },
  categories: { gap: 8, paddingTop: 16, paddingBottom: 12 },
  chip: {
    minHeight: 44,
    paddingHorizontal: 16,
    backgroundColor: c.canvas,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  chipActive: { backgroundColor: c.soft },
  chipText: { fontFamily: fonts.medium, fontSize: 12, color: c.muted },
  chipTextActive: { color: c.forest, fontFamily: fonts.bold },
  brands: {
    alignItems: "center",
    gap: 20,
    borderTopWidth: 1,
    borderTopColor: c.line,
    paddingTop: 8,
  },
  brandLabel: {
    fontFamily: fonts.semibold,
    color: c.muted,
    fontSize: 9,
    letterSpacing: 1,
  },
  brandButton: {
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  brandText: { fontFamily: fonts.medium, fontSize: 12, color: c.muted },
  brandActive: { color: c.green, fontFamily: fonts.bold },
  brandDot: {
    height: 3,
    width: 3,
    backgroundColor: c.green,
    borderRadius: 2,
    position: "absolute",
    bottom: 1,
  },
  savedNotice: {
    flex: 1,
    fontFamily: fonts.regular,
    color: c.green,
    fontSize: 12,
    lineHeight: 22,
  },
  savedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 20,
    backgroundColor: c.soft,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  refreshButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  section: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 32,
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: 20,
    lineHeight: 30,
    color: c.ink,
    letterSpacing: -0.5,
  },
  sectionCaption: {
    fontFamily: fonts.regular,
    color: c.muted,
    fontSize: 12,
    marginTop: 6,
  },
  count: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
    backgroundColor: c.soft,
    padding: 12,
    borderRadius: 8,
  },
  countText: { color: c.green, fontFamily: fonts.medium, fontSize: 11 },
  state: { alignItems: "center", padding: 32, gap: 16 },
  stateText: {
    fontFamily: fonts.regular,
    color: c.muted,
    fontSize: 12,
    textAlign: "center",
    lineHeight: 22,
  },
  emptyTitle: { fontFamily: fonts.bold, color: c.ink, fontSize: 18 },
  loadFooter: { alignItems: "center", paddingTop: 28, gap: 16 },
  outlineButton: {
    minHeight: 48,
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: c.line,
    backgroundColor: c.white,
  },
  buttonText: { fontFamily: fonts.semibold, color: c.ink, fontSize: 13 },
});
