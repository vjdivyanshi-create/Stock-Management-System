import { useState } from "react";
import {
  LayoutDashboard,
  List,
  Box,
  BarChart3,
  Settings,
  FileDown,
  Bell,
  LogOut,
  FileText,
  FileSpreadsheet,
  File
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function ExportPage() {
  const SidebarItem = ({ icon: Icon, name, active }) => (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition ${
        active
          ? "bg-blue-100 text-blue-700 font-medium"
          : "text-slate-700 hover:bg-blue-100 hover:text-blue-700"
      }`}
    >
      <Icon size={18} />
      <span>{name}</span>
    </div>
  );

  const handleExport = (type) => {
    // Replace with real API later
    alert(`${type} downloaded`);
  };

  return (
  <div className="flex min-h-screen bg-gradient-to-br">

    
      <div className="max-w-7xl mx-auto mt-6">

        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Export Inventory Data
        </h1>

        <p className="text-slate-100 mb-8">
          Download your inventory reports in multiple formats.
        </p>

        <div className="grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-6">

          {/* PDF */}
          <div className="bg-white/80 backdrop-blur-md border p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Export PDF</h2>
              <FileText className="text-red-500" />
            </div>

            <p className="text-gray-500 mb-4">
              Download inventory report as a PDF file.
            </p>

            <button
              onClick={() => handleExport("PDF")}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 flex items-center gap-2"
            >
              Download PDF
            </button>
          </div>

          {/* CSV */}
          <div className="bg-white/80 backdrop-blur-md border p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Export CSV</h2>
              <File className="text-green-500" />
            </div>

            <p className="text-gray-500 mb-4">
              Export inventory data in CSV format.
            </p>

            <button
              onClick={() => handleExport("CSV")}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
            >
              Download CSV
            </button>
          </div>

          {/* EXCEL */}
          <div className="bg-white/80 backdrop-blur-md border p-6 rounded-xl shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Export Excel</h2>
              <FileSpreadsheet className="text-blue-500" />
            </div>

            <p className="text-gray-500 mb-4">
              Download inventory spreadsheet.
            </p>

            <button
              onClick={() => handleExport("Excel")}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
            >
              Download Excel
            </button>
          </div>

        </div>
      </div>
    
  </div>
);
}
