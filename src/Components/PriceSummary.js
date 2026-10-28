import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { formatMoney } from "../utils/money";
import { fonts, palette as c } from "../theme/storefront";

export default function PriceSummary({ itemCount, totals }) {
  return (
    <View>
      <Text style={styles.title}>Tóm tắt giỏ hàng</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Số lượng sản phẩm</Text>
        <Text style={styles.value}>{itemCount}</Text>
      </View>
      <View style={styles.divider} />
      {Object.entries(totals).map(([currency, total]) => (
        <View style={styles.row} key={currency}>
          <Text style={styles.label}>Tổng tiền sản phẩm</Text>
          <Text style={styles.total}>{formatMoney(total, currency)}</Text>
        </View>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  title: {
    fontFamily: fonts.bold,
    fontSize: 20,
    color: c.ink,
    marginBottom: 24,
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  label: { fontFamily: fonts.regular, fontSize: 12, color: c.muted },
  value: { fontFamily: fonts.semibold, fontSize: 13, color: c.ink },
  divider: { height: 1, backgroundColor: c.line, marginVertical: 16 },
  total: {
    fontFamily: fonts.bold,
    fontSize: 22,
    color: c.green,
    letterSpacing: -0.5,
  },
});
