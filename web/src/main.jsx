import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./styles/index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MerchantDashboard from "./Components/Merchant/Merchant.Dashboard.jsx";
import Productpage from "./Components/User/ProductPage.jsx";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Login from "./Components/Login.page.jsx";
import SignupPage from "./Components/Signup.page.jsx";
import { AuthContextProvider } from "./Context/AuthContext.jsx";
import ProtectedRoute from "./Components/ProtectedRoute.jsx";
import Cart from "./Components/User/Cart.jsx";
import DynamicForm from "./Components/Merchant/DynamicForm.jsx";
import Store from "./Components/User/Store.jsx";
import Error404 from "./Components/Error404.jsx";
import OnBoard from "./Components/Merchant/Merchant.OnBoard.jsx";
import Terms from "./Components/User/Terms.jsx";
import Refund from "./Components/User/refund.jsx";
import Privacy from "./Components/User/privacy.jsx";
import About from "./Components/User/About.jsx";
import Wishlist from "./Components/User/Wishlist.jsx";
import ScrollToTop from "./Components/ScrollToTop.jsx";
import ProtectedRouteAdmin from "./Components/admin/ProtectedRouteAdmin.jsx";
import AdminLogin from "./Components/admin/Login.jsx";
import { AdminAuthContextProvider } from "./Context/AdminContext.jsx";
import Dashboard from "./Components/admin/Dashboard.jsx";
import ForgotPassword from "./Components/User/ForgotPassword.jsx";
import ResetPassword from "./Components/User/ResetPassword.jsx";
import ContactUs from "./Components/User/ContactUs.jsx";
import Bookings from "./Components/User/Bookings.jsx";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
    // queries : {
    //   staleTime : 1000 * 60 * 5
    // }
  },
});

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthContextProvider>
        <AdminAuthContextProvider>
          <QueryClientProvider client={queryClient}>
            <ScrollToTop />
            <Routes>
              <Route index element={<App />}></Route>
              <Route
                path="/dashboard/*"
                element={
                  <ProtectedRoute role="merchant">
                    <MerchantDashboard />
                  </ProtectedRoute>
                }
              ></Route>
              <Route path="/product" element={<Productpage />}></Route>
              <Route path="/login" element={<Login />}></Route>
              <Route path="/signup" element={<SignupPage />}></Route>
              <Route path="/cart" element={<Cart />}></Route>
              <Route path="/dynamicForm" element={<DynamicForm />}></Route>
              <Route path="/store" element={<Store />}></Route>
              <Route
                path="/onboard"
                element={
                  <ProtectedRoute>
                    <OnBoard />
                  </ProtectedRoute>
                }
              ></Route>
              <Route path="/terms" element={<Terms />}></Route>
              <Route path="/refund-policy" element={<Refund />}></Route>
              <Route path="/privacy-policy" element={<Privacy />}></Route>
              <Route path="/about-us" element={<About />}></Route>
              <Route path="/contact-us" element={<ContactUs />}></Route>
              <Route path="/wishlist" element={<Wishlist />}></Route>
              <Route path="/bookings" element={<Bookings />}></Route>
              <Route path="/forgot-password" element={<ForgotPassword />}></Route>
              <Route path="/reset-password/:token" element={<ResetPassword />}></Route>
              <Route
                path="/admin/dashboard"
                element={
                  <ProtectedRouteAdmin>
                    <Dashboard />
                  </ProtectedRouteAdmin>
                }
              ></Route>
              <Route path="/admin/login" element={<AdminLogin />}></Route>
              <Route path="*" element={<Error404 />}></Route>
            </Routes>
          </QueryClientProvider>
        </AdminAuthContextProvider>
      </AuthContextProvider>
    </BrowserRouter>
  </React.StrictMode>
);
