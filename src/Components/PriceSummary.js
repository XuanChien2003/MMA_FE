import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { formatMoney } from "../utils/money";

export default function PriceSummary({ itemCount, totals }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giỏ hàng · {itemCount} sản phẩm</Text>
      {Object.entries(totals).map(([currency, total]) => (
        <View style={styles.row} key={currency}>
          <Text>Tổng cộng ({currency})</Text>
          <Text style={styles.total}>{formatMoney(total, currency)}</Text>
        </View>
      ))}
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    padding: 18,
    borderRadius: 12,
    backgroundColor: "#eff6ff",
    marginVertical: 12,
  },
  title: { fontSize: 18, fontWeight: "700", marginBottom: 12 },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 8,
    paddingVertical: 6,
  },
  total: { color: "#1d4ed8", fontWeight: "700" },
});
