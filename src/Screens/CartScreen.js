import React from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";

import Header from "../Components/Header";
import CartItem from "../Components/CartItem";
import PriceSummary from "../Components/PriceSummary";
import useCart from "../hooks/useCart";
import { fonts, palette as c, MAX_WIDTH } from "../theme/storefront";

export default function CartScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const desktop = width >= 900;

  const { products, itemCount, totalPrice } = useCart();

  return (
    <View style={styles.screen}>
      <Header title="Giỏ hàng của bạn" back />

      <ScrollView
        contentContainerStyle={[
          styles.content,
          desktop && styles.desktopContent,
          { paddingBottom: insets.bottom + 32 },
        ]}
      >
        <View style={styles.headerBlock}>
          <Text style={styles.title}>Giỏ hàng ({itemCount})</Text>
          <Text style={styles.subtitle}>
            {itemCount > 0
              ? `Bạn có ${itemCount} sản phẩm trong giỏ hàng`
              : "Hiện chưa có sản phẩm nào trong giỏ"}
          </Text>
        </View>

        {products.length > 0 ? (
          <View style={[styles.layout, desktop && styles.desktopLayout]}>
            <View style={styles.itemsList}>
              {products.map((item) => (
                <CartItem key={item.productId} item={item} />
              ))}

              <TouchableOpacity
                onPress={() => navigation.navigate("ProductList")}
                style={styles.continueLink}
                activeOpacity={0.7}
                accessibilityRole="button"
              >
                <Ionicons name="arrow-back" size={16} color={c.green} />
                <Text style={styles.continueLinkText}>Tiếp tục xem sản phẩm</Text>
              </TouchableOpacity>
            </View>

            <View style={[styles.summaryCard, desktop && styles.desktopSummary]}>
              <PriceSummary itemCount={itemCount} totalPrice={totalPrice} />

              <TouchableOpacity
                style={styles.checkoutButton}
                activeOpacity={0.7}
                onPress={() => navigation.navigate("ProductList")}
                accessibilityRole="button"
              >
                <Text style={styles.checkoutButtonText}>Tiếp tục mua hàng</Text>
                <Ionicons name="arrow-forward" size={18} color={c.lime} />
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIconCircle}>
              <Ionicons name="cart-outline" size={48} color={c.muted} />
            </View>
            <Text style={styles.emptyTitle}>Giỏ hàng trống</Text>
            <Text style={styles.emptySubtitle}>
              Bạn chưa thêm sản phẩm nào vào giỏ hàng. Hãy khám phá danh sách sản
              phẩm ngay!
            </Text>
            <TouchableOpacity
              style={styles.exploreButton}
              onPress={() => navigation.navigate("ProductList")}
              activeOpacity={0.7}
              accessibilityRole="button"
            >
              <Text style={styles.exploreButtonText}>Khám phá sản phẩm</Text>
              <Ionicons name="arrow-forward" size={18} color={c.lime} />
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: c.canvas,
  },
  content: {
    width: "100%",
    maxWidth: MAX_WIDTH,
    alignSelf: "center",
    padding: 16,
  },
  desktopContent: {
    padding: 32,
  },
  headerBlock: {
    marginBottom: 20,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: c.ink,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: c.muted,
    marginTop: 4,
  },
  layout: {
    gap: 20,
  },
  desktopLayout: {
    flexDirection: "row",
    gap: 32,
    alignItems: "flex-start",
  },
  itemsList: {
    flex: 1,
  },
  continueLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 12,
  },
  continueLinkText: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: c.green,
  },
  summaryCard: {
    backgroundColor: c.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: c.line,
    padding: 20,
  },
  desktopSummary: {
    width: 360,
  },
  checkoutButton: {
    backgroundColor: c.forest,
    minHeight: 48,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    marginTop: 20,
  },
  checkoutButtonText: {
    fontFamily: fonts.bold,
    color: c.white,
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: c.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: c.line,
    padding: 40,
    marginTop: 20,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: c.soft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: c.ink,
  },
  emptySubtitle: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: c.muted,
    textAlign: "center",
    maxWidth: 320,
    marginTop: 8,
    lineHeight: 20,
  },
  exploreButton: {
    backgroundColor: c.forest,
    paddingHorizontal: 24,
    height: 46,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 24,
  },
  exploreButtonText: {
    fontFamily: fonts.bold,
    color: c.white,
    fontSize: 13,
  },
});
