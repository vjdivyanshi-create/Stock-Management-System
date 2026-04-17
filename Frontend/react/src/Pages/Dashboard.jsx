import { useEffect, useMemo, useState } from "react";
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
  Filler,
} from "chart.js";
import { Boxes, AlertTriangle, ShoppingCart, DollarSign, Pencil, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";

ChartJS.register(
  LineElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler
);

const EMPTY_SUMMARY = {
  totalProducts: 0,
  lowStock: 0,
  totalQuantity: 0,
  totalSales: 0,
  totalOrders: 0,
  categories: {},
  recentOrders: [],
  recentOrderAnalysis: [],
  weeklyOrders: {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    revenue: [0, 0, 0, 0, 0, 0, 0],
    quantities: [0, 0, 0, 0, 0, 0, 0],
  },
};

function buildAnalysisSeries(orders, days) {
  const dailyMap = new Map();
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - (days - 1));

  for (let index = 0; index < days; index += 1) {
    const current = new Date(start);
    current.setDate(start.getDate() + index);
    const key = current.toISOString().slice(0, 10);
    dailyMap.set(key, {
      label: current.toLocaleDateString("en-US", days <= 7 ? { weekday: "short" } : { month: "short", day: "numeric" }),
      sales: 0,
      units: 0,
      count: 0,
    });
  }

  orders.forEach((order) => {
    const createdAt = new Date(order.createdAt);
    createdAt.setHours(0, 0, 0, 0);
    const key = createdAt.toISOString().slice(0, 10);
    const bucket = dailyMap.get(key);

    if (!bucket) {
      return;
    }

    bucket.sales += Number(order.totalAmount) || 0;
    bucket.units += Number(order.quantity) || 0;
    bucket.count += 1;
  });

  const values = Array.from(dailyMap.values());

  return {
    labels: values.map((item) => item.label),
    sales: values.map((item) => item.sales),
    units: values.map((item) => item.units),
    count: values.map((item) => item.count),
  };
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [rangeDays, setRangeDays] = useState(7);
  const [error, setError] = useState("");
  const [deletingOrderId, setDeletingOrderId] = useState("");

  const loadSummary = async (days = rangeDays) => {
    try {
      const data = await api.get(`/reports/summary?days=${days}`);
      setSummary((current) => ({
        ...current,
        ...data,
      }));
      setError("");
    } catch (apiError) {
      setError(apiError.message);
    }
  };

  useEffect(() => {
    loadSummary(rangeDays);
  }, [rangeDays]);

  const categoryLabels = useMemo(() => {
    const labels = Object.keys(summary.categories || {});
    return labels.length ? labels : ["No Data"];
  }, [summary.categories]);

  const analysisSeries = useMemo(
    () => buildAnalysisSeries(summary.recentOrderAnalysis || [], rangeDays),
    [summary.recentOrderAnalysis, rangeDays]
  );

  const salesChart = {
    labels: analysisSeries.labels,
    datasets: [
      {
        label: "Sales ($)",
        data: analysisSeries.sales,
        borderColor: "#4f46e5",
        backgroundColor: "rgba(79, 70, 229, 0.12)",
        tension: 0.35,
        fill: true,
        yAxisID: "sales",
      },
      {
        label: "Orders Placed",
        data: analysisSeries.count,
        borderColor: "#06b6d4",
        backgroundColor: "rgba(6, 182, 212, 0.08)",
        tension: 0.35,
        fill: false,
        yAxisID: "orders",
      },
    ],
  };

  const salesChartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    interaction: {
      mode: "index",
      intersect: false,
    },
    scales: {
      sales: {
        type: "linear",
        position: "left",
        beginAtZero: true,
        ticks: {
          callback: (value) => `$${value}`,
        },
      },
      orders: {
        type: "linear",
        position: "right",
        beginAtZero: true,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          precision: 0,
        },
      },
    },
  };

  const categoryChart = {
    labels: categoryLabels,
    datasets: [
      {
        data: categoryLabels[0] === "No Data" ? [1] : categoryLabels.map((label) => summary.categories[label]),
        backgroundColor: ["#6366f1", "#f97316", "#22c55e", "#eab308", "#ec4899"],
      },
    ],
  };

  const handleDeleteOrder = async (orderId) => {
    setDeletingOrderId(orderId);

    try {
      await api.delete(`/orders/${orderId}`);
      await loadSummary(rangeDays);
    } catch (apiError) {
      setError(apiError.message);
    } finally {
      setDeletingOrderId("");
    }
  };

  return (
    <div className="mx-auto max-w-7xl">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500">Live overview of inventory and customer orders</p>
      </div>

      {error && (
        <div className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="my-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Products" value={summary.totalProducts} sub="Inventory items" icon={Boxes} color="bg-indigo-500" />
        <StatCard title="Low Stock" value={summary.lowStock} sub="Needs attention" icon={AlertTriangle} color="bg-yellow-500" />
        <StatCard title="Orders" value={summary.totalOrders} sub="Recent orders" icon={ShoppingCart} color="bg-green-500" />
        <StatCard title="Sales" value={`$${summary.totalSales}`} sub="Order revenue" icon={DollarSign} color="bg-purple-500" />
      </div>

      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="rounded-2xl bg-white/80 p-6 shadow lg:col-span-2">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold text-gray-700">Order Analysis</h2>
              <p className="text-sm text-gray-400">Switch between the last 7 days and the last 30 days of placed orders.</p>
            </div>

            <div className="inline-flex rounded-xl bg-slate-100 p-1">
              {[7, 30].map((days) => (
                <button
                  key={days}
                  type="button"
                  onClick={() => setRangeDays(days)}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                    rangeDays === days ? "bg-white text-indigo-700 shadow-sm" : "text-slate-500"
                  }`}
                >
                  {days === 7 ? "7 Days" : "30 Days"}
                </button>
              ))}
            </div>
          </div>

          <Line data={salesChart} options={salesChartOptions} />

          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="text-slate-500">
                <tr className="border-b border-slate-100">
                  <th className="py-3 pr-4 font-medium">Customer</th>
                  <th className="py-3 pr-4 font-medium">Product</th>
                  <th className="py-3 pr-4 font-medium">Qty</th>
                  <th className="py-3 pr-4 font-medium">Total</th>
                  <th className="py-3 pr-4 font-medium">Status</th>
                  <th className="py-3 font-medium">Placed</th>
                </tr>
              </thead>
              <tbody>
                {summary.recentOrderAnalysis?.length ? (
                  summary.recentOrderAnalysis.map((order) => (
                    <tr key={order._id} className="border-b border-slate-50 text-slate-600 last:border-b-0">
                      <td className="py-3 pr-4">{order.customerName}</td>
                      <td className="py-3 pr-4">{order.productName}</td>
                      <td className="py-3 pr-4">{order.quantity}</td>
                      <td className="py-3 pr-4">${order.totalAmount}</td>
                      <td className="py-3 pr-4">
                        <span className={`rounded-full px-2.5 py-1 text-xs ${statusStyle[order.status] || statusStyle.Completed}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="py-3">{formatDateTime(order.createdAt)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="py-6 text-center text-gray-400">
                      No orders found in this time window.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-2xl bg-white/80 p-6 shadow">
          <h2 className="mb-4 font-semibold text-gray-700">Categories</h2>
          <Doughnut data={categoryChart} />
        </div>
      </div>

      <div className="rounded-2xl bg-white/80 p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold">Recent Orders</h2>

        {summary.recentOrders?.length ? (
          summary.recentOrders.map((order) => (
            <div
              key={order._id}
              className="mb-3 rounded-xl bg-white p-4 shadow-sm"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-medium">{order.customerName}</p>
                  <p className="text-xs text-gray-400">
                    {order.productName} ({order.productSku}) | {formatDate(order.createdAt)}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <span>${order.totalAmount}</span>
                  <span className={`rounded-full px-3 py-1 text-xs ${statusStyle[order.status] || statusStyle.Completed}`}>
                    {order.status}
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate("/orders", { state: { order } })}
                    className="inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-2 text-sm font-medium text-indigo-700 transition hover:bg-indigo-100"
                  >
                    <Pencil size={15} />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteOrder(order._id)}
                    disabled={deletingOrderId === order._id}
                    className="inline-flex items-center gap-2 rounded-lg bg-red-50 px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Trash2 size={15} />
                    {deletingOrderId === order._id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-xl border border-dashed border-gray-200 px-4 py-8 text-center text-sm text-gray-400">
            No orders yet. Create your first order from the Orders page.
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, sub }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow transition hover:shadow-lg">
      <div className="mb-3 flex justify-between">
        <div className={`rounded-xl p-3 text-white ${color}`}>
          <Icon size={20} />
        </div>
        <span className="text-xs text-gray-400">{sub}</span>
      </div>

      <p className="text-sm text-gray-500">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );
}

const statusStyle = {
  Completed: "bg-green-100 text-green-700",
  Processing: "bg-blue-100 text-blue-700",
  Pending: "bg-yellow-100 text-yellow-700",
};

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatDateTime(value) {
  return new Date(value).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}
