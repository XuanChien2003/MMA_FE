import React from "react";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import ProductImage from "./ProductImage";
import { formatMoney } from "../utils/money";
import { fonts, palette as c } from "../theme/storefront";

export default function ProductCard({ product, onPress, onAdd, width }) {
  const soldOut = product.countInStock === 0;
  const discount =
    product.regularPrice > product.price
      ? Math.round((1 - product.price / product.regularPrice) * 100)
      : 0;
  return (
    <View style={[styles.card, { width }]}>
      <TouchableOpacity
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Xem ${product.name}`}
        activeOpacity={0.75}
        style={styles.product}
      >
        <View style={styles.photo}>
          <ProductImage
            uri={product.image}
            label={product.name}
            style={styles.image}
          />
          {discount > 0 ? (
            <View style={styles.discount}>
              <Text style={styles.discountText}>−{discount}%</Text>
            </View>
          ) : null}
          <View style={styles.open}>
            <Ionicons
              name="arrow-up-outline"
              size={18}
              color={c.ink}
              style={{ transform: [{ rotate: "45deg" }] }}
            />
          </View>
        </View>
        <View style={styles.info}>
          <Text style={styles.brand} numberOfLines={1}>
            {product.brand || product.category}
          </Text>
          <Text style={styles.name} numberOfLines={2}>
            {product.name}
          </Text>
          <Text style={styles.category} numberOfLines={1}>
            {product.category}
          </Text>
          <Text style={styles.oldPrice}>
            {discount > 0
              ? formatMoney(product.regularPrice, product.currency)
              : " "}
          </Text>
          <Text style={styles.price}>
            {formatMoney(product.price, product.currency)}
          </Text>
        </View>
      </TouchableOpacity>
      <View style={styles.bottom}>
        <View style={styles.stockRow}>
          <View
            style={[styles.stockDot, soldOut && { backgroundColor: c.muted }]}
          />
          <Text style={[styles.stock, soldOut && { color: c.muted }]}>
            {soldOut ? "Hết hàng" : "Sẵn hàng"}
          </Text>
        </View>
        <TouchableOpacity
          disabled={soldOut}
          onPress={onAdd}
          accessibilityRole="button"
          accessibilityLabel={`Thêm ${product.name} vào giỏ`}
          activeOpacity={0.65}
          style={[styles.add, soldOut && { opacity: 0.35 }]}
        >
          <Ionicons name="add" size={22} color={c.white} />
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    margin: 8,
    backgroundColor: c.white,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: c.line,
  },
  product: { padding: 12, paddingBottom: 0 },
  photo: { backgroundColor: c.white, borderRadius: 10, overflow: "hidden" },
  image: { width: "100%", aspectRatio: 1, backgroundColor: c.white },
  discount: {
    position: "absolute",
    left: 0,
    top: 0,
    backgroundColor: c.lime,
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  discountText: { color: c.forest, fontFamily: fonts.bold, fontSize: 11 },
  open: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: c.canvas,
    borderRadius: 16,
    width: 30,
    height: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  info: { paddingHorizontal: 4, paddingTop: 16 },
  brand: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    letterSpacing: 1.1,
    color: c.green,
    textTransform: "uppercase",
  },
  name: {
    fontFamily: fonts.semibold,
    color: c.ink,
    fontSize: 14,
    lineHeight: 21,
    height: 42,
    marginTop: 8,
  },
  category: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: c.muted,
    marginTop: 8,
  },
  oldPrice: {
    fontFamily: fonts.regular,
    fontSize: 11,
    color: c.muted,
    textDecorationLine: "line-through",
    marginTop: 16,
    minHeight: 16,
  },
  price: { fontFamily: fonts.bold, color: c.ink, fontSize: 18, marginTop: 4 },
  bottom: {
    marginHorizontal: 16,
    marginTop: 16,
    paddingTop: 12,
    paddingBottom: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderTopWidth: 1,
    borderTopColor: c.line,
  },
  stockRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flexShrink: 1,
  },
  stockDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: c.green },
  stock: { fontFamily: fonts.medium, fontSize: 10, color: c.green },
  add: {
    width: 44,
    height: 44,
    backgroundColor: c.forest,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
});
