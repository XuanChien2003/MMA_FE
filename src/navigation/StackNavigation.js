import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Home from "../Screens/Home";
import ProductDetails from "../Screens/ProductDetails";
import Cart from "../Screens/Cart";
const Stack = createNativeStackNavigator();
export default function StackNavigation() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="ProductDetails" component={ProductDetails} />
      <Stack.Screen name="Cart" component={Cart} />
    </Stack.Navigator>
  );
}
