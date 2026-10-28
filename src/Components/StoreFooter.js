import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { fonts, palette as c } from "../theme/storefront";

export default function StoreFooter() {
  const navigation = useNavigation();
  const desktop = useWindowDimensions().width >= 760;
  return (
    <View style={styles.footer}>
      <View
        style={[
          styles.main,
          desktop && {
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          },
        ]}
      >
        <View>
          <Text style={styles.wordmark}>
            MMA STORE<Text style={{ color: c.lime }}> /</Text>
          </Text>
          <Text style={styles.tagline}>Thêm cảm hứng cho từng ván game.</Text>
        </View>
        <View style={styles.links}>
          {[
            ["Home", "Cửa hàng"],
            ["Cart", "Giỏ hàng"],
          ].map(([screen, title]) => (
            <Pressable
              key={screen}
              onPress={() => navigation.navigate(screen)}
              style={styles.link}
              accessibilityRole="button"
            >
              <Text style={styles.linkText}>{title}</Text>
              <Ionicons
                name="arrow-up-outline"
                style={{ transform: [{ rotate: "45deg" }] }}
                color={c.lime}
                size={14}
              />
            </Pressable>
          ))}
        </View>
      </View>
      <View style={styles.bottom}>
        <Text style={styles.small}>MÁY GAME · TAY CẦM · PHỤ KIỆN</Text>
        <Text style={styles.small}>YOUR GAME. YOUR WAY.</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  footer: {
    backgroundColor: c.forest,
    borderRadius: 20,
    paddingHorizontal: 28,
    paddingTop: 36,
    paddingBottom: 20,
    marginTop: 40,
  },
  main: { gap: 24, paddingBottom: 32 },
  wordmark: {
    fontFamily: fonts.display,
    fontSize: 28,
    color: c.white,
    letterSpacing: -1,
  },
  tagline: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: "#c0cec3",
    lineHeight: 22,
    marginTop: 8,
  },
  links: { flexDirection: "row", flexWrap: "wrap", gap: 20 },
  link: { minHeight: 44, flexDirection: "row", alignItems: "center", gap: 8 },
  linkText: { fontFamily: fonts.medium, fontSize: 12, color: c.white },
  bottom: {
    borderTopWidth: 1,
    borderTopColor: "#365047",
    paddingTop: 20,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
  },
  small: {
    fontFamily: fonts.medium,
    color: "#b0c2b5",
    fontSize: 9,
    letterSpacing: 1,
  },
});
