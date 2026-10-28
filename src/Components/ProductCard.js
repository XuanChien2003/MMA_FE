import React from "react";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import ProductImage from "./ProductImage";
import { formatMoney } from "../utils/money";
import { fonts, palette as c } from "../theme/storefront";

export default function ProductCard({ product, onPress, onAdd, width }) {
  return (
    <View style={[styles.card, { width }]}>
      <TouchableOpacity
        onPress={onPress}
        activeOpacity={0.7}
        style={styles.cardTouch}
        accessibilityRole="button"
        accessibilityLabel={`Xem chi tiết ${product.name || product.title}`}
      >
        <ProductImage
          uri={product.image}
          label={product.name || product.title}
          style={styles.image}
        />
        <View style={styles.info}>
          {product.category ? (
            <Text style={styles.category} numberOfLines={1}>
              {product.category.toUpperCase()}
            </Text>
          ) : null}
          <Text style={styles.name} numberOfLines={2}>
            {product.name || product.title}
          </Text>
          <View style={styles.metaRow}>
            <Text style={styles.price}>
              {formatMoney(product.price, product.currency || "USD")}
            </Text>
            {product.rating ? (
              <View style={styles.ratingBadge}>
                <Ionicons name="star" size={12} color="#f59e0b" />
                <Text style={styles.ratingText}>{product.rating}</Text>
              </View>
            ) : null}
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onAdd}
        activeOpacity={0.7}
        style={styles.add}
        accessibilityRole="button"
        accessibilityLabel={`Thêm ${product.name || product.title} vào giỏ`}
      >
        <Ionicons name="cart-outline" size={16} color={c.lime} />
        <Text style={styles.addText}>Thêm vào giỏ</Text>
      </TouchableOpacity>
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
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  cardTouch: {
    padding: 12,
  },
  image: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: c.white,
    borderRadius: 10,
  },
  info: {
    paddingTop: 12,
  },
  category: {
    fontFamily: fonts.semibold,
    color: c.green,
    fontSize: 10,
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  name: {
    fontFamily: fonts.semibold,
    color: c.ink,
    fontSize: 14,
    lineHeight: 20,
    height: 40,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  price: {
    fontFamily: fonts.bold,
    color: c.ink,
    fontSize: 16,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#fffbeb",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingText: {
    fontFamily: fonts.semibold,
    fontSize: 11,
    color: "#b45309",
  },
  add: {
    minHeight: 40,
    marginHorizontal: 12,
    marginBottom: 12,
    backgroundColor: c.forest,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 6,
  },
  addText: {
    fontFamily: fonts.semibold,
    color: c.white,
    fontSize: 12,
  },
});
