import React, { useEffect } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Dashboard from "./Pages/Dashboard";
import Inventory from "./Pages/Inventory";
import AddProduct from "./Pages/AddProduct";
import Orders from "./Pages/Orders";
import Report from "./Pages/Report";
import SettingsPage from "./Pages/Setting";
import ExportPage from "./Pages/Export";
import Login from "./Pages/Login";
import Signup from "./Pages/Signup";
import { api } from "./lib/api";
import { getSessionUser, initializeSessionStorage, isSessionLoggedIn } from "./lib/session";
import { applyTheme, initializeTheme } from "./lib/theme";

initializeSessionStorage();
initializeTheme();

export default function App() {
  const location = useLocation();
  const isLoggedIn = isSessionLoggedIn();
  const currentUser = getSessionUser();

  const titles = {
    "/dashboard": "Dashboard",
    "/inventory": "Inventory",
    "/add-product": "Add Product",
    "/orders": "Orders",
    "/report": "Reports",
    "/settings": "Settings",
    "/export": "Export Data",
  };

  const path = location.pathname.replace(/\/$/, "");
  const isAuthPage = ["/login", "/signup"].includes(path);

  const ProtectedRoute = ({ children }) => {
    return isLoggedIn ? children : <Navigate to="/login" />;
  };

  useEffect(() => {
    if (!isLoggedIn || !currentUser?.email) {
      applyTheme("light");
      return;
    }

    const syncTheme = async () => {
      try {
        const settings = await api.get(`/settings/${encodeURIComponent(currentUser.email)}`);
        applyTheme(settings.theme || "light");
      } catch {
        applyTheme("light");
      }
    };

    syncTheme();
  }, [currentUser?.email, isLoggedIn]);

  return (
    <>
      {isAuthPage ? (
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      ) : (
        <div className="flex min-h-screen bg-slate-100">
          <div className="w-64 fixed h-full bg-white shadow">
            <Sidebar />
          </div>

          <div className="flex-1 ml-64">
            <Navbar title={titles[path] || "Dashboard"} />

            <div className="p-6">
              <Routes>
                <Route path="/" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />

                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/inventory"
                  element={
                    <ProtectedRoute>
                      <Inventory />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/add-product"
                  element={
                    <ProtectedRoute>
                      <AddProduct />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/orders"
                  element={
                    <ProtectedRoute>
                      <Orders />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/report"
                  element={
                    <ProtectedRoute>
                      <Report />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <SettingsPage />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/export"
                  element={
                    <ProtectedRoute>
                      <ExportPage />
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
              </Routes>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
