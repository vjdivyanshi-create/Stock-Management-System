import {
  LayoutDashboard,
  Boxes,
  List,
  PlusSquare,
  BarChart3,
  Settings,
  Download,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  return (
     <aside className="w-64 h-screen bg-white/80 backdrop-blur-xl border-r shadow-lg p-6 flex flex-col justify-between fixed left-0 top-0">
      <div>
        <h2 className="text-2xl font-bold text-indigo-600 mb-8 flex items-center gap-2">
          <Boxes size={22} /> Inventory
        </h2>

        <p className="text-xs text-gray-400 mb-2">MAIN MENU</p>

        <SidebarItem name="Dashboard" icon={LayoutDashboard} onClick={() => navigate("/")} />
        <SidebarItem name="Inventory List" icon={List} onClick={() => navigate("/inventory")} />
        <SidebarItem name="Add Product" icon={PlusSquare} onClick={() => navigate("/add-product")} />
        <SidebarItem name="Report" icon={BarChart3} onClick={() => navigate("/report")} />

        <p className="text-xs text-gray-400 mt-6 mb-2">TOOLS</p>

        <SidebarItem name="Settings" icon={Settings} onClick={() => navigate("/settings")} />
        <SidebarItem name="Export" icon={Download} onClick={() => navigate("/export")} />
      </div>

      <div className="text-xs text-gray-400">
        © 2026 Inventory System
      </div>
    </aside>
  );
}

function SidebarItem({ name, icon: Icon, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer text-gray-600 hover:bg-gray-100 transition"
    >
      <Icon size={18} />
      <span>{name}</span>
    </div>
  );
}