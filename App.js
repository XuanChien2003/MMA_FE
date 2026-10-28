import React from "react";
import { ActivityIndicator, View } from "react-native";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { Provider } from "react-redux";
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import * as Linking from "expo-linking";
import Toast, { BaseToast } from "react-native-toast-message";
import StackNavigation from "./src/navigation/StackNavigation";
import { store } from "./src/redux/store";
import { palette, fonts } from "./src/theme/storefront";

const toast = (props, color) => (
  <BaseToast
    {...props}
    style={{
      borderLeftColor: color,
      width: "90%",
      maxWidth: 480,
      height: "auto",
      minHeight: 70,
    }}
    contentContainerStyle={{ padding: 16 }}
    text1NumberOfLines={2}
    text2NumberOfLines={3}
    text1Style={{ fontFamily: fonts.semibold, fontSize: 13 }}
    text2Style={{ fontFamily: fonts.regular, fontSize: 12, lineHeight: 20 }}
  />
);
const toastConfig = {
  success: (props) => toast(props, palette.green),
  error: (props) => toast(props, "#b23f2d"),
};
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: palette.green,
    background: palette.canvas,
    card: palette.white,
    text: palette.ink,
    border: palette.line,
  },
};
const linking = {
  prefixes: [Linking.createURL("/"), "myapp://"],
  config: {
    screens: {
      ProductList: "",
      ProductDetail: "product/:productId",
      Cart: "cart",
    },
  },
};
export default function App() {
  const [loaded, error] = useFonts({
    "BeVietnam-Regular": require("./assets/fonts/BeVietnamPro-Regular.ttf"),
    "BeVietnam-Medium": require("./assets/fonts/BeVietnamPro-Medium.ttf"),
    "BeVietnam-SemiBold": require("./assets/fonts/BeVietnamPro-SemiBold.ttf"),
    "BeVietnam-Bold": require("./assets/fonts/BeVietnamPro-Bold.ttf"),
    "BeVietnam-ExtraBold": require("./assets/fonts/BeVietnamPro-ExtraBold.ttf"),
  });
  const loading = (
    <View
      style={{
        flex: 1,
        backgroundColor: palette.canvas,
        justifyContent: "center",
      }}
    >
      <ActivityIndicator size="large" color={palette.green} />
    </View>
  );
  if (!loaded && !error) return loading;
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <Provider store={store}>
        <NavigationContainer theme={theme} linking={linking}>
          <StackNavigation />
        </NavigationContainer>
        <Toast config={toastConfig} position="top" visibilityTime={3000} />
      </Provider>
    </SafeAreaProvider>
  );
}
