import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import useCart from "../hooks/useCart";
import ProductImage from "./ProductImage";
import { formatMoney } from "../utils/money";
import { fonts, palette as c } from "../theme/storefront";

export default function CartItem({ item }) {
  const { removeItem, setQuantity } = useCart();
  const navigation = useNavigation();
  const maxed =
    Number.isFinite(item.countInStock) && item.quantity >= item.countInStock;
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Pressable
          onPress={() =>
            navigation.navigate("ProductDetails", { productId: item.productId })
          }
          accessibilityRole="button"
          accessibilityLabel={`Xem ${item.name}`}
        >
          <ProductImage
            uri={item.image}
            label={item.name}
            style={styles.image}
          />
        </Pressable>
        <View style={styles.info}>
          <Text style={styles.brand}>{item.brand}</Text>
          <Pressable
            onPress={() =>
              navigation.navigate("ProductDetails", {
                productId: item.productId,
              })
            }
            accessibilityRole="button"
          >
            <Text style={styles.name}>{item.name}</Text>
          </Pressable>
          <Text style={styles.price}>
            {formatMoney(item.price, item.currency)}
          </Text>
        </View>
        <Pressable
          onPress={() => removeItem(item.productId)}
          style={styles.remove}
          accessibilityRole="button"
          accessibilityLabel={`Xóa ${item.name}`}
        >
          <Ionicons name="close" size={19} color={c.muted} />
        </Pressable>
      </View>
      <View style={styles.controls}>
        <View style={styles.quantityControl}>
          <Pressable
            disabled={item.quantity <= 1}
            onPress={() => setQuantity(item.productId, item.quantity - 1)}
            style={styles.quantityButton}
            accessibilityRole="button"
            accessibilityLabel={`Giảm số lượng ${item.name}`}
          >
            <Ionicons
              name="remove"
              color={item.quantity <= 1 ? c.line : c.ink}
              size={17}
            />
          </Pressable>
          <Text style={styles.quantity}>{item.quantity}</Text>
          <Pressable
            disabled={maxed}
            onPress={() => setQuantity(item.productId, item.quantity + 1)}
            style={styles.quantityButton}
            accessibilityRole="button"
            accessibilityLabel={`Tăng số lượng ${item.name}`}
          >
            <Ionicons name="add" color={maxed ? c.line : c.ink} size={17} />
          </Pressable>
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
    padding: 20,
    backgroundColor: c.white,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: c.line,
  },
  row: { flexDirection: "row", alignItems: "flex-start", gap: 16 },
  image: { width: 88, height: 88, borderRadius: 8, backgroundColor: c.white },
  info: { flex: 1, minWidth: 0 },
  brand: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    color: c.green,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  name: {
    fontFamily: fonts.semibold,
    color: c.ink,
    fontSize: 13,
    lineHeight: 21,
    marginTop: 6,
  },
  price: {
    fontFamily: fonts.regular,
    color: c.muted,
    fontSize: 12,
    marginTop: 8,
  },
  remove: {
    width: 44,
    height: 44,
    marginRight: -12,
    marginTop: -12,
    alignItems: "center",
    justifyContent: "center",
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: c.line,
    paddingTop: 16,
    marginTop: 16,
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: c.line,
    borderRadius: 8,
  },
  quantityButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  quantity: {
    fontFamily: fonts.bold,
    minWidth: 24,
    color: c.ink,
    textAlign: "center",
  },
  total: { fontFamily: fonts.bold, fontSize: 17, color: c.ink },
});
