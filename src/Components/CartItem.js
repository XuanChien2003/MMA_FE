import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import useCart from "../hooks/useCart";
import ProductImage from "./ProductImage";
import { formatMoney } from "../utils/money";

export default function CartItem({ item }) {
  const { removeItem, setQuantity } = useCart();
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <ProductImage uri={item.image} style={styles.image} />
        <View style={styles.info}>
          <Text style={styles.name}>{item.name}</Text>
          <Text>{formatMoney(item.price, item.currency)}</Text>
          <TouchableOpacity
            onPress={() => removeItem(item.productId)}
            accessibilityRole="button"
            accessibilityLabel={`Xóa ${item.name}`}
          >
            <Text style={styles.remove}>Xóa sản phẩm</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={[styles.row, styles.controls]}>
        <View style={styles.row}>
          <TouchableOpacity
            disabled={item.quantity <= 1}
            onPress={() => setQuantity(item.productId, item.quantity - 1)}
            style={[
              styles.quantityButton,
              item.quantity <= 1 && styles.disabled,
            ]}
            accessibilityRole="button"
            accessibilityLabel={`Giảm số lượng ${item.name}`}
          >
            <Text>−</Text>
          </TouchableOpacity>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <TouchableOpacity
            onPress={() => setQuantity(item.productId, item.quantity + 1)}
            style={styles.quantityButton}
            accessibilityRole="button"
            accessibilityLabel={`Tăng số lượng ${item.name}`}
          >
            <Text>+</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.total}>
          {formatMoney(item.price * item.quantity, item.currency)}
        </Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  card: {
    padding: 14,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  row: { flexDirection: "row", alignItems: "center", flexWrap: "wrap" },
  image: { width: 76, height: 76, borderRadius: 8 },
  info: { flex: 1, marginLeft: 12 },
  name: { fontWeight: "600", marginBottom: 6 },
  remove: { color: "#b91c1c", paddingVertical: 10 },
  controls: { justifyContent: "space-between", gap: 12, marginTop: 12 },
  quantityButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 8,
    minWidth: 44,
    alignItems: "center",
  },
  quantity: { marginHorizontal: 14, fontWeight: "600" },
  disabled: { opacity: 0.35 },
  total: { fontWeight: "700", color: "#1d4ed8" },
});
