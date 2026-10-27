import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { API_BASE_URL } from "../config/api";
import api from "../services/api";

export default function ConnectionStatus() {
  const navigation = useNavigation();
  const [status, setStatus] = useState("Đang kiểm tra...");
  const [loading, setLoading] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    api
      .get("/health", { signal: controller.signal })
      .then(({ data }) => {
        setStatus(
          data.database === "connected"
            ? "Kết nối backend và MongoDB thành công."
            : "Backend đã phản hồi, MongoDB chưa sẵn sàng.",
        );
      })
      .catch((error) => {
        if (!controller.signal.aborted)
          setStatus(
            error.response
              ? "Backend đã phản hồi, MongoDB chưa sẵn sàng."
              : "Chưa kết nối được backend. Kiểm tra cùng Wi-Fi, backend đang chạy và quyền mạng nội bộ của Expo Go.",
          );
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
    return () => controller.abort();
  }, [attempt]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.button}
        >
          <Text style={styles.link}>← Trở lại</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Kiểm tra kết nối</Text>
        <Text selectable style={styles.address}>
          {API_BASE_URL || "Chưa xác định địa chỉ API"}
        </Text>
        {loading ? (
          <ActivityIndicator size="large" color="#1d4ed8" />
        ) : (
          <Text style={styles.status}>{status}</Text>
        )}
        <TouchableOpacity
          disabled={loading}
          onPress={() => setAttempt((value) => value + 1)}
          style={styles.button}
          accessibilityRole="button"
        >
          <Text style={styles.link}>Kiểm tra lại</Text>
        </TouchableOpacity>
        <Text style={styles.help}>
          Trên máy tính, chạy npm start từ thư mục gốc dự án để mở backend và
          Expo. Nếu đổi Wi-Fi, dừng rồi chạy lại để cập nhật địa chỉ IP.
        </Text>
        <Text style={styles.help}>
          Nếu dùng Expo tunnel, backend vẫn cần truy cập được qua cùng Wi-Fi
          hoặc một EXPO_PUBLIC_API_URL riêng.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { padding: 24, gap: 18, flexGrow: 1, backgroundColor: "#fff" },
  title: { fontSize: 25, fontWeight: "700" },
  address: { color: "#475569", fontSize: 16 },
  status: { fontSize: 18, lineHeight: 28 },
  button: { paddingVertical: 14 },
  link: { color: "#1d4ed8", fontWeight: "600" },
  help: { color: "#475569", lineHeight: 24 },
});
