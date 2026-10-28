import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Image } from "expo-image";
import Ionicons from "@expo/vector-icons/Ionicons";

const BLURHASH = "L6PZfSi_.AyE_3t7t7R**0o#DgR4";

export default function ProductImage({
  uri,
  style,
  label = "Ảnh sản phẩm",
  resizeMode = "contain",
}) {
  const [failed, setFailed] = React.useState(false);
  const [key, setKey] = React.useState(0);

  const source = typeof uri === "string" && uri.trim() ? uri.trim() : null;

  if (!source || failed) {
    return (
      <View style={[styles.container, style, styles.placeholder]}>
        <Ionicons name="image-outline" size={32} color="#98a2b3" />
        <Text style={styles.caption}>Ảnh không khả dụng</Text>
        {source ? (
          <TouchableOpacity
            onPress={() => {
              setFailed(false);
              setKey((v) => v + 1);
            }}
            accessibilityRole="button"
          >
            <Text style={styles.retry}>Thử lại</Text>
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }

  return (
    <Image
      key={key}
      source={source}
      style={[styles.image, style]}
      contentFit={resizeMode === "contain" ? "contain" : "cover"}
      placeholder={BLURHASH}
      placeholderContentFit="cover"
      transition={300}
      accessibilityLabel={label}
      onError={() => setFailed(true)}
      cachePolicy="memory-disk"
      recyclingKey={source}
    />
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: "#f5f5f5",
  },
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
    overflow: "hidden",
  },
  placeholder: {
    gap: 6,
    padding: 12,
  },
  caption: { color: "#98a2b3", fontSize: 11 },
  retry: { color: "#13745b", fontSize: 12, padding: 8, fontWeight: "600" },
});
