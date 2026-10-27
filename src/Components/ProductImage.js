import React, { useEffect, useState } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";

export default function ProductImage({ uri, style }) {
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    setLoading(true);
    setFailed(false);
  }, [uri]);
  return (
    <View style={[styles.container, style]}>
      {uri && !failed ? (
        <Image
          source={{ uri }}
          style={StyleSheet.absoluteFillObject}
          resizeMode="contain"
          fadeDuration={200}
          onLoadEnd={() => setLoading(false)}
          onError={() => {
            setFailed(true);
            setLoading(false);
          }}
        />
      ) : (
        <Text style={styles.placeholder}>Chưa có ảnh</Text>
      )}
      {loading && uri && !failed ? <ActivityIndicator color="#1d4ed8" /> : null}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f8fafc",
  },
  placeholder: { color: "#64748b" },
});
