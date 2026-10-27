import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Image,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Bars4Icon,
  ShoppingCartIcon,
  UserIcon,
} from "react-native-heroicons/outline";
import { colors } from "../constants";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/authSlice";
import useCart from "../hooks/useCart";

const Header = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const { itemCount: totalQuantity } = useCart();
  const isAdmin = useSelector((state) => state.auth.isAdmin); // lấy isAdmin

  const handleLogout = async () => {
    await AsyncStorage.multiRemove([
      "token",
      "isAdmin",
      "username",
      "fullname",
    ]);
    dispatch(logoutUser());
    navigation.navigate("Home");
  };

  return (
    <SafeAreaView edges={["top", "left", "right"]} style={styles.safeArea}>
      <View style={styles.container}>
        {/* Nút mở menu */}
        <Pressable
          onPress={() => navigation.openDrawer()}
          style={styles.iconButton}
        >
          <Bars4Icon color={colors.textBlack} size={28} />
        </Pressable>

        {/* Logo trung tâm */}
        <Image
          source={{
            uri: "https://shoptaycam.com/wp-content/uploads/2018/05/logo-1-khong-nen.png",
          }}
          style={styles.logo}
        />

        {/* Đăng nhập / Đăng xuất */}
        <View style={styles.authContainer}>
          {isLoggedIn ? (
            <TouchableOpacity style={styles.authButton} onPress={handleLogout}>
              <UserIcon size={20} color={colors.textBlack} />
              <Text style={styles.authText}>Đăng xuất</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={styles.authButton}
              onPress={() => navigation.navigate("Login")}
            >
              <UserIcon size={20} color={colors.textBlack} />
              <Text style={styles.authText}>Đăng nhập</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Giỏ hàng - chỉ hiển thị nếu không phải admin */}
        {!isAdmin && (
          <Pressable
            onPress={() => navigation.navigate("Cart")}
            style={styles.cartContainer}
          >
            <ShoppingCartIcon color={colors.textBlack} size={28} />
            {totalQuantity > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{totalQuantity}</Text>
              </View>
            )}
          </Pressable>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    paddingBottom: 5,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  iconButton: {
    padding: 5,
  },
  logo: {
    flex: 1,
    maxWidth: 160,
    minWidth: 50,
    height: 50,
    resizeMode: "contain",
  },
  authContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  authButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  authText: {
    fontSize: 14,
    fontWeight: "600",
    color: colors.textBlack,
  },
  cartContainer: {
    position: "relative",
    padding: 5,
  },
  cartBadge: {
    position: "absolute",
    right: -6,
    top: -3,
    backgroundColor: "red",
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
  },
  cartBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default Header;
