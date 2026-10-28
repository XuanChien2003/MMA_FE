import React from "react";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import useCart from "../hooks/useCart";
import ProductImage from "./ProductImage";
import { formatMoney } from "../utils/money";
import { fonts, palette as c } from "../theme/storefront";

export default function CartItem({ item }) {
  const { removeItem, setQuantity } = useCart();
  const navigation = useNavigation();

  const handleOpenDetail = () => {
    navigation.navigate("ProductDetail", { productId: item.productId });
  };

  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <TouchableOpacity
          onPress={handleOpenDetail}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={`Xem ${item.name}`}
        >
          <ProductImage
            uri={item.image}
            label={item.name}
            style={styles.image}
          />
        </TouchableOpacity>

        <View style={styles.info}>
          <TouchableOpacity
            onPress={handleOpenDetail}
            activeOpacity={0.7}
            accessibilityRole="button"
          >
            <Text style={styles.name} numberOfLines={2}>
              {item.name}
            </Text>
          </TouchableOpacity>
          <Text style={styles.price}>
            {formatMoney(item.price, item.currency || "VND")}
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => removeItem(item.productId)}
          activeOpacity={0.7}
          style={styles.remove}
          accessibilityRole="button"
          accessibilityLabel={`Xóa ${item.name}`}
        >
          <Ionicons name="trash-outline" size={18} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <View style={styles.controls}>
        <View style={styles.quantityControl}>
          <TouchableOpacity
            disabled={item.quantity <= 1}
            onPress={() => setQuantity(item.productId, item.quantity - 1)}
            activeOpacity={0.7}
            style={[styles.quantityButton, item.quantity <= 1 && styles.buttonDisabled]}
            accessibilityRole="button"
            accessibilityLabel={`Giảm số lượng ${item.name}`}
          >
            <Ionicons
              name="remove"
              color={item.quantity <= 1 ? c.line : c.ink}
              size={16}
            />
          </TouchableOpacity>

          <Text style={styles.quantity}>{item.quantity}</Text>

          <TouchableOpacity
            onPress={() => setQuantity(item.productId, item.quantity + 1)}
            activeOpacity={0.7}
            style={styles.quantityButton}
            accessibilityRole="button"
            accessibilityLabel={`Tăng số lượng ${item.name}`}
          >
            <Ionicons name="add" color={c.ink} size={16} />
          </TouchableOpacity>
        </View>

        <View style={styles.subtotalBlock}>
          <Text style={styles.subtotalLabel}>Thành tiền:</Text>
          <Text style={styles.total}>
            {formatMoney(item.price * item.quantity, item.currency || "VND")}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: c.white,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: c.line,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: c.white,
    borderWidth: 1,
    borderColor: c.line,
  },
  info: {
    flex: 1,
    minWidth: 0,
    paddingTop: 4,
  },
  name: {
    fontFamily: fonts.semibold,
    color: c.ink,
    fontSize: 14,
    lineHeight: 20,
  },
  price: {
    fontFamily: fonts.regular,
    color: c.muted,
    fontSize: 13,
    marginTop: 6,
  },
  remove: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fee2e2",
    borderRadius: 8,
  },
  controls: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: c.line,
    paddingTop: 12,
    marginTop: 12,
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: c.line,
    borderRadius: 8,
  },
  quantityButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  quantity: {
    fontFamily: fonts.bold,
    minWidth: 28,
    color: c.ink,
    textAlign: "center",
    fontSize: 13,
  },
  subtotalBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  subtotalLabel: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: c.muted,
  },
  total: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: c.green,
  },
});
