import React from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import ProductImage from "./ProductImage";
import { formatMoney } from "../utils/money";
import { fonts, palette as c } from "../theme/storefront";

export default function CatalogHero({ product, onExplore, onProduct }) {
  const { width } = useWindowDimensions();
  const wide = width >= 900;
  return (
    <View style={[styles.hero, wide && styles.heroWide]}>
      <View style={[styles.copy, wide && { flex: 1.15, paddingVertical: 24 }]}>
        <View style={styles.kickerRow}>
          <View style={styles.line} />
          <Text style={styles.kicker}>DÀNH CHO NIỀM VUI CHƠI GAME</Text>
        </View>
        <Text
          accessibilityRole="header"
          style={[
            styles.title,
            width < 390 && { fontSize: 28, lineHeight: 40 },
            wide && styles.titleWide,
            wide && width < 1180 && { fontSize: 42, lineHeight: 58 },
          ]}
        >
          VÀO GAME.{"\n"}
          <Text style={{ color: c.lime }}>ĐÚNG CHẤT BẠN.</Text>
        </Text>
        <Text style={styles.body}>
          Tay cầm yêu thích. Chiếc máy game hợp gu.{"\n"}Tìm mảnh ghép tiếp theo
          cho góc chơi của bạn.
        </Text>
        <Pressable
          onPress={onExplore}
          accessibilityRole="button"
          style={({ hovered, pressed }) => [
            styles.cta,
            (hovered || pressed) && { backgroundColor: "#e8f5c3" },
          ]}
        >
          <Text style={styles.ctaText}>Khám phá cửa hàng</Text>
          <Ionicons name="arrow-forward" size={20} color={c.forest} />
        </Pressable>
        {wide ? (
          <View style={styles.bottomNote}>
            <Text style={styles.note}>MÁY GAME</Text>
            <View style={styles.dot} />
            <Text style={styles.note}>TAY CẦM</Text>
            <View style={styles.dot} />
            <Text style={styles.note}>PHỤ KIỆN</Text>
          </View>
        ) : null}
      </View>
      <View style={[styles.visual, wide && { flex: 1, marginLeft: 40 }]}>
        <View style={styles.visualHeader}>
          <Text style={styles.visualKicker}>
            GAMING GEAR / LỰA CHỌN CỦA BẠN
          </Text>
          <Ionicons name="game-controller-outline" size={19} color={c.green} />
        </View>
        <Pressable
          onPress={product ? onProduct : undefined}
          disabled={!product}
          accessibilityRole="button"
          accessibilityLabel={
            product ? `Khám phá ${product.name}` : "Đang tải sản phẩm"
          }
          style={styles.product}
        >
          {product ? (
            <ProductImage
              uri={product.images?.[0] || product.image}
              label={product.name}
              style={[styles.image, wide && { height: 285 }]}
            />
          ) : (
            <View
              style={[
                styles.image,
                { alignItems: "center", justifyContent: "center" },
              ]}
            >
              <ActivityIndicator color={c.green} />
            </View>
          )}
          <View style={styles.productCaption}>
            <View style={{ flex: 1 }}>
              <Text style={styles.productBrand}>
                {product?.brand || "MMA STORE"}
              </Text>
              <Text style={styles.productName} numberOfLines={2}>
                {product?.name || "Đang chuẩn bị sản phẩm…"}
              </Text>
            </View>
            <View style={styles.roundArrow}>
              <Ionicons
                name="arrow-up-outline"
                size={22}
                color={c.forest}
                style={{ transform: [{ rotate: "45deg" }] }}
              />
            </View>
          </View>
          {product ? (
            <Text style={styles.price}>{formatMoney(product.price)}</Text>
          ) : null}
        </Pressable>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  hero: {
    backgroundColor: c.forest,
    padding: 24,
    borderRadius: 24,
    overflow: "hidden",
    gap: 28,
    marginTop: 24,
  },
  heroWide: {
    flexDirection: "row",
    alignItems: "center",
    padding: 48,
    minHeight: 480,
    gap: 0,
  },
  copy: { alignItems: "flex-start" },
  kickerRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  line: { width: 24, height: 2, backgroundColor: c.lime },
  kicker: {
    fontFamily: fonts.medium,
    color: "#c5d6c8",
    fontSize: 10,
    letterSpacing: 1.2,
  },
  title: {
    fontFamily: fonts.display,
    fontSize: 34,
    lineHeight: 47,
    letterSpacing: -1.5,
    color: c.white,
    marginTop: 22,
  },
  titleWide: { fontSize: 54, lineHeight: 72, letterSpacing: -2.5 },
  body: {
    fontFamily: fonts.regular,
    color: "#c2d0c7",
    fontSize: 13,
    lineHeight: 24,
    marginTop: 20,
  },
  cta: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: 24,
    borderRadius: 8,
    backgroundColor: c.lime,
    paddingHorizontal: 20,
    marginTop: 28,
  },
  ctaText: { fontFamily: fonts.bold, color: c.forest, fontSize: 13 },
  bottomNote: {
    marginTop: 44,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  note: {
    fontFamily: fonts.medium,
    fontSize: 9,
    color: "#c2d0c7",
    letterSpacing: 1,
  },
  dot: { width: 3, height: 3, backgroundColor: "#8ea98d", borderRadius: 2 },
  visual: {
    backgroundColor: c.white,
    borderRadius: 18,
    padding: 18,
    overflow: "hidden",
  },
  visualHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  visualKicker: {
    fontFamily: fonts.semibold,
    fontSize: 8,
    color: c.muted,
    letterSpacing: 1,
  },
  product: { marginTop: 8 },
  image: { width: "100%", height: 210, backgroundColor: c.white },
  productCaption: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: c.line,
    paddingTop: 16,
    marginTop: 12,
  },
  productBrand: {
    fontFamily: fonts.semibold,
    color: c.green,
    fontSize: 10,
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  productName: {
    fontFamily: fonts.bold,
    color: c.ink,
    fontSize: 15,
    lineHeight: 22,
    marginTop: 6,
  },
  roundArrow: {
    backgroundColor: c.lime,
    borderRadius: 24,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  price: {
    fontFamily: fonts.medium,
    fontSize: 13,
    color: c.muted,
    marginTop: 6,
  },
});
