import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import { colors } from "../constants";

const PaymentMethod = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { products, total, userId } = route.params;

  const handleSelectCOD = () => {
    // COD: directly place order with paymentMethod COD
    navigation.navigate("VNPaySimulator", {
      products,
      total,
      userId,
      paymentMethod: "COD",
    });
  };

  const handleSelectVNPay = () => {
    navigation.navigate("VNPaySimulator", {
      products,
      total,
      userId,
      paymentMethod: "VNPay",
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerContainer}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ArrowLeftIcon size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Chọn phương thức thanh toán</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Order Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Thông tin đơn hàng</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Số lượng sản phẩm:</Text>
            <Text style={styles.summaryValue}>{products.length}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.summaryRow}>
            <Text style={styles.totalLabel}>Tổng thanh toán:</Text>
            <Text style={styles.totalValue}>
              {total.toLocaleString("vi-VN")} VNĐ
            </Text>
          </View>
        </View>

        {/* Payment Options */}
        <Text style={styles.sectionTitle}>Phương thức thanh toán</Text>

        {/* COD Option */}
        <TouchableOpacity style={styles.paymentOption} onPress={handleSelectCOD}>
          <View style={styles.paymentIconContainer}>
            <Text style={styles.codIcon}>💵</Text>
          </View>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentName}>Thanh toán khi nhận hàng (COD)</Text>
            <Text style={styles.paymentDesc}>
              Thanh toán bằng tiền mặt khi nhận được hàng
            </Text>
          </View>
          <View style={styles.arrowContainer}>
            <Text style={styles.arrow}>›</Text>
          </View>
        </TouchableOpacity>

        {/* VNPay Option */}
        <TouchableOpacity
          style={[styles.paymentOption, styles.vnpayOption]}
          onPress={handleSelectVNPay}
        >
          <View style={[styles.paymentIconContainer, styles.vnpayIconBg]}>
            <Text style={styles.vnpayIcon}>VN</Text>
          </View>
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentName}>Cổng thanh toán VNPay</Text>
            <Text style={styles.paymentDesc}>
              Thanh toán trực tuyến qua VNPay (ATM / Visa / QR)
            </Text>
            <View style={styles.recommendBadge}>
              <Text style={styles.recommendText}>Khuyến nghị</Text>
            </View>
          </View>
          <View style={styles.arrowContainer}>
            <Text style={styles.arrow}>›</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e8e8e8",
  },
  backButton: {
    marginRight: 12,
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  summaryCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#666",
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 8,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  totalValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#e74c3c",
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#e8e8e8",
  },
  vnpayOption: {
    borderColor: "#0066b2",
    borderWidth: 1.5,
  },
  paymentIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#f0f9f0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  codIcon: {
    fontSize: 24,
  },
  vnpayIconBg: {
    backgroundColor: "#e6f0fa",
  },
  vnpayIcon: {
    fontSize: 16,
    fontWeight: "900",
    color: "#0066b2",
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
    marginBottom: 4,
  },
  paymentDesc: {
    fontSize: 13,
    color: "#888",
    lineHeight: 18,
  },
  recommendBadge: {
    backgroundColor: "#0066b2",
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: "flex-start",
    marginTop: 6,
  },
  recommendText: {
    fontSize: 11,
    color: "#fff",
    fontWeight: "600",
  },
  arrowContainer: {
    marginLeft: 8,
  },
  arrow: {
    fontSize: 24,
    color: "#ccc",
    fontWeight: "300",
  },
});

export default PaymentMethod;
