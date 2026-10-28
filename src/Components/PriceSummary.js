import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { formatMoney } from "../utils/money";
import { fonts, palette as c } from "../theme/storefront";

export default function PriceSummary({ itemCount = 0, totalPrice = 0, currency = "USD" }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tóm tắt đơn hàng</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Tổng số lượng</Text>
        <Text style={styles.value}>{itemCount} sản phẩm</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <Text style={styles.totalLabel}>Tổng tiền</Text>
        <Text style={styles.totalValue}>{formatMoney(totalPrice, currency)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: c.white,
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 18,
    color: c.ink,
    marginBottom: 16,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 6,
  },
  label: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: c.muted,
  },
  value: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: c.ink,
  },
  divider: {
    height: 1,
    backgroundColor: c.line,
    marginVertical: 12,
  },
  totalLabel: {
    fontFamily: fonts.bold,
    fontSize: 15,
    color: c.ink,
  },
  totalValue: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: c.green,
    letterSpacing: -0.5,
  },
});
