import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, Pressable } from "react-native";
import React from "react";
import { useNavigation, DrawerActions } from "@react-navigation/native";
import {
  XMarkIcon,
  HomeIcon,
  ShoppingCartIcon,
  LockClosedIcon,
  ClipboardDocumentListIcon,
  UserCircleIcon,
  ClipboardDocumentCheckIcon,
  ChartBarIcon,
} from "react-native-heroicons/outline";

const SideMenu = ({ isAdmin }) => {
  const navigation = useNavigation();

  // Các mục chung cho mọi người dùng
  const commonItems = [
    { title: "Home", label: "Trang chủ", icon: HomeIcon },
    {
      title: "OrderList",
      label: "Danh sách đơn hàng",
      icon: ClipboardDocumentListIcon,
    },
    {
      title: "UserProfile",
      label: "Thông tin cá nhân",
      icon: UserCircleIcon,
    },
    {
      title: "ChangePassword",
      label: "Đổi mật khẩu",
      icon: LockClosedIcon,
    },
  ];

  // Mục chỉ dành cho user thường (không phải admin)
  const userItems = [
    { title: "Cart", label: "Giỏ hàng", icon: ShoppingCartIcon },
  ];

  // Mục chỉ dành cho admin
  const adminItems = [
    {
      title: "Statistic",
      label: "Thống kê",
      icon: ChartBarIcon,
    },
    {
      title: "ManageProduct",
      label: "Quản lý sản phẩm",
      icon: ClipboardDocumentCheckIcon,
    },
  ];

  // Xây dựng danh sách cuối cùng dựa trên role
  let navigations;
  if (isAdmin) {
    navigations = [...commonItems, ...adminItems];
  } else {
    navigations = [...commonItems, ...userItems];
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.title, { marginLeft: 20 }]}>Menu</Text>
        <Pressable
          onPress={() => navigation.dispatch(DrawerActions.closeDrawer())}
          style={styles.closeButton}
        >
          <XMarkIcon size={28} color={"#ff4d4d"} />
        </Pressable>
      </View>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {navigations.map(({ title, label, icon: Icon }) => (
          <Pressable
            key={title}
            style={({ pressed }) => [
              styles.menuItem,
              pressed && { backgroundColor: "#f0f0f0" },
            ]}
            onPress={() => navigation.navigate(title)}
          >
            <Icon size={22} color="#333" style={styles.icon} />
            <Text style={styles.menuText}>{label}</Text>
          </Pressable>
        ))}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 15,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222",
  },
  closeButton: {
    padding: 8,
  },
  menuContainer: {
    marginTop: 10,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 2,
  },
  icon: {
    marginRight: 15,
  },
  menuText: {
    fontSize: 16,
    color: "#333",
    fontWeight: "600",
  },
});

export default SideMenu;
