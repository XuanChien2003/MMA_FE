import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRoute } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import Toast from "react-native-toast-message";

import Header from "../Components/Header";
import ProductImage from "../Components/ProductImage";
import useCart from "../hooks/useCart";
import { fetchProductDetails } from "../services/productService";
import { formatMoney } from "../utils/money";
import { fonts, palette as c, MAX_WIDTH } from "../theme/storefront";

export default function ProductDetailScreen() {
  const route = useRoute();
  const { productId } = route.params || {};
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const desktop = width >= 900;

  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    setLoading(true);
    setError("");

    fetchProductDetails(productId, controller.signal)
      .then((data) => {
        if (active) setProduct(data);
      })
      .catch((err) => {
        if (active && !controller.signal.aborted) {
          setError(
            "Không thể tải thông tin sản phẩm. Vui lòng kiểm tra kết nối mạng và thử lại.",
          );
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [productId, attempt]);

  const handleAddToCart = () => {
    if (!product) return;
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
      <Header title="Chi tiết sản phẩm" back />

      {loading ? (
        <View style={styles.stateContainer}>
          <ActivityIndicator size="large" color={c.green} />
          <Text style={styles.loadingText}>Đang tải chi tiết sản phẩm...</Text>
        </View>
      ) : error ? (
        <View style={styles.stateContainer}>
          <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            onPress={() => setAttempt((v) => v + 1)}
            style={styles.retryButton}
            activeOpacity={0.7}
            accessibilityRole="button"
          >
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      ) : product ? (
        <>
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              desktop && styles.desktopScrollContent,
              { paddingBottom: insets.bottom + 100 },
            ]}
          >
            <View style={[styles.card, desktop && styles.desktopCard]}>
              <View style={[styles.imageWrapper, desktop && styles.desktopImageWrapper]}>
                <ProductImage
                  uri={product.image}
                  label={product.name || product.title}
                  style={styles.productImage}
                />
              </View>

              <View style={[styles.infoWrapper, desktop && styles.desktopInfoWrapper]}>
                {product.category ? (
                  <View style={styles.tagRow}>
                    <Text style={styles.categoryBadge}>
                      {product.category.toUpperCase()}
                    </Text>
                    {product.brand ? (
                      <Text style={styles.brandText}>• {product.brand}</Text>
                    ) : null}
                  </View>
                ) : null}

                <Text style={styles.title} accessibilityRole="header">
                  {product.name || product.title}
                </Text>

                <View style={styles.priceRatingRow}>
                  <Text style={styles.price}>
                    {formatMoney(product.price, product.currency || "USD")}
                  </Text>
                  {product.rating ? (
                    <View style={styles.ratingBadge}>
                      <Ionicons name="star" size={14} color="#f59e0b" />
                      <Text style={styles.ratingText}>{product.rating} / 5</Text>
                    </View>
                  ) : null}
                </View>

                <View style={styles.divider} />

                <Text style={styles.sectionHeading}>Mô tả sản phẩm</Text>
                <Text style={styles.description}>{product.description}</Text>

                {desktop ? (
                  <TouchableOpacity
                    style={styles.desktopAddButton}
                    onPress={handleAddToCart}
                    activeOpacity={0.7}
                    accessibilityRole="button"
                  >
                    <Ionicons name="cart" size={20} color={c.lime} />
                    <Text style={styles.addButtonText}>Thêm vào giỏ hàng</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          </ScrollView>

          {!desktop ? (
            <View
              style={[
                styles.bottomBar,
                { paddingBottom: Math.max(insets.bottom, 16) },
              ]}
            >
              <View style={styles.bottomPriceBlock}>
                <Text style={styles.bottomPriceLabel}>Giá bán:</Text>
                <Text style={styles.bottomPriceValue}>
                  {formatMoney(product.price, product.currency || "USD")}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.mobileAddButton}
                onPress={handleAddToCart}
                activeOpacity={0.7}
                accessibilityRole="button"
              >
                <Ionicons name="cart" size={18} color={c.lime} />
                <Text style={styles.addButtonText}>Thêm vào giỏ</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: c.canvas,
  },
  scrollContent: {
    width: "100%",
    maxWidth: MAX_WIDTH,
    alignSelf: "center",
    padding: 16,
  },
  desktopScrollContent: {
    padding: 32,
  },
  card: {
    backgroundColor: c.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: c.line,
    overflow: "hidden",
    padding: 20,
    gap: 20,
  },
  desktopCard: {
    flexDirection: "row",
    gap: 40,
    padding: 36,
  },
  imageWrapper: {
    width: "100%",
    backgroundColor: c.white,
    borderRadius: 16,
    overflow: "hidden",
  },
  desktopImageWrapper: {
    flex: 1.1,
  },
  productImage: {
    width: "100%",
    aspectRatio: 1,
  },
  infoWrapper: {
    flex: 1,
    justifyContent: "flex-start",
  },
  desktopInfoWrapper: {
    flex: 1,
    paddingLeft: 12,
  },
  tagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  categoryBadge: {
    fontFamily: fonts.semibold,
    color: c.green,
    fontSize: 11,
    letterSpacing: 1,
  },
  brandText: {
    fontFamily: fonts.regular,
    color: c.muted,
    fontSize: 12,
  },
  title: {
    fontFamily: fonts.display,
    color: c.ink,
    fontSize: 22,
    lineHeight: 30,
    letterSpacing: -0.5,
  },
  priceRatingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 16,
  },
  price: {
    fontFamily: fonts.bold,
    color: c.green,
    fontSize: 26,
    letterSpacing: -0.5,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "#fffbeb",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingText: {
    fontFamily: fonts.semibold,
    color: "#b45309",
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: c.line,
    marginVertical: 20,
  },
  sectionHeading: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: c.ink,
    marginBottom: 8,
  },
  description: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: c.muted,
    lineHeight: 24,
  },
  desktopAddButton: {
    marginTop: 32,
    minHeight: 50,
    backgroundColor: c.forest,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 24,
  },
  mobileAddButton: {
    flex: 1,
    minHeight: 48,
    backgroundColor: c.forest,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  addButtonText: {
    fontFamily: fonts.bold,
    color: c.white,
    fontSize: 14,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: c.white,
    borderTopWidth: 1,
    borderTopColor: c.line,
    paddingHorizontal: 20,
    paddingTop: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  bottomPriceBlock: {
    minWidth: 100,
  },
  bottomPriceLabel: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: c.muted,
  },
  bottomPriceValue: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: c.green,
  },
  stateContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    gap: 16,
  },
  loadingText: {
    fontFamily: fonts.regular,
    color: c.muted,
    fontSize: 14,
  },
  errorText: {
    fontFamily: fonts.regular,
    color: "#ef4444",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 22,
  },
  retryButton: {
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
});
