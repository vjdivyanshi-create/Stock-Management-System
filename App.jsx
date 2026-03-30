import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

import Dashboard from "./Pages/Dashboard";
import Inventory from "./Pages/Inventory";
import AddProduct from "./Pages/AddProduct";
import Report from "./Pages/Report";
import SettingsPage from "./Pages/Setting";
import ExportPage from "./Pages/Export";

export default function App() {

  // ✅ ADD THIS
  const location = useLocation();

  // ✅ TITLES MAP
  const titles = {
    "/": "Dashboard",
    "/inventory": "Inventory",
    "/add-product": "Add Product",
    "/report": "Reports",
    "/settings": "Settings",
    "/export": "Export Data",
  };

  // ✅ HANDLE TRAILING SLASH ISSUE
  const path = location.pathname.replace(/\/$/, "");

  return (
    <div className="flex min-h-screen bg-slate-100">

      {/* SIDEBAR */}
      <div className="w-64 fixed h-full bg-white shadow">
        <Sidebar />
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 ml-64">

        {/* ✅ NAVBAR WITH DYNAMIC TITLE */}
        <Navbar title={titles[path] || "Dashboard"} />

        {/* PAGE CONTENT */}
        <div className="p-6">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/add-product" element={<AddProduct />} />
            <Route path="/report" element={<Report />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/export" element={<ExportPage />} />
          </Routes>
        </div>

      </div>
    </div>
  );
}