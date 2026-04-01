import React from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import AddProduct from "./pages/AddProduct";
import Report from "./pages/Report";
import SettingsPage from "./pages/Setting";
import ExportPage from "./pages/Export";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

export default function App() {
  const location = useLocation();

  // Titles for navbar
  const titles = {
    "/dashboard": "Dashboard",
    "/inventory": "Inventory",
    "/add-product": "Add Product",
    "/report": "Reports",
    "/settings": "Settings",
    "/export": "Export Data",
  };

  const path = location.pathname.replace(/\/$/, "");

  // Auth pages check
  const isAuthPage = ["/login", "/signup"].includes(path);

  return (
    <>
      {isAuthPage ? (
        // 🔐 AUTH PAGES (NO SIDEBAR / NAVBAR)
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      ) : (
        // 🧩 MAIN APP LAYOUT
        <div className="flex min-h-screen bg-slate-100">
          
          {/* Sidebar */}
          <div className="w-64 fixed h-full bg-white shadow">
            <Sidebar />
          </div>

          {/* Main Content */}
          <div className="flex-1 ml-64">
            
            {/* Navbar */}
            <Navbar title={titles[path] || "Dashboard"} />

            {/* Pages */}
            <div className="p-6">
              <Routes>
                {/* 🔥 Redirect root to login */}
                <Route path="/" element={<Navigate to="/login" />} />

                {/* Main routes */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/add-product" element={<AddProduct />} />
                <Route path="/report" element={<Report />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/export" element={<ExportPage />} />

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/login" />} />
              </Routes>
            </div>

          </div>
        </div>
      )}
    </>
  );
}