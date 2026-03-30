import { useEffect, useState } from "react";
import {
  DollarSign,
  Package,
  Layers,
} from "lucide-react";

import {
  Chart as ChartJS,
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Line, Pie } from "react-chartjs-2";

ChartJS.register(
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function Report() {
  const [inventory, setInventory] = useState([]);

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("inventory")) || [];
    setInventory(data);
  }, []);

  // Metrics
  const totalValue = inventory.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const totalProducts = inventory.length;

  const categories = {};
  inventory.forEach((item) => {
    categories[item.category] =
      (categories[item.category] || 0) + item.quantity;
  });

  // Charts
  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        data: [50000, 65000, 60000, 72000, 80000, totalValue],
        borderColor: "#6366f1",
        tension: 0.4,
      },
    ],
  };

  const pieData = {
    labels: Object.keys(categories),
    datasets: [
      {
        data: Object.values(categories),
        backgroundColor: [
          "#6366f1",
          "#22c55e",
          "#f59e0b",
          "#ef4444",
        ],
      },
    ],
  };

  return (
    <div className="relative">

      {/* GLOW BACKGROUND */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-indigo-300 opacity-30 blur-3xl rounded-full"></div>

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8 relative">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Reports Dashboard
          </h1>
          <p className="text-gray-500">
            Real-time analytics of your inventory
          </p>
        </div>

        <button className="flex items-center gap-2 
        bg-gradient-to-r from-indigo-600 to-blue-600 
        text-white px-5 py-2 rounded-xl shadow-lg 
        hover:scale-105 active:scale-95 transition-all">
          Export Report
        </button>
      </div>

      {/* METRICS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        <Card
          icon={DollarSign}
          title="Total Stock Value"
          value={`$${totalValue}`}
          sub="Live updated"
        />

        <Card
          icon={Package}
          title="Total Products"
          value={totalProducts}
          sub="Inventory count"
        />

        <Card
          icon={Layers}
          title="Categories"
          value={Object.keys(categories).length}
          sub="Product diversity"
        />

      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <div className="bg-white/70 backdrop-blur-2xl p-6 rounded-3xl shadow-xl border border-white/30 hover:shadow-2xl transition">
          <h2 className="font-semibold mb-4 text-gray-700">
            📈 Stock Value Trend
          </h2>
          <Line data={lineData} />
        </div>

        <div className="bg-white/70 backdrop-blur-2xl p-6 rounded-3xl shadow-xl border border-white/30 hover:shadow-2xl transition">
          <h2 className="font-semibold mb-4 text-gray-700">
            🧩 Category Distribution
          </h2>
          <Pie data={pieData} />
        </div>

      </div>
    </div>
  );
}

// METRIC CARD
function Card({ icon: Icon, title, value, sub }) {
  return (
    <div className="relative bg-white/70 backdrop-blur-xl p-6 rounded-3xl 
    shadow-lg border border-white/30 
    hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">

      <div className="absolute top-4 right-4 text-indigo-100">
        <Icon size={40} />
      </div>

      <p className="text-sm text-gray-500">{title}</p>

      <h2 className="text-3xl font-bold text-gray-800 mt-2">
        {value}
      </h2>

      <p className="text-xs text-green-500 mt-2">{sub}</p>
    </div>
  );
}