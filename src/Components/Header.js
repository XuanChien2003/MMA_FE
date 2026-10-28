import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  useWindowDimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import useCart from "../hooks/useCart";
import { fonts, palette as c, MAX_WIDTH } from "../theme/storefront";

export default function Header({ back = false }) {
  const navigation = useNavigation();
  const route = useRoute();
  const desktop = useWindowDimensions().width >= 960;
  const { itemCount } = useCart();
  const goBack = () =>
    navigation.canGoBack() ? navigation.goBack() : navigation.navigate("Home");
  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safe}>
      {desktop ? (
        <View style={styles.top}>
          <View style={styles.topInner}>
            <Text style={styles.topText}>MMA STORE / GAMING GEAR</Text>
            <Text style={styles.topText}>MÁY GAME · TAY CẦM · PHỤ KIỆN</Text>
          </View>
        </View>
      ) : null}
      <View style={[styles.row, desktop && styles.rowDesktop]}>
        {!desktop && back ? (
          <Pressable
            style={styles.icon}
            onPress={goBack}
            accessibilityRole="button"
            accessibilityLabel="Trở lại"
          >
            <Ionicons name="arrow-back" size={25} color={c.ink} />
          </Pressable>
        ) : null}
        <Pressable
          onPress={() => navigation.navigate("Home")}
          style={[styles.brand, !desktop && { flex: 1 }]}
          accessibilityRole="button"
          accessibilityLabel="MMA Store, trang chủ"
        >
          <View style={styles.mark}>
            <Ionicons name="game-controller-outline" size={24} color={c.lime} />
          </View>
          <View>
            <Text style={styles.name}>
              MMA<Text style={styles.nameLight}> STORE</Text>
            </Text>
            {desktop ? (
              <Text style={styles.caption}>YOUR GAME. YOUR WAY.</Text>
            ) : null}
          </View>
        </Pressable>
        {desktop ? (
          <View style={styles.nav}>
            {[
              ["Home", "Cửa hàng"],
              ["Cart", "Giỏ hàng"],
            ].map(([screen, label]) => (
              <Pressable
                key={screen}
                onPress={() => navigation.navigate(screen)}
                accessibilityRole="button"
                style={({ hovered }) => [
                  styles.navLink,
                  (route.name === screen || hovered) && styles.navActive,
                ]}
              >
                <Text
                  style={[
                    styles.navText,
                    route.name === screen && { color: c.green },
                  ]}
                >
                  {label}
                </Text>
                {route.name === screen ? <View style={styles.navDot} /> : null}
              </Pressable>
            ))}
          </View>
        ) : null}
        <Pressable
          style={({ hovered }) => [
            styles.bag,
            desktop && styles.bagDesktop,
            hovered && styles.hover,
          ]}
          onPress={() => navigation.navigate("Cart")}
          accessibilityRole="button"
          accessibilityLabel={`Giỏ hàng, ${itemCount} sản phẩm`}
        >
          <Ionicons name="bag-handle-outline" size={22} color={c.ink} />
          {desktop ? <Text style={styles.actionText}>Giỏ hàng</Text> : null}
          {desktop || itemCount > 0 ? (
            <View style={[styles.badge, !desktop && styles.mobileBadge]}>
              <Text style={styles.badgeText}>
                {itemCount > 99 ? "99+" : itemCount}
              </Text>
            </View>
          ) : null}
        </Pressable>
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
  top: { backgroundColor: c.forest },
  topInner: {
    minHeight: 36,
    width: "100%",
    maxWidth: MAX_WIDTH,
    alignSelf: "center",
    paddingHorizontal: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  topText: {
    color: "#d7e4d8",
    fontFamily: fonts.medium,
    fontSize: 10,
    letterSpacing: 1,
  },
  row: {
    minHeight: 72,
    width: "100%",
    maxWidth: MAX_WIDTH,
    alignSelf: "center",
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  rowDesktop: { height: 92, paddingHorizontal: 24, gap: 16 },
  icon: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  brand: { flexDirection: "row", alignItems: "center", gap: 10, minHeight: 44 },
  mark: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: c.forest,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    color: c.ink,
    fontFamily: fonts.display,
    fontSize: 18,
    letterSpacing: -0.7,
  },
  nameLight: { fontFamily: fonts.medium },
  caption: {
    color: c.muted,
    fontFamily: fonts.medium,
    fontSize: 8,
    letterSpacing: 1.5,
    marginTop: 4,
  },
  nav: { flex: 1, flexDirection: "row", justifyContent: "center", gap: 16 },
  navLink: {
    minHeight: 44,
    paddingHorizontal: 10,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
  },
  navActive: { backgroundColor: c.canvas },
  navText: { fontFamily: fonts.semibold, fontSize: 13, color: c.ink },
  navDot: {
    position: "absolute",
    bottom: 3,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: c.green,
  },
  actionText: { fontFamily: fonts.medium, color: c.ink, fontSize: 12 },
  bag: {
    minWidth: 44,
    height: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 8,
  },
  bagDesktop: {
    paddingHorizontal: 16,
    height: 48,
    borderWidth: 1,
    borderColor: c.line,
  },
  hover: { backgroundColor: c.soft },
  badge: {
    minWidth: 22,
    height: 22,
    paddingHorizontal: 5,
    backgroundColor: c.forest,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
  },
  mobileBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    minWidth: 18,
    height: 18,
  },
  badgeText: { color: c.lime, fontFamily: fonts.semibold, fontSize: 10 },
});
