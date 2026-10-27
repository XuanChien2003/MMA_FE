import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import api from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "../constants";

const AdminStatistics = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  const fetchStatistics = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setError("Vui lòng đăng nhập lại");
        setLoading(false);
        return;
      }

      const response = await api.get("/api/order/get-statistics", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === "OK") {
        setStats(response.data.data);
      } else {
        setError(response.data.message || "Lỗi khi tải dữ liệu thống kê");
      }
    } catch (err) {
      console.error("Error fetching statistics:", err);
      setError("Không thể kết nối đến server");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  if (loading) {
    return (
      <SafeAreaView style={styles.safeAreaLoading}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.buttonColor} />
          <Text style={styles.loadingText}>Đang tải thống kê...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.safeAreaLoading}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchStatistics}
          >
            <Text style={styles.retryButtonText}>Thử lại</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // Find max monthly revenue for progress bar scaling
  const maxRevenue = stats?.monthlyRevenue
    ? Math.max(...stats.monthlyRevenue.map((m) => m.revenue), 1)
    : 1;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <ArrowLeftIcon size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Thống kê doanh thu</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Summary Cards */}
          <View style={styles.cardsRow}>
            <View style={[styles.statCard, styles.revenueCard]}>
              <Ionicons name="cash-outline" size={28} color="#fff" />
              <Text style={styles.cardValue}>
                {(stats?.totalRevenue || 0).toLocaleString("vi-VN")}
              </Text>
              <Text style={styles.cardUnit}>VNĐ</Text>
              <Text style={styles.cardLabel}>Tổng doanh thu</Text>
            </View>
            <View style={[styles.statCard, styles.ordersCard]}>
              <Ionicons name="receipt-outline" size={28} color="#fff" />
              <Text style={styles.cardValue}>{stats?.totalOrders || 0}</Text>
              <Text style={styles.cardLabel}>Tổng đơn hàng</Text>
            </View>
          </View>

          <View style={styles.cardsRow}>
            <View style={[styles.statCard, styles.productsCard]}>
              <Ionicons name="cube-outline" size={28} color="#fff" />
              <Text style={styles.cardValue}>{stats?.totalProducts || 0}</Text>
              <Text style={styles.cardLabel}>Tổng sản phẩm</Text>
            </View>
            <View style={[styles.statCard, styles.paymentCard]}>
              <Ionicons name="card-outline" size={28} color="#fff" />
              <Text style={styles.cardValue}>
                {stats?.paymentStats?.VNPay || 0} /{" "}
                {stats?.paymentStats?.COD || 0}
              </Text>
              <Text style={styles.cardLabel}>VNPay / COD</Text>
            </View>
          </View>

          {/* Monthly Revenue */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="bar-chart-outline" size={18} color="#333" /> Doanh
              thu theo tháng
            </Text>
            {stats?.monthlyRevenue?.map((item, index) => (
              <View key={index} style={styles.monthRow}>
                <Text style={styles.monthLabel}>{item.month}</Text>
                <View style={styles.progressBarContainer}>
                  <View
                    style={[
                      styles.progressBar,
                      {
                        width: `${Math.max(
                          (item.revenue / maxRevenue) * 100,
                          2,
                        )}%`,
                      },
                    ]}
                  />
                </View>
                <View style={styles.monthStats}>
                  <Text style={styles.monthRevenue}>
                    {item.revenue.toLocaleString("vi-VN")} đ
                  </Text>
                  <Text style={styles.monthOrders}>{item.orderCount} đơn</Text>
                </View>
              </View>
            ))}
          </View>

          {/* Top Products */}
          <View style={styles.sectionCard}>
            <Text style={styles.sectionTitle}>
              <Ionicons name="trophy-outline" size={18} color="#333" /> Top 5
              sản phẩm bán chạy
            </Text>
            {stats?.topProducts?.length === 0 ? (
              <Text style={styles.emptyText}>Chưa có dữ liệu</Text>
            ) : (
              stats?.topProducts?.map((product, index) => (
                <View key={index} style={styles.topProductRow}>
                  <View
                    style={[
                      styles.rankBadge,
                      index === 0 && styles.rankGold,
                      index === 1 && styles.rankSilver,
                      index === 2 && styles.rankBronze,
                    ]}
                  >
                    <Text style={styles.rankText}>#{index + 1}</Text>
                  </View>
                  <View style={styles.productInfo}>
                    <Text style={styles.topProductName} numberOfLines={1}>
                      {product.name}
                    </Text>
                  </View>
                  <View style={styles.soldBadge}>
                    <Text style={styles.soldText}>
                      Đã bán: {product.totalSold}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.buttonColor,
  },
  safeAreaLoading: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f2f5",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f2f5",
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: "#e74c3c",
    marginBottom: 16,
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: colors.buttonColor,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  // Header
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 15,
    backgroundColor: colors.buttonColor,
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  // Summary Cards
  cardsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 14,
    padding: 16,
    marginHorizontal: 4,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  revenueCard: {
    backgroundColor: "#27ae60",
  },
  ordersCard: {
    backgroundColor: "#2980b9",
  },
  productsCard: {
    backgroundColor: "#8e44ad",
  },
  paymentCard: {
    backgroundColor: "#e67e22",
  },
  cardValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#fff",
    marginTop: 8,
  },
  cardUnit: {
    fontSize: 11,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "600",
  },
  cardLabel: {
    fontSize: 12,
    color: "rgba(255,255,255,0.85)",
    marginTop: 4,
    fontWeight: "500",
  },
  // Section Cards
  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 14,
    color: "#999",
    textAlign: "center",
    paddingVertical: 20,
  },
  // Monthly Revenue
  monthRow: {
    marginBottom: 14,
  },
  monthLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#555",
    marginBottom: 6,
  },
  progressBarContainer: {
    height: 10,
    backgroundColor: "#e8ecf0",
    borderRadius: 5,
    overflow: "hidden",
    marginBottom: 4,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#3498db",
    borderRadius: 5,
  },
  monthStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  monthRevenue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#27ae60",
  },
  monthOrders: {
    fontSize: 12,
    color: "#888",
  },
  // Top Products
  topProductRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  rankBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#bdc3c7",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  rankGold: {
    backgroundColor: "#f1c40f",
  },
  rankSilver: {
    backgroundColor: "#95a5a6",
  },
  rankBronze: {
    backgroundColor: "#cd7f32",
  },
  rankText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#fff",
  },
  productInfo: {
    flex: 1,
  },
  topProductName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  soldBadge: {
    backgroundColor: "#e8f5e9",
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  soldText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#27ae60",
  },
});

export default AdminStatistics;
