import { View, Text } from "react-native";
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import StackNavigation from "./StackNavigation";
import SideMenu from "../Components/SideMenu";
import { useSelector } from "react-redux";

const DrawerStack = createDrawerNavigator();
const DrawerNavigation = () => {
  const isAdmin = useSelector((state) => state.auth.isAdmin); // Replace state.user.role with your actual state path
  console.log("isAdmin", isAdmin);
  return (
    <DrawerStack.Navigator drawerContent={() => <SideMenu isAdmin={isAdmin} />}>
      <DrawerStack.Screen
        name="StackScreens"
        component={StackNavigation}
        options={{ headerShown: false }}
      />
    </DrawerStack.Navigator>
  );
};

export default DrawerNavigation;
