import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import Header from "../Components/Header";
import CartItem from "../Components/CartItem";
import PriceSummary from "../Components/PriceSummary";
import StoreFooter from "../Components/StoreFooter";
import useCart from "../hooks/useCart";
import { fonts, palette as c, MAX_WIDTH } from "../theme/storefront";

export default function CartScreen() {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const desktop = useWindowDimensions().width >= 960;
  const { products, itemCount, totals } = useCart();
  return (
    <View style={styles.screen}>
      <Header back />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          desktop && { padding: 32 },
          { paddingBottom: insets.bottom + 24 },
        ]}
      >
        <View style={styles.breadcrumb}>
          <Text style={styles.eyebrow}>CỬA HÀNG / GIỎ HÀNG</Text>
          <Text
            style={[styles.title, desktop && { fontSize: 40, lineHeight: 56 }]}
          >
            Sẵn sàng vào game?
          </Text>
          <Text style={styles.subtitle}>
            Giỏ hàng của bạn có {itemCount} sản phẩm.
          </Text>
        </View>
        {products.length ? (
          <View
            style={[
              styles.layout,
              desktop && { flexDirection: "row", gap: 32 },
            ]}
          >
            <View style={{ flex: 1 }}>
              {products.map((item) => (
                <CartItem key={item.productId} item={item} />
              ))}
              <Pressable
                onPress={() => navigation.navigate("Home")}
                style={styles.continue}
                accessibilityRole="button"
              >
                <Ionicons name="arrow-back" size={18} color={c.green} />
                <Text style={styles.link}>Tiếp tục khám phá cửa hàng</Text>
              </Pressable>
            </View>
            <View style={[styles.summary, desktop && { width: 370 }]}>
              <PriceSummary itemCount={itemCount} totals={totals} />
              <Pressable
                onPress={() => navigation.navigate("Home")}
                accessibilityRole="button"
                style={({ hovered, pressed }) => [
                  styles.button,
                  (hovered || pressed) && { backgroundColor: c.green },
                ]}
              >
                <Text style={styles.buttonText}>Tiếp tục khám phá</Text>
                <Ionicons name="arrow-forward" size={20} color={c.lime} />
              </Pressable>
              <Text style={styles.summaryNote}>
                Tổng tiền cập nhật ngay khi bạn thay đổi số lượng. Giá được lưu
                tại thời điểm thêm vào giỏ.
              </Text>
            </View>
          </View>
        ) : (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Ionicons name="bag-handle-outline" size={46} color={c.green} />
            </View>
            <Text style={styles.emptyTitle}>Một khởi đầu mới.</Text>
            <Text style={styles.emptyText}>
              Giỏ hàng đang trống. Cùng tìm món đồ{"\n"}tiếp theo cho góc chơi
              của bạn.
            </Text>
            <Pressable
              style={styles.button}
              onPress={() => navigation.navigate("Home")}
              accessibilityRole="button"
            >
              <Text style={styles.buttonText}>Khám phá sản phẩm</Text>
              <Ionicons name="arrow-forward" size={20} color={c.lime} />
            </Pressable>
          </View>
        )}
        <StoreFooter />
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: c.canvas },
  content: {
    padding: 20,
    flexGrow: 1,
    width: "100%",
    maxWidth: MAX_WIDTH,
    alignSelf: "center",
  },
  breadcrumb: { paddingTop: 16, marginBottom: 32 },
  eyebrow: {
    fontFamily: fonts.semibold,
    fontSize: 10,
    color: c.green,
    letterSpacing: 1.5,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 28,
    lineHeight: 40,
    color: c.ink,
    marginTop: 16,
    letterSpacing: -1,
  },
  subtitle: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: c.muted,
    marginTop: 12,
  },
  layout: { gap: 16, alignItems: "stretch" },
  summary: {
    borderRadius: 16,
    backgroundColor: c.white,
    borderWidth: 1,
    borderColor: c.line,
    padding: 24,
    alignSelf: "flex-start",
    width: "100%",
  },
  button: {
    backgroundColor: c.forest,
    minHeight: 54,
    paddingHorizontal: 20,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 24,
    marginTop: 24,
  },
  buttonText: { fontFamily: fonts.bold, color: c.white, fontSize: 13 },
  continue: {
    minHeight: 48,
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    paddingHorizontal: 4,
  },
  link: { fontFamily: fonts.semibold, color: c.green, fontSize: 12 },
  summaryNote: {
    fontFamily: fonts.regular,
    color: c.muted,
    fontSize: 12,
    lineHeight: 22,
    marginTop: 20,
  },
  empty: {
    paddingVertical: 56,
    alignItems: "center",
    backgroundColor: c.white,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: c.line,
    paddingHorizontal: 24,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: c.soft,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  emptyTitle: { fontFamily: fonts.bold, fontSize: 24, color: c.ink },
  emptyText: {
    fontFamily: fonts.regular,
    color: c.muted,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 24,
    marginTop: 12,
  },
});
