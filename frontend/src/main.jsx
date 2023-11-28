import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import { Provider } from "react-redux";
import ReactDOM from "react-dom/client";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { HelmetProvider } from "react-helmet-async";

import App from "./App.jsx";

import "./assets/styles/bootstrap.custom.css";
import "./assets/styles/index.css";

import HomeScreen from "./screens/HomeScreen.jsx";
import ProductScreen from "./screens/ProductScreen.jsx";
import CartScreen from "./screens/CartScreen.jsx";
import LoginScreen from "./screens/LoginScreen.jsx";
import RegisterScreen from "./screens/RegisterScreen.jsx";
import ShippingScreen from "./screens/ShippingScreen.jsx";
import PaymentScreen from "./screens/PaymentScreen.jsx";
import PlaceorderScreen from "./screens/PlaceorderScreen.jsx";
import OrderScreen from "./screens/OrderScreen.jsx";
import ProfileScreen from "./screens/ProfileScreen.jsx";

// admin screens
import ProductlistScreen from "./screens/admin/ProductlistScreen.jsx";
import UserlistScreen from "./screens/admin/UserlistScreen.jsx";
import OrderlistScreen from "./screens/admin/OrderlistScreen.jsx";
import EditproductScreen from "./screens/admin/EditproductScreen.jsx";
import EdituserScreen from "./screens/admin/EdituserScreen.jsx";

import PrivateRoute from "./components/PrivateRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";

import store from "./store.js";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index path="/" element={<HomeScreen />} />
      <Route path="/search/:keyword" element={<HomeScreen />} />
      <Route path="/page/:pageNumber" element={<HomeScreen />} />
      <Route
        path="/search/:keyword/page/:pageNumber"
        element={<HomeScreen />}
      />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/register" element={<RegisterScreen />} />
      <Route path="/cart" element={<CartScreen />} />
      <Route path="/product/:id" element={<ProductScreen />} />
      <Route path="" element={<PrivateRoute />}>
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="/shipping" element={<ShippingScreen />} />
        <Route path="/payment" element={<PaymentScreen />} />
        <Route path="/place-order" element={<PlaceorderScreen />} />
        <Route path="/order/:id" element={<OrderScreen />} />
      </Route>
      <Route path="" element={<AdminRoute />}>
        <Route path="/admin/products" element={<ProductlistScreen />} />
        <Route
          path="/admin/products/:pageNumber"
          element={<ProductlistScreen />}
        />
        <Route path="/admin/users" element={<UserlistScreen />} />
        <Route path="/admin/orders" element={<OrderlistScreen />} />
        <Route path="/admin/product/:id/edit" element={<EditproductScreen />} />
        <Route path="/admin/user/:id/edit" element={<EdituserScreen />} />
      </Route>
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <Provider store={store}>
        <PayPalScriptProvider deferLoading={true}>
          <RouterProvider router={router} />
        </PayPalScriptProvider>
      </Provider>
    </HelmetProvider>
  </React.StrictMode>
);
