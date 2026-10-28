import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
  Pressable,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import Toast from "react-native-toast-message";
import Header from "../Components/Header";
import ProductImage from "../Components/ProductImage";
import useCart from "../hooks/useCart";
import { fetchProductDetails } from "../services/shopCatalog";
import { formatMoney } from "../utils/money";
import { productImages } from "../utils/productMedia";
import StoreFooter from "../Components/StoreFooter";
import { fonts, palette as c, MAX_WIDTH } from "../theme/storefront";

export default function ProductDetails() {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const desktop = width >= 960;
  const insets = useSafeAreaInsets();
  const { productId } = useRoute().params || {};
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);
  const [selected, setSelected] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [zoom, setZoom] = useState(false);
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setLoading(true);
    setError("");
    setSelected(0);
    setQuantity(1);
    const load = async () => {
      try {
        const result = await fetchProductDetails(productId, controller.signal);
        if (active) setProduct(result);
      } catch (failure) {
        if (active && !controller.signal.aborted)
          setError(
            "Không thể tải sản phẩm. Vui lòng kiểm tra kết nối và thử lại.",
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
  }, [productId, attempt]);
  const images = productImages(product);
  const soldOut = product?.countInStock === 0 || product?.status === "inactive";
  const maxQuantity = Number.isFinite(product?.countInStock)
    ? product.countInStock
    : 99;
  const discounted = product?.regularPrice > product?.price;
  const controls = product ? (
    <View style={styles.purchase}>
      <View style={styles.quantity}>
        <Pressable
          disabled={quantity <= 1}
          onPress={() => setQuantity((v) => v - 1)}
          style={styles.quantityButton}
          accessibilityRole="button"
          accessibilityLabel="Giảm số lượng"
        >
          <Ionicons
            name="remove"
            size={19}
            color={quantity > 1 ? c.ink : c.line}
          />
        </Pressable>
        <Text style={styles.quantityText}>{quantity}</Text>
        <Pressable
          disabled={quantity >= maxQuantity || soldOut}
          onPress={() => setQuantity((v) => v + 1)}
          style={styles.quantityButton}
          accessibilityRole="button"
          accessibilityLabel="Tăng số lượng"
        >
          <Ionicons
            name="add"
            size={19}
            color={quantity < maxQuantity && !soldOut ? c.ink : c.line}
          />
        </Pressable>
      </View>
      <Pressable
        disabled={soldOut}
        style={({ hovered }) => [
          styles.add,
          hovered && { backgroundColor: c.green },
          soldOut && { opacity: 0.4 },
        ]}
        accessibilityRole="button"
        onPress={() => {
          if (!addItem(product, quantity)) {
            Toast.show({
              type: "error",
              text1: "Số lượng vượt quá hàng còn trong kho",
            });
            return;
          }
          Toast.show({
            type: "success",
            text1: "Đã thêm vào giỏ hàng",
            text2: `${quantity} × ${product.name}`,
          });
        }}
      >
        <Ionicons name="bag-handle-outline" color={c.lime} size={20} />
        <Text style={styles.addText}>
          {soldOut ? "Tạm hết hàng" : "Thêm vào giỏ"}
        </Text>
      </Pressable>
    </View>
  ) : null;
  return (
    <View style={styles.screen}>
      <Header back />
      {loading ? (
        <View style={styles.state}>
          <ActivityIndicator size="large" color={c.green} />
          <Text style={styles.muted}>Đang chuẩn bị sản phẩm…</Text>
        </View>
      ) : error ? (
        <View style={styles.state}>
          <Ionicons name="cloud-offline-outline" size={40} color={c.muted} />
          <Text style={styles.error}>{error}</Text>
          <TouchableOpacity
            onPress={() => setAttempt((v) => v + 1)}
            style={styles.retry}
          >
            <Text style={styles.retryText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : product ? (
        <>
          <ScrollView
            contentContainerStyle={[styles.content, desktop && { padding: 32 }]}
          >
            <View style={styles.breadcrumb}>
              <Pressable
                onPress={() => navigation.navigate("Home")}
                style={styles.breadcrumbLink}
                accessibilityRole="button"
              >
                <Text style={styles.muted}>Cửa hàng</Text>
              </Pressable>
              <Ionicons name="chevron-forward" size={12} color={c.muted} />
              <Text style={styles.breadcrumbCurrent}>{product.category}</Text>
            </View>
            <View
              style={[
                styles.layout,
                desktop && { flexDirection: "row", gap: 56 },
              ]}
            >
              <View style={desktop ? { flex: 1.1, minWidth: 0 } : null}>
                <View style={styles.photoCard}>
                  <Pressable
                    onPress={() => setZoom(true)}
                    accessibilityRole="button"
                    accessibilityLabel="Mở ảnh sản phẩm lớn"
                  >
                    <ProductImage
                      uri={images[selected]}
                      label={product.name}
                      style={[styles.photo, desktop && { height: 500 }]}
                    />
                  </Pressable>
                  <View style={styles.photoCount}>
                    <Text style={styles.photoCountText}>
                      {selected + 1} / {Math.max(images.length, 1)}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => setZoom(true)}
                    style={styles.zoomButton}
                    accessibilityRole="button"
                    accessibilityLabel="Phóng to ảnh"
                  >
                    <Ionicons name="expand-outline" size={22} color={c.ink} />
                  </Pressable>
                </View>
                {images.length > 1 ? (
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.thumbnails}
                  >
                    {images.map((uri, index) => (
                      <Pressable
                        key={uri}
                        onPress={() => setSelected(index)}
                        accessibilityRole="button"
                        accessibilityState={{ selected: selected === index }}
                        accessibilityLabel={`Ảnh sản phẩm ${index + 1}`}
                        style={[
                          styles.thumbnail,
                          selected === index && styles.thumbnailSelected,
                        ]}
                      >
                        <ProductImage
                          uri={uri}
                          label={`Ảnh ${index + 1}: ${product.name}`}
                          style={styles.thumbnailPhoto}
                        />
                      </Pressable>
                    ))}
                  </ScrollView>
                ) : null}
                {desktop ? (
                  <Text style={styles.photoHelp}>
                    Nhấn vào ảnh để xem chi tiết sản phẩm.
                  </Text>
                ) : null}
              </View>
              <View style={[styles.info, desktop && { flex: 1, minWidth: 0 }]}>
                <Text style={styles.brand}>{product.brand}</Text>
                <Text
                  accessibilityRole="header"
                  style={[
                    styles.name,
                    desktop && { fontSize: 34, lineHeight: 48 },
                  ]}
                >
                  {product.name}
                </Text>
                <Text style={styles.category}>{product.category}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.price}>
                    {formatMoney(product.price, product.currency)}
                  </Text>
                  {discounted ? (
                    <Text style={styles.oldPrice}>
                      {formatMoney(product.regularPrice, product.currency)}
                    </Text>
                  ) : null}
                </View>
                {product.sourceUrl ? (
                  <Text style={styles.priceNote}>
                    {product.stale
                      ? "Đang xem bản lưu. Nguồn sản phẩm tạm thời chưa kết nối."
                      : "Giá tham khảo từ nguồn sản phẩm, có thể thay đổi."}
                  </Text>
                ) : null}
                <View style={styles.stockRow}>
                  <View
                    style={[
                      styles.stockDot,
                      soldOut && { backgroundColor: c.muted },
                    ]}
                  />
                  <Text style={styles.stock}>
                    {soldOut
                      ? "Tạm hết hàng"
                      : "Đang có hàng tại nguồn sản phẩm"}
                  </Text>
                </View>
                {desktop ? (
                  <View style={{ marginTop: 28 }}>
                    {controls}
                    <Text style={styles.purchaseNote}>
                      Thêm sản phẩm vào giỏ để xem tổng tiền của bạn.
                    </Text>
                  </View>
                ) : null}
                <View style={styles.divider} />
                <Text style={styles.sectionTitle}>Về sản phẩm này</Text>
                <Text style={styles.description}>
                  {product.description ||
                    "Thông tin sản phẩm đang được cập nhật."}
                </Text>
                {[
                  ["Thương hiệu", product.brand],
                  ["Danh mục", product.category],
                  [
                    "Mã sản phẩm",
                    String(product.productId).slice(-8).toUpperCase(),
                  ],
                ].map(([label, value]) => (
                  <View style={styles.meta} key={label}>
                    <Text style={styles.metaLabel}>{label}</Text>
                    <Text style={styles.metaValue}>{value}</Text>
                  </View>
                ))}
                <Pressable
                  onPress={() => navigation.navigate("Cart")}
                  style={styles.cartLink}
                  accessibilityRole="button"
                >
                  <Text style={styles.cartLinkText}>Xem giỏ hàng của bạn</Text>
                  <Ionicons name="arrow-forward" size={17} color={c.green} />
                </Pressable>
              </View>
            </View>
            <StoreFooter />
          </ScrollView>
          {!desktop ? (
            <View
              style={[
                styles.bottom,
                { paddingBottom: Math.max(insets.bottom, 16) },
              ]}
            >
              {controls}
            </View>
          ) : null}
          <Modal
            visible={zoom}
            animationType="fade"
            onRequestClose={() => setZoom(false)}
          >
            <SafeAreaView style={styles.modal}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle} numberOfLines={1}>
                  {product.name}
                </Text>
                <Pressable
                  onPress={() => setZoom(false)}
                  style={styles.modalClose}
                  accessibilityRole="button"
                  accessibilityLabel="Đóng ảnh"
                >
                  <Ionicons name="close" size={26} color={c.white} />
                </Pressable>
              </View>
              <ScrollView
                maximumZoomScale={3}
                minimumZoomScale={1}
                contentContainerStyle={{
                  flexGrow: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ProductImage
                  uri={images[selected]}
                  label={product.name}
                  style={{
                    width: Math.min(width, 850),
                    aspectRatio: 1,
                    backgroundColor: c.white,
                  }}
                />
              </ScrollView>
              <View style={styles.galleryNav}>
                <Pressable
                  disabled={selected === 0}
                  onPress={() => setSelected((v) => v - 1)}
                  style={styles.modalClose}
                  accessibilityRole="button"
                  accessibilityLabel="Ảnh trước"
                >
                  <Ionicons
                    name="arrow-back"
                    size={24}
                    color={selected === 0 ? c.muted : c.white}
                  />
                </Pressable>
                <Text style={styles.zoomHelp}>
                  Ảnh {selected + 1} / {Math.max(images.length, 1)}
                </Text>
                <Pressable
                  disabled={selected >= images.length - 1}
                  onPress={() => setSelected((v) => v + 1)}
                  style={styles.modalClose}
                  accessibilityRole="button"
                  accessibilityLabel="Ảnh tiếp theo"
                >
                  <Ionicons
                    name="arrow-forward"
                    size={24}
                    color={selected >= images.length - 1 ? c.muted : c.white}
                  />
                </Pressable>
              </View>
            </SafeAreaView>
          </Modal>
        </>
      ) : null}
    </View>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: c.canvas },
  content: {
    padding: 20,
    maxWidth: MAX_WIDTH,
    width: "100%",
    alignSelf: "center",
    paddingBottom: 30,
  },
  state: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 28,
    gap: 16,
  },
  muted: { fontFamily: fonts.regular, color: c.muted, fontSize: 12 },
  error: {
    fontFamily: fonts.regular,
    color: c.muted,
    textAlign: "center",
    lineHeight: 23,
  },
  retry: { padding: 16, backgroundColor: c.soft, borderRadius: 8 },
  retryText: { fontFamily: fonts.bold, color: c.green },
  breadcrumb: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 20,
  },
  breadcrumbLink: { minHeight: 44, justifyContent: "center" },
  breadcrumbCurrent: { fontFamily: fonts.medium, fontSize: 12, color: c.ink },
  layout: { gap: 24 },
  photoCard: {
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: c.white,
    borderWidth: 1,
    borderColor: c.line,
  },
  photo: { width: "100%", height: 330, backgroundColor: c.white },
  photoCount: {
    position: "absolute",
    left: 16,
    top: 16,
    backgroundColor: c.canvas,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  photoCountText: { fontFamily: fonts.medium, color: c.muted, fontSize: 11 },
  zoomButton: {
    position: "absolute",
    right: 16,
    bottom: 16,
    backgroundColor: c.canvas,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
  },
  thumbnails: { gap: 12, paddingVertical: 16 },
  thumbnail: {
    padding: 4,
    borderWidth: 1,
    borderColor: c.line,
    borderRadius: 12,
    backgroundColor: c.white,
  },
  thumbnailSelected: { borderColor: c.green },
  thumbnailPhoto: {
    width: 72,
    height: 72,
    borderRadius: 8,
    backgroundColor: c.white,
  },
  photoHelp: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: c.muted,
    lineHeight: 20,
  },
  info: { paddingTop: 8 },
  brand: {
    fontFamily: fonts.bold,
    color: c.green,
    fontSize: 12,
    letterSpacing: 1.6,
    textTransform: "uppercase",
  },
  name: {
    fontFamily: fonts.display,
    color: c.ink,
    fontSize: 28,
    lineHeight: 40,
    marginTop: 12,
    letterSpacing: -1,
  },
  category: {
    fontFamily: fonts.regular,
    color: c.muted,
    fontSize: 12,
    marginTop: 12,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 16,
    marginTop: 24,
  },
  price: {
    fontFamily: fonts.bold,
    fontSize: 32,
    color: c.green,
    letterSpacing: -1,
  },
  oldPrice: {
    fontFamily: fonts.regular,
    color: c.muted,
    fontSize: 14,
    textDecorationLine: "line-through",
  },
  priceNote: {
    fontFamily: fonts.regular,
    color: c.muted,
    fontSize: 10,
    lineHeight: 18,
    marginTop: 8,
  },
  stockRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 20,
  },
  stockDot: { height: 6, width: 6, borderRadius: 3, backgroundColor: c.green },
  stock: { fontFamily: fonts.medium, fontSize: 12, color: c.green },
  purchaseNote: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: c.muted,
    marginTop: 16,
  },
  divider: { height: 1, backgroundColor: c.line, marginVertical: 28 },
  sectionTitle: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: c.ink,
    marginBottom: 12,
  },
  description: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: c.muted,
    lineHeight: 25,
    marginBottom: 20,
  },
  meta: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: c.line,
    gap: 20,
  },
  metaLabel: { fontFamily: fonts.regular, color: c.muted, fontSize: 12 },
  metaValue: {
    fontFamily: fonts.medium,
    fontSize: 12,
    color: c.ink,
    flexShrink: 1,
    textAlign: "right",
  },
  cartLink: {
    minHeight: 48,
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  cartLinkText: { fontFamily: fonts.semibold, color: c.green, fontSize: 12 },
  bottom: {
    paddingHorizontal: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: c.line,
    backgroundColor: c.white,
  },
  purchase: { flexDirection: "row", alignItems: "center", gap: 12 },
  quantity: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: c.line,
    borderRadius: 8,
    height: 54,
  },
  quantityButton: {
    width: 44,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  quantityText: {
    fontFamily: fonts.bold,
    minWidth: 24,
    textAlign: "center",
    color: c.ink,
  },
  add: {
    flex: 1,
    minHeight: 54,
    backgroundColor: c.forest,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 12,
  },
  addText: { fontFamily: fonts.bold, color: c.white, fontSize: 13 },
  modal: { flex: 1, backgroundColor: c.forest },
  modalHeader: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  modalTitle: {
    fontFamily: fonts.medium,
    color: c.white,
    flex: 1,
    fontSize: 13,
  },
  modalClose: {
    minWidth: 44,
    minHeight: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  galleryNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
    padding: 12,
  },
  zoomHelp: {
    fontFamily: fonts.medium,
    textAlign: "center",
    color: c.white,
    fontSize: 12,
  },
});
