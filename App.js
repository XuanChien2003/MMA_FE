import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import DrawerNavigation from "./src/navigation/DrawerNavigation";
import { Provider } from "react-redux";
import { store, persistor } from "./src/redux/store";
import { PersistGate } from "redux-persist/integration/react";
import { ActivityIndicator } from "react-native";
import * as Linking from "expo-linking";
import {
  SafeAreaProvider,
  initialWindowMetrics,
} from "react-native-safe-area-context";
import { colors } from "./src/constants"; // Make sure this exists
import Toast, { BaseToast } from "react-native-toast-message"; // Import Toast components

const commonToastProps = {
  style: {
    minHeight: 70,
    height: "auto",
    width: "90%",
  },
  contentContainerStyle: {
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  text1NumberOfLines: 10,
  text2NumberOfLines: 10,
  text1Style: {
    fontSize: 15,
    fontWeight: "500",
    flexWrap: "wrap",
  },
  text2Style: {
    fontSize: 13,
    flexWrap: "wrap",
  },
};

const renderToast = (props, borderLeftColor) => (
  <BaseToast
    {...props}
    {...commonToastProps}
    style={[commonToastProps.style, { borderLeftColor }, props.style]}
    contentContainerStyle={[
      commonToastProps.contentContainerStyle,
      props.contentContainerStyle,
    ]}
    text1Style={[commonToastProps.text1Style, props.text1Style]}
    text2Style={[commonToastProps.text2Style, props.text2Style]}
  />
);

const RootContent = () => {
  return (
    <NavigationContainer
      linking={{
        prefixes: [Linking.createURL("/"), "myapp://"],
        config: {
          screens: {
            StackScreens: {
              screens: { Home: "", ResetPassword: "reset-password" },
            },
          },
        },
      }}
    >
      <DrawerNavigation />
    </NavigationContainer>
  );
};

// Custom Toast configuration
const toastConfig = {
  success: (props) => renderToast(props, colors.designColor),
  error: (props) => renderToast(props, "#D32F2F"),
  info: (props) => renderToast(props, "#1976D2"),
};

const App = () => {
  return (
    <SafeAreaProvider initialMetrics={initialWindowMetrics}>
      <Provider store={store}>
        <PersistGate
          loading={<ActivityIndicator size="large" />}
          persistor={persistor}
        >
          <RootContent />
        </PersistGate>
        {/* Toast component to handle showing the toast notifications */}
        <Toast config={toastConfig} position="top" visibilityTime={4000} />
      </Provider>
    </SafeAreaProvider>
  );
};

export default App;
