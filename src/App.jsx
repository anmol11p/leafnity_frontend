import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AppLayout from "./layout/AppLayout/AppLayout";
import Product from "./pages/Product";
import Cart from "./pages/cartComponent/Cart";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Address from "./pages/Address";
import ErrorPage from "./pages/ErrorPage";
import Home from "./pages/Home";
import AccountLayout from "./layout/AccountLayout/AccountLayout";
import UserProfile from "./pages/Account/UserProfile";
import ChangePassword from "./pages/Account/ChangePassword";
import SingleAddress from "./pages/Account/Address";
import Order from "./pages/Account/Order";
import AllOrders from "./pages/AllOrders";
import CustomerCare from "./pages/Account/CustomerCare";
import ResetPassword from "./pages/ResetPassword";
function App() {
  const Router = createBrowserRouter([
    {
      path: "/",
      element: <AppLayout />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/products",
          element: <Product />,
        },
        {
          path: "/",
          element: <Home />,
        },
        {
          path: "/cart",
          element: <Cart />,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/reset-password/:token",
          element: <ResetPassword />,
        },
        {
          path: "/orders",
          element: <AllOrders />,
        },
        {
          path: "/signup",
          element: <SignUp />,
        },
        {
          path: "/addresses",
          element: <Address />,
        },
        {
          path: "/account",
          element: <AccountLayout />,
          children: [
            {
              path: "/account",
              element: <UserProfile />,
            },
            {
              path: "profile",
              element: <UserProfile />,
            },
            {
              path: "changePassword",
              element: <ChangePassword />,
            },
            {
              path: "address",
              element: <SingleAddress />,
            },
            {
              path: "order",
              element: <Order />,
            },
            {
              path: "customerCare",
              element: <CustomerCare />,
            },
          ],
        },
      ],
    },
  ]);
  return <RouterProvider router={Router} />;
}

export default App;
