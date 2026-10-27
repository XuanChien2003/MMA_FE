import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { ArrowLeftIcon } from "react-native-heroicons/outline";
import { useDispatch } from "react-redux";
import { resetCart } from "../redux/orebiSlices";
import Toast from "react-native-toast-message";
import api from "../services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { colors } from "../constants";

const BANKS = [
  { id: "vcb", name: "Vietcombank", code: "VCB", color: "#006A4E" },
  { id: "tcb", name: "Techcombank", code: "TCB", color: "#ED1C24" },
  { id: "bidv", name: "BIDV", code: "BIDV", color: "#003399" },
  { id: "vpb", name: "VPBank", code: "VPB", color: "#00693E" },
  { id: "mb", name: "MB Bank", code: "MB", color: "#1E4D8C" },
  { id: "acb", name: "ACB", code: "ACB", color: "#1A1A6C" },
];

const VNPaySimulator = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const dispatch = useDispatch();
  const { products, total, userId, paymentMethod } = route.params;

  const [selectedBank, setSelectedBank] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  const isCOD = paymentMethod === "COD";

  const handlePlaceOrder = async () => {
    if (!isCOD && !selectedBank) {
      Toast.show({
        type: "error",
        text1: "Vui lòng chọn ngân hàng",
        text1Style: { color: "red" },
      });
      return;
    }

    setIsProcessing(true);

    try {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        setIsProcessing(false);
        return Toast.show({
          type: "error",
          text1: "Vui lòng đăng nhập lại",
          text1Style: { color: "red" },
        });
      }

      const orderData = {
        userId: userId,
        products: products.map((item) => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
        })),
        paymentMethod: paymentMethod,
        paymentStatus: isCOD ? "pending" : "paid",
      };

      // Simulate VNPay processing delay
      if (!isCOD) {
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      const response = await api.post("/api/order/add-order", orderData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.status === 201) {
        setPaymentSuccess(true);
        dispatch(resetCart());

        // Auto-navigate after 2 seconds
        setTimeout(() => {
          navigation.navigate("Home");
        }, 2500);
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error("Payment Error:", error.response?.data || error.message);
      Toast.show({
        type: "error",
        text1: "Lỗi thanh toán",
        text2: error.response?.data?.message || "Đã có lỗi xảy ra",
        text2Style: { color: "black" },
      });
    } finally {
      setIsProcessing(false);
    }
  };

  // Success screen
  if (paymentSuccess) {
    return (
      <View style={styles.successContainer}>
        <View style={styles.successIconCircle}>
          <Text style={styles.successIcon}>✓</Text>
        </View>
        <Text style={styles.successTitle}>
          {isCOD ? "Đặt hàng thành công!" : "Thanh toán thành công!"}
        </Text>
        <Text style={styles.successAmount}>
          {total.toLocaleString("vi-VN")} VNĐ
        </Text>
        <Text style={styles.successDesc}>
          {isCOD
            ? "Đơn hàng của bạn đã được ghi nhận. Vui lòng thanh toán khi nhận hàng."
            : "Giao dịch VNPay đã được xử lý thành công. Cảm ơn bạn!"}
        </Text>
        <Text style={styles.redirectText}>
          Đang chuyển hướng về trang chủ...
        </Text>
      </View>
    );
  }

  // COD confirmation screen
  if (isCOD) {
    return (
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <ArrowLeftIcon size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Xác nhận đơn hàng (COD)</Text>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.codCard}>
            <Text style={styles.codCardIcon}>💵</Text>
            <Text style={styles.codCardTitle}>Thanh toán khi nhận hàng</Text>
            <Text style={styles.codCardDesc}>
              Bạn sẽ thanh toán bằng tiền mặt khi nhận được hàng từ shipper.
            </Text>
          </View>

          {/* Order details */}
          <View style={styles.orderCard}>
            <Text style={styles.orderCardTitle}>Chi tiết đơn hàng</Text>
            {products.map((item, index) => (
              <View key={index} style={styles.productRow}>
                <Text style={styles.productName} numberOfLines={1}>
                  {item.name}
                </Text>
                <Text style={styles.productQty}>x{item.quantity}</Text>
                <Text style={styles.productPrice}>
                  {(item.price * item.quantity).toLocaleString("vi-VN")} đ
                </Text>
              </View>
            ))}
            <View style={styles.orderDivider} />
            <View style={styles.productRow}>
              <Text style={styles.orderTotal}>Tổng cộng</Text>
              <Text style={styles.orderTotalAmount}>
                {total.toLocaleString("vi-VN")} VNĐ
              </Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelButtonText}>Hủy</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.confirmButton,
              isProcessing && styles.disabledButton,
            ]}
            onPress={handlePlaceOrder}
            disabled={isProcessing}
          >
            {isProcessing ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.confirmButtonText}>Xác nhận đặt hàng</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // VNPay simulation screen
  return (
    <View style={styles.container}>
      {/* VNPay Header */}
      <View style={styles.vnpayHeader}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ArrowLeftIcon size={24} color="#fff" />
        </TouchableOpacity>
        <View style={styles.vnpayLogoContainer}>
          <Text style={styles.vnpayLogoText}>VNPAY</Text>
        </View>
        <Text style={styles.vnpayHeaderTitle}>Cổng thanh toán</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Transaction info */}
        <View style={styles.transactionCard}>
          <Text style={styles.transactionTitle}>Thông tin giao dịch</Text>
          <View style={styles.transactionRow}>
            <Text style={styles.transactionLabel}>Đơn vị bán hàng:</Text>
            <Text style={styles.transactionValue}>PRJ_MMA Store</Text>
          </View>
          <View style={styles.transactionRow}>
            <Text style={styles.transactionLabel}>Mã giao dịch:</Text>
            <Text style={styles.transactionValue}>
              VNP{Date.now().toString().slice(-8)}
            </Text>
          </View>
          <View style={styles.transactionRow}>
            <Text style={styles.transactionLabel}>Số tiền:</Text>
            <Text style={styles.transactionAmount}>
              {total.toLocaleString("vi-VN")} VNĐ
            </Text>
          </View>
        </View>

        {/* Bank selection */}
        <Text style={styles.bankSectionTitle}>Chọn ngân hàng thanh toán</Text>
        <View style={styles.bankGrid}>
          {BANKS.map((bank) => (
            <TouchableOpacity
              key={bank.id}
              style={[
                styles.bankItem,
                selectedBank === bank.id && styles.bankItemSelected,
              ]}
              onPress={() => setSelectedBank(bank.id)}
            >
              <View style={[styles.bankLogo, { backgroundColor: bank.color }]}>
                <Text style={styles.bankLogoText}>{bank.code}</Text>
              </View>
              <Text
                style={[
                  styles.bankName,
                  selectedBank === bank.id && styles.bankNameSelected,
                ]}
                numberOfLines={1}
              >
                {bank.name}
              </Text>
              {selectedBank === bank.id && (
                <View style={styles.checkMark}>
                  <Text style={styles.checkMarkText}>✓</Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Security notice */}
        <View style={styles.securityNotice}>
          <Text style={styles.securityIcon}>🔒</Text>
          <Text style={styles.securityText}>
            Giao dịch được bảo mật bởi VNPay. Thông tin của bạn sẽ không bị chia
            sẻ.
          </Text>
        </View>
      </ScrollView>

      {/* Bottom action bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Hủy</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.vnpayConfirmButton,
            (!selectedBank || isProcessing) && styles.disabledButton,
          ]}
          onPress={handlePlaceOrder}
          disabled={!selectedBank || isProcessing}
        >
          {isProcessing ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.confirmButtonText}>Xác nhận thanh toán</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f7fa",
  },
  // Success Screen
  successContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f7fa",
    padding: 30,
  },
  successIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#27ae60",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  successIcon: {
    fontSize: 40,
    color: "#fff",
    fontWeight: "bold",
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#333",
    marginBottom: 10,
  },
  successAmount: {
    fontSize: 28,
    fontWeight: "800",
    color: "#27ae60",
    marginBottom: 16,
  },
  successDesc: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  redirectText: {
    fontSize: 13,
    color: "#999",
    fontStyle: "italic",
  },
  // Headers
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
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  vnpayHeader: {
    backgroundColor: "#0066b2",
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 20,
    alignItems: "center",
  },
  backButton: {
    position: "absolute",
    left: 16,
    top: 50,
    padding: 4,
    zIndex: 1,
  },
  vnpayLogoContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginBottom: 8,
  },
  vnpayLogoText: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0066b2",
    letterSpacing: 2,
  },
  vnpayHeaderTitle: {
    fontSize: 14,
    color: "#fff",
    opacity: 0.9,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  // COD Card
  codCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  codCardIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  codCardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#333",
    marginBottom: 8,
  },
  codCardDesc: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  // Order Card
  orderCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  orderCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },
  productRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  productName: {
    flex: 1,
    fontSize: 14,
    color: "#333",
    marginRight: 8,
  },
  productQty: {
    fontSize: 14,
    color: "#666",
    marginRight: 12,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  orderDivider: {
    height: 1,
    backgroundColor: "#eee",
    marginVertical: 8,
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
  },
  orderTotalAmount: {
    fontSize: 18,
    fontWeight: "700",
    color: "#e74c3c",
  },
  // Transaction Card (VNPay)
  transactionCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },
  transactionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
  },
  transactionLabel: {
    fontSize: 14,
    color: "#666",
  },
  transactionValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#e74c3c",
  },
  // Bank Selection
  bankSectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#333",
    marginBottom: 12,
  },
  bankGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  bankItem: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#e8e8e8",
    position: "relative",
  },
  bankItemSelected: {
    borderColor: "#0066b2",
    backgroundColor: "#f0f7ff",
  },
  bankLogo: {
    width: 48,
    height: 48,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  bankLogoText: {
    fontSize: 12,
    fontWeight: "900",
    color: "#fff",
  },
  bankName: {
    fontSize: 13,
    fontWeight: "600",
    color: "#555",
    textAlign: "center",
  },
  bankNameSelected: {
    color: "#0066b2",
  },
  checkMark: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#0066b2",
    justifyContent: "center",
    alignItems: "center",
  },
  checkMarkText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "bold",
  },
  // Security
  securityNotice: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f9f0",
    borderRadius: 8,
    padding: 12,
  },
  securityIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  securityText: {
    flex: 1,
    fontSize: 12,
    color: "#666",
    lineHeight: 18,
  },
  // Bottom Bar
  bottomBar: {
    flexDirection: "row",
    padding: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#e8e8e8",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    marginRight: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#666",
  },
  confirmButton: {
    flex: 2,
    backgroundColor: "#27ae60",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  vnpayConfirmButton: {
    flex: 2,
    backgroundColor: "#0066b2",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  disabledButton: {
    opacity: 0.5,
  },
});

export default VNPaySimulator;
