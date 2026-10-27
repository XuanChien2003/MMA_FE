import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ProductImage from "./ProductImage";
import { formatMoney } from "../utils/money";

export default function ProductCard({ product, onPress, onAdd, width }) {
  return (
    <View style={[styles.card, { width }]}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={`Xem ${product.name}`}
      >
        <ProductImage uri={product.image} style={styles.image} />
        <Text style={styles.name} numberOfLines={2}>
          {product.name}
        </Text>
        <Text style={styles.price}>
          {formatMoney(product.price, product.currency)}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onAdd}
        style={styles.button}
        accessibilityRole="button"
        accessibilityLabel={`Thêm ${product.name} vào giỏ`}
      >
        <Text style={styles.buttonText}>Thêm vào giỏ</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    margin: 6,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  image: { height: 150, borderRadius: 8 },
  name: {
    fontSize: 15,
    fontWeight: "600",
    height: 44,
    marginTop: 10,
    color: "#0f172a",
  },
  price: { color: "#1d4ed8", fontWeight: "700", marginVertical: 10 },
  button: {
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: "#1d4ed8",
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "600" },
});
