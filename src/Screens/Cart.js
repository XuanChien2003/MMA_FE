import React from "react";
import {
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import Header from "../Components/Header";
import CartItem from "../Components/CartItem";
import PriceSummary from "../Components/PriceSummary";
import useCart from "../hooks/useCart";

export default function CartScreen() {
  const navigation = useNavigation();
  const { products, itemCount, totals } = useCart();
  const userId = useSelector((state) => state.auth.userId);
  const hasSampleProducts = products.some(
    (item) => item.source === "dummyjson",
  );
  const checkout = () => {
    if (!userId) {
      Toast.show({ type: "error", text1: "Vui lòng đăng nhập để thanh toán" });
      navigation.navigate("Login");
      return;
    }
    navigation.navigate("PaymentMethod", {
      products,
      total: totals.VND || 0,
      userId,
    });
  };
  return (
    <View style={styles.screen}>
      <Header />
      <FlatList
        data={products}
        keyExtractor={(item) => String(item.productId)}
        renderItem={({ item }) => <CartItem item={item} />}
        contentContainerStyle={styles.list}
        ListHeaderComponent={<Text style={styles.title}>Giỏ hàng của bạn</Text>}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text>Giỏ hàng đang trống</Text>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("Home")}
              accessibilityRole="button"
            >
              <Text style={styles.buttonText}>Khám phá sản phẩm</Text>
            </TouchableOpacity>
          </View>
        }
        ListFooterComponent={
          products.length ? (
            <>
              <PriceSummary itemCount={itemCount} totals={totals} />
              {hasSampleProducts ? (
                <Text style={styles.note}>
                  Sản phẩm DummyJSON dùng để thực hành giỏ hàng. Để đặt hàng tại
                  cửa hàng, hãy xóa sản phẩm mẫu khỏi giỏ.
                </Text>
              ) : (
                <TouchableOpacity
                  onPress={checkout}
                  style={styles.button}
                  accessibilityRole="button"
                >
                  <Text style={styles.buttonText}>Thanh toán</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity
                onPress={() => navigation.navigate("Home")}
                style={styles.continue}
                accessibilityRole="button"
              >
                <Text style={styles.link}>Tiếp tục mua sắm</Text>
              </TouchableOpacity>
            </>
          ) : null
        }
      />
    </View>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f8fafc" },
  list: {
    padding: 18,
    flexGrow: 1,
    width: "100%",
    maxWidth: 850,
    alignSelf: "center",
  },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 18 },
  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 60,
  },
  button: {
    backgroundColor: "#1d4ed8",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 18,
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  note: { color: "#475569", lineHeight: 22 },
  continue: { padding: 18, alignItems: "center" },
  link: { color: "#1d4ed8", fontWeight: "600" },
});
