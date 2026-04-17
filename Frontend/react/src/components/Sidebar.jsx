import {
  LayoutDashboard,
  Boxes,
  List,
  PlusSquare,
  ShoppingCart,
  BarChart3,
  Settings,
  Download,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();

  return (
    <aside className="fixed left-0 top-0 flex h-screen w-64 flex-col justify-between border-r bg-white/80 p-6 shadow-lg backdrop-blur-xl">
      <div>
        <h2 className="mb-8 flex items-center gap-2 text-2xl font-bold text-indigo-600">
          <Boxes size={22} /> Inventory
        </h2>

        <p className="mb-2 text-xs text-gray-400">MAIN MENU</p>

        <SidebarItem name="Dashboard" icon={LayoutDashboard} onClick={() => navigate("/")} />
        <SidebarItem name="Inventory List" icon={List} onClick={() => navigate("/inventory")} />
        <SidebarItem name="Add Product" icon={PlusSquare} onClick={() => navigate("/add-product")} />
        <SidebarItem name="Orders" icon={ShoppingCart} onClick={() => navigate("/orders")} />
        <SidebarItem name="Report" icon={BarChart3} onClick={() => navigate("/report")} />

        <p className="mb-2 mt-6 text-xs text-gray-400">TOOLS</p>

        <SidebarItem name="Settings" icon={Settings} onClick={() => navigate("/settings")} />
        <SidebarItem name="Export" icon={Download} onClick={() => navigate("/export")} />
      </div>

      <div className="text-xs text-gray-400">Copyright 2026 Inventory System</div>
    </aside>
  );
}

function SidebarItem({ name, icon: Icon, onClick }) {
  return (
    <div
      onClick={onClick}
      className="flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-gray-600 transition hover:bg-gray-100"
    >
      <Icon size={18} />
      <span>{name}</span>
    </div>
  );
}
