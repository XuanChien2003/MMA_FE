import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import useCart from "../hooks/useCart";
import { fonts, palette as c, MAX_WIDTH } from "../theme/storefront";

export default function Header({ title = "Cửa hàng điện tử", back = false }) {
  const navigation = useNavigation();
  const route = useRoute();
  const desktop = useWindowDimensions().width >= 960;
  const { itemCount } = useCart();

  const goBack = () => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate("ProductList");
    }
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safe}>
      <View style={[styles.row, desktop && styles.rowDesktop]}>
        {back ? (
          <TouchableOpacity
            style={styles.backButton}
            onPress={goBack}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel="Quay lại"
          >
            <Ionicons name="arrow-back" size={24} color={c.ink} />
          </TouchableOpacity>
        ) : null}

        <TouchableOpacity
          onPress={() => navigation.navigate("ProductList")}
          activeOpacity={0.8}
          style={[styles.brand, { flex: 1 }]}
          accessibilityRole="button"
          accessibilityLabel="Trang chủ"
        >
          <View style={styles.mark}>
            <Ionicons name="bag-handle" size={20} color={c.lime} />
          </View>
          <View>
            <Text style={styles.name}>ShopVN</Text>
            <Text style={styles.caption}>{title}</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate("Cart")}
          activeOpacity={0.7}
          accessibilityRole="button"
          accessibilityLabel={`Giỏ hàng, ${itemCount} sản phẩm`}
        >
          <Ionicons name="cart-outline" size={24} color={c.ink} />
          {itemCount > 0 ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>
                {itemCount > 99 ? "99+" : itemCount}
              </Text>
            </View>
          ) : null}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    backgroundColor: c.white,
    borderBottomWidth: 1,
    borderBottomColor: c.line,
  },
  row: {
    minHeight: 64,
    width: "100%",
    maxWidth: MAX_WIDTH,
    alignSelf: "center",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  rowDesktop: {
    minHeight: 72,
    paddingHorizontal: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
  },
  brand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  mark: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: c.forest,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    color: c.ink,
    fontFamily: fonts.display,
    fontSize: 18,
    letterSpacing: -0.5,
  },
  caption: {
    color: c.muted,
    fontFamily: fonts.regular,
    fontSize: 11,
  },
  cartButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: 2,
    right: 2,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 4,
    backgroundColor: c.forest,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: c.white,
  },
  badgeText: {
    color: c.lime,
    fontFamily: fonts.bold,
    fontSize: 10,
  },
});
