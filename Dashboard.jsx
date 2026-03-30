import { Line, Doughnut } from "react-chartjs-2";
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

import {
  Boxes,
  AlertTriangle,
  ShoppingCart,
  DollarSign,
} from "lucide-react";

ChartJS.register(
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const salesChart = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Sales",
        data: [12, 19, 8, 15, 22, 10, 18],
        borderColor: "#4f46e5",
        backgroundColor: "rgba(79,70,229,0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Purchases",
        data: [5, 8, 12, 6, 9, 14, 7],
        borderColor: "#06b6d4",
        backgroundColor: "rgba(6,182,212,0.1)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const categoryChart = {
    labels: ["Electronics", "Clothing", "Home", "Toys", "Other"],
    datasets: [
      {
        data: [45, 25, 15, 8, 12],
        backgroundColor: [
          "#6366f1",
          "#f97316",
          "#22c55e",
          "#eab308",
          "#ec4899",
        ],
      },
    ],
  };

  const orders = [
    { id: "ORD-001", customer: "John Smith", amount: "$450", status: "Completed", date: "2026-02-12" },
    { id: "ORD-002", customer: "Sarah Johnson", amount: "$320", status: "Processing", date: "2026-02-12" },
    { id: "ORD-003", customer: "Mike Williams", amount: "$680", status: "Shipped", date: "2026-02-11" },
    { id: "ORD-004", customer: "Emma Davis", amount: "$250", status: "Pending", date: "2026-02-11" },
  ];

  const statusStyle = {
    Completed: "bg-green-100 text-green-700",
    Processing: "bg-blue-100 text-blue-700",
    Shipped: "bg-purple-100 text-purple-700",
    Pending: "bg-yellow-100 text-yellow-700",
  };

  return (
    <div className="max-w-7xl mx-auto">

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Products" value="128" sub="+5 this week" icon={Boxes} color="bg-indigo-500" />
        <StatCard title="Low Stock" value="12" sub="Needs attention" icon={AlertTriangle} color="bg-yellow-500" />
        <StatCard title="Orders" value="34" sub="Today" icon={ShoppingCart} color="bg-green-500" />
        <StatCard title="Revenue" value="$12,450" sub="+8.2%" icon={DollarSign} color="bg-purple-500" />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2 bg-white/80 p-6 rounded-2xl shadow">
          <h2 className="mb-4 font-semibold text-gray-700">Weekly Sales</h2>
          <Line data={salesChart} />
        </div>

        <div className="bg-white/80 p-6 rounded-2xl shadow">
          <h2 className="mb-4 font-semibold text-gray-700">Categories</h2>
          <Doughnut data={categoryChart} />
        </div>
      </div>

      {/* ORDERS */}
      <div className="bg-white/80 p-6 rounded-2xl shadow">
        <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>

        {orders.map((o) => (
          <div
            key={o.id}
            className="flex justify-between items-center p-4 mb-3 bg-white rounded-xl shadow-sm"
          >
            <div>
              <p className="font-medium">{o.customer}</p>
              <p className="text-xs text-gray-400">
                {o.id} • {o.date}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <span>{o.amount}</span>
              <span className={`px-3 py-1 text-xs rounded-full ${statusStyle[o.status]}`}>
                {o.status}
              </span>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}

// STAT CARD
function StatCard({ title, value, icon: Icon, color, sub }) {
  return (
    <div className="bg-white p-5 rounded-2xl shadow hover:shadow-lg transition">
      <div className="flex justify-between mb-3">
        <div className={`p-3 rounded-xl text-white ${color}`}>
          <Icon size={20} />
        </div>
        <span className="text-xs text-gray-400">{sub}</span>
      </div>

      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );
}