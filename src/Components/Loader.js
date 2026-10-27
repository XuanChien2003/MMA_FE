import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { colors } from "../constants";

const { height } = Dimensions.get("window");

const Loader = ({ title }) => {
  return (
    <View style={styles.container}>
      <View style={{ marginTop: -100 }}>
        <Text
          style={{
            textAlign: "center",
            marginBottom: 10,
            color: colors.defaultWhite,
            fontSize: 16,
          }}
        >
          {title ? title : "Loading is running..."}
        </Text>
        <ActivityIndicator size={80} color={colors.designColor} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    height: height - 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
});
export default Loader;
