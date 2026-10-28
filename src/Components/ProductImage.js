import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

function LoadedImage({ source, label, resizeMode }) {
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  if (!source || failed) {
    return (
      <View style={styles.placeholder}>
        <Ionicons name="image-outline" size={32} color="#98a2b3" />
        <Text style={styles.caption}>Ảnh không khả dụng</Text>
        {source ? (
          <TouchableOpacity
            onPress={() => {
              setFailed(false);
              setLoading(true);
              setAttempt((v) => v + 1);
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
    <>
      <Image
        key={attempt}
        source={{ uri: source }}
        accessibilityLabel={label}
        style={StyleSheet.absoluteFillObject}
        resizeMode={resizeMode}
        fadeDuration={200}
        onLoadEnd={() => setLoading(false)}
        onError={() => {
          setLoading(false);
          setFailed(true);
        }}
      />
      {loading ? (
        <ActivityIndicator size="small" color="#13745b" />
      ) : null}
    </>
  );
}

export default function ProductImage({
  uri,
  style,
  label = "Ảnh sản phẩm",
  resizeMode = "contain",
}) {
  const source = typeof uri === "string" && uri.trim() ? uri.trim() : undefined;
  return (
    <View style={[styles.container, style]}>
      <LoadedImage
        key={source || "empty"}
        source={source}
        label={label}
        resizeMode={resizeMode}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
    overflow: "hidden",
  },
  placeholder: { alignItems: "center", padding: 12, gap: 6 },
  caption: { color: "#98a2b3", fontSize: 11 },
  retry: { color: "#13745b", fontSize: 12, padding: 8, fontWeight: "600" },
});
